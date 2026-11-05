"""Real HTML/PDF conversion; all email/HTTP delivery is mocked."""
import base64
from email.message import EmailMessage
from io import BytesIO
from unittest.mock import Mock

import pytest
from pypdf import PdfReader


def estimate(api, kind="move_in", detail="apartment", area="20-30"):
    return api.get_estimate(api.EstimateRequest(
        cleaning_type=kind, detail_type=detail, area_range=area,
    ))


@pytest.mark.parametrize("kind,detail,area,amount,label", [
    ("move_in", "apartment", "20-30", "300,000원", "아파트"),
    ("office", "office", "over-50", "750,000원부터", "사무실"),
    ("partial", "bathroom", None, "80,000원", "해당 없음"),
    ("special", "hoarding-home", None, "750,000원", "쓰레기집 / 방치 공간"),
])
def test_real_pdf_has_korean_table(api, kind, detail, area, amount, label):
    doc = api.build_estimate_document(estimate(api, kind, detail, area))
    assert doc.pdf.startswith(b"%PDF-")
    reader = PdfReader(BytesIO(doc.pdf))
    assert len(reader.pages) == 1
    text = reader.pages[0].extract_text()
    for expected in ["청소 종류", "공간 / 항목", "면적", "산정 기준", "예상 금액", amount, label]:
        assert expected in text
    assert amount in doc.text
    assert doc.filename.endswith(".pdf")


def test_html_escapes_text_and_blocks_external_assets(api):
    from estimate_pdf import render_estimate_html, resolve_asset
    data = estimate(api)
    data["message"] = '<img src="https://example.com/private">'
    html, _ = render_estimate_html(data)
    assert '&lt;img' in html
    assert '<img src="https://example.com/private">' not in html
    for path in ["https://example.com/a.png", "../config/.env", "file:///etc/passwd"]:
        with pytest.raises(ValueError):
            resolve_asset(path)


def test_same_pdf_generated_once_for_customer_and_admin(api, monkeypatch):
    monkeypatch.setenv("ADMIN_NOTIFICATION_EMAIL", "admin@example.com")
    build = Mock(wraps=api.build_estimate_document)
    send = Mock()
    monkeypatch.setattr(api, "build_estimate_document", build)
    monkeypatch.setattr(api, "send_email_in_background", send)
    api.send_estimate_emails_in_background("customer@example.com", estimate(api))
    assert build.call_count == 1
    assert send.call_count == 2
    messages = [call.args[0] for call in send.call_args_list]
    assert [str(msg["To"]) for msg in messages] == ["customer@example.com", "admin@example.com"]
    attachments = [list(msg.iter_attachments()) for msg in messages]
    assert all(len(parts) == 1 for parts in attachments)
    parts = [items[0] for items in attachments]
    assert all(part.get_content_type() == "application/pdf" for part in parts)
    assert parts[0].get_payload(decode=True) == parts[1].get_payload(decode=True)
    assert parts[0].get_payload(decode=True).startswith(b"%PDF-")
    assert "customer@example.com" in messages[1].get_body().get_content()


def test_conversion_failure_does_not_send_broken_email(api, monkeypatch):
    monkeypatch.setattr(api, "build_estimate_document", Mock(side_effect=RuntimeError("private data")))
    send = Mock()
    monkeypatch.setattr(api, "send_email_in_background", send)
    api.send_estimate_emails_in_background("customer@example.com", estimate(api))
    send.assert_not_called()


def test_email_endpoint_runs_pdf_task_with_server_amount(client, api, monkeypatch):
    for key, value in {
        "BREVO_API_KEY": "fake", "BREVO_SENDER_EMAIL": "sender@example.com",
        "SMTP_SERVER": "smtp.example.com", "SMTP_USER": "sender@example.com",
        "SMTP_PASSWORD": "fake", "SMTP_PORT": "465", "ADMIN_NOTIFICATION_EMAIL": "admin@example.com",
    }.items():
        monkeypatch.setenv(key, value)
    send = Mock()
    monkeypatch.setattr(api, "send_email_in_background", send)
    result = client.post("/estimate/email", json={
        "cleaning_type": "move_in", "detail_type": "apartment", "area_range": "20-30",
        "recipient_email": " CUSTOMER@EXAMPLE.COM ", "estimated_amount": 1,
    })
    assert result.status_code == 202
    assert send.call_count == 2
    msg = send.call_args_list[0].args[0]
    assert msg["To"] == "customer@example.com"
    assert "300,000원" in msg.get_body().get_content()
    pdf = next(msg.iter_attachments()).get_payload(decode=True)
    assert "300,000원" in PdfReader(BytesIO(pdf)).pages[0].extract_text()


def test_transport_preserves_pdf_attachment(api, monkeypatch):
    msg = EmailMessage()
    msg["To"] = "customer@example.com"
    msg["Subject"] = "견적 테스트"
    msg.set_content("예상 금액: 300,000원")
    pdf = b"%PDF-test-attachment"
    msg.add_attachment(pdf, maintype="application", subtype="pdf", filename="estimate.pdf")
    if hasattr(api, "get_smtp_config"):
        smtp = Mock()
        smtp.return_value.__enter__ = Mock(return_value=smtp)
        smtp.return_value.__exit__ = Mock(return_value=False)
        monkeypatch.setattr(api, "get_smtp_config", lambda: ("smtp.example.com", 465, "sender@example.com", "fake"))
        monkeypatch.setattr(api.smtplib, "SMTP_SSL", smtp)
        api.send_email_in_background(msg)
        sent = smtp.send_message.call_args.args[0]
        assert next(sent.iter_attachments()).get_payload(decode=True) == pdf
    else:
        monkeypatch.setenv("BREVO_API_KEY", "fake")
        monkeypatch.setenv("BREVO_SENDER_EMAIL", "sender@example.com")
        post = Mock(return_value=Mock(status_code=201))
        monkeypatch.setattr(api.requests, "post", post)
        api.send_email_in_background(msg)
        payload = post.call_args.kwargs["json"]
        assert "300,000원" in payload["textContent"]
        assert payload["attachment"][0]["name"] == "estimate.pdf"
        assert base64.b64decode(payload["attachment"][0]["content"]) == pdf


def test_plain_email_transport_still_works(api, monkeypatch):
    if hasattr(api, "get_smtp_config"):
        pytest.skip("Plain SMTP behavior already uses send_message unchanged")
    monkeypatch.setenv("BREVO_API_KEY", "fake")
    monkeypatch.setenv("BREVO_SENDER_EMAIL", "sender@example.com")
    post = Mock(return_value=Mock(status_code=201))
    monkeypatch.setattr(api.requests, "post", post)
    msg = EmailMessage()
    msg["To"] = "customer@example.com"
    msg["Subject"] = "회원가입"
    msg.set_content("환영합니다.")
    api.send_email_in_background(msg)
    payload = post.call_args.kwargs["json"]
    assert "attachment" not in payload
    assert "환영합니다." in payload["textContent"]
