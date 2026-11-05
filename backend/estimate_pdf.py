"""Render the server-calculated estimate as HTML and an in-memory PDF."""
from dataclasses import dataclass
from datetime import datetime, timezone, timedelta
from io import BytesIO
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from xhtml2pdf import pisa
from xhtml2pdf.config.resources import ResourceAccessPolicy

BASE_DIR = Path(__file__).resolve().parent
ASSETS = BASE_DIR / "assets"
PDF_FILENAME = "j-cleaning-estimate.pdf"
CLEANING_LABELS = {
    "move_in": "입주 청소", "move_out": "이사 청소", "residence": "거주 청소",
    "office": "상가/사무실", "special": "특수 청소", "partial": "부분 청소",
}
DETAIL_LABELS = {
    "apartment": "아파트", "villa": "빌라", "officetel": "오피스텔", "house": "주택",
    "office": "사무실", "restaurant-cafe": "식당/카페", "academy-hospital": "학원/병원",
    "store": "일반 상가/매장", "bathroom": "화장실 / 욕실 집중", "kitchen": "주방 / 싱크대 집중",
    "balcony": "창틀 / 베란다", "floor": "방 바닥 / 거실 마루", "refrigerator": "냉장고 / 가전 내부",
    "air-conditioner": "에어컨 필터 및 분해", "hoarding-home": "쓰레기집 / 방치 공간",
    "large-waste": "대형 폐기물 수거", "estate-cleanout": "유품 정리 / 빈집 정리",
    "fire-damage": "화재 / 그을음 현장", "water-damage": "누수 / 침수 피해 복구",
    "pet-waste": "반려동물 오염 공간",
}
AREA_LABELS = {
    "under-10": "10평 이하", "10-20": "10평 ~ 20평", "20-30": "20평 ~ 30평",
    "30-40": "30평 ~ 40평", "40-50": "40평 ~ 50평", "over-50": "50평 이상",
}
_ENV = Environment(loader=FileSystemLoader(BASE_DIR / "templates"),
                   autoescape=select_autoescape(["html"]))

@dataclass(frozen=True)
class EstimateDocument:
    html: str
    text: str
    pdf: bytes
    filename: str = PDF_FILENAME


def resolve_asset(uri: str, basepath=None) -> str:
    # Only bundled assets are readable; never fetch recipient-controlled URLs.
    allowed = {"NanumGothic-Regular.ttf", "NanumGothic-Bold.ttf", "j-cleaning-logo.png"}
    if uri not in allowed:
        raise ValueError("Unsupported PDF asset")
    return str(ASSETS / uri)


def render_estimate_html(estimate: dict) -> tuple[str, str]:
    amount = f"{estimate['estimated_amount']:,}원"
    if estimate["is_starting_estimate"]:
        amount += "부터"
    rows = [
        ("청소 종류", CLEANING_LABELS[estimate["cleaning_type"]]),
        ("공간 / 항목", DETAIL_LABELS[estimate["detail_type"]]),
        ("면적", AREA_LABELS.get(estimate.get("area_range"), "해당 없음")),
        ("산정 기준", estimate["calculation"]),
        ("예상 금액", amount),
    ]
    issued_at = datetime.now(timezone(timedelta(hours=9))).strftime("%Y.%m.%d")
    html = _ENV.get_template("estimate.html").render(
        rows=rows, message=estimate["message"], issued_at=issued_at,
    )
    text = ("안녕하세요. 제이클리닝 예상 견적 결과입니다.\n\n"
            + "\n".join(f"{label}: {value}" for label, value in rows)
            + f"\n\n{estimate['message']}\n")
    return html, text


def build_estimate_document(estimate: dict) -> EstimateDocument:
    html, text = render_estimate_html(estimate)
    output = BytesIO()
    result = pisa.CreatePDF(
        html, dest=output, encoding="utf-8", link_callback=resolve_asset,
        resource_policy=ResourceAccessPolicy(allow_remote=False, base_dir=ASSETS),
        context_meta={"title": "제이클리닝 예상 견적서", "author": "제이클리닝"},
    )
    if result.err:
        raise RuntimeError("Estimate PDF conversion failed")
    pdf = output.getvalue()
    if not pdf.startswith(b"%PDF-"):
        raise RuntimeError("Estimate PDF is empty or invalid")
    return EstimateDocument(html=html, text=text, pdf=pdf)
