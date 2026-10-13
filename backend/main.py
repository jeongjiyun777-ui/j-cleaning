from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, field_validator, model_validator
from fastapi import BackgroundTasks, HTTPException, status, Depends
from sqlalchemy import bindparam, text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from email.message import EmailMessage

import os
import jwt
import requests
import re
import secrets
import hashlib
from datetime import date, datetime, timedelta, timezone
from pwdlib import PasswordHash
from pathlib import Path
from dotenv import load_dotenv
from typing import Annotated, Literal

from sqlalchemy import URL, create_engine, text

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / "config" / ".env"

load_dotenv(dotenv_path=ENV_FILE)

DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    host=os.environ["DB_HOST"],
    port=int(os.environ["DB_PORT"]),
    database=os.environ["DB_NAME"],
)


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

print("DB_HOST:", DATABASE_URL.host, flush=True)
print("DB_PORT:", DATABASE_URL.port, flush=True)
print("DB_NAME:", DATABASE_URL.database, flush=True)
print("DB_USER:", DATABASE_URL.username, flush=True)

ADMIN_NAME = os.environ["ADMIN_NAME"]
ADMIN_USERNAME = os.environ["ADMIN_USERNAME"]
ADMIN_PASSWORD_HASH = os.environ["ADMIN_PASSWORD_HASH"]

password_hasher = PasswordHash.recommended()

SECRET_KEY = os.environ["SESSION_SECRET"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"

security = HTTPBearer()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_customers(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        customer_id = payload.get("id") or payload.get("customer_id")
        role = payload.get("role")

        if not customer_id or role != "customer":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="고객 권한이 필요합니다.",
            )
        return int(customer_id)
    except (jwt.PyJWTError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰이 유효하지 않거나 만료되었습니다.",
        )

def get_current_manager(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        manager_id = payload.get("manager_id") or payload.get("id")
        role = payload.get("role")

        if not manager_id or role != "manager":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="관리자 권한이 필요합니다.",
            )
        return int(manager_id)
    except (jwt.PyJWTError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰이 유효하지 않거나 만료되었습니다.",
        )

def get_current_user_payload(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"require": ["exp", "id", "role"]},
        )
        user_id = int(payload["id"])
        role = payload["role"]

        if user_id <= 0 or role not in ("manager", "customer"):
            raise ValueError("잘못된 사용자 정보")

        return {"id": user_id, "role": role}
    except (jwt.PyJWTError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰이 유효하지 않거나 만료되었습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

def store_refresh_token(connection, user_id: int, role: str) -> str:
    token = secrets.token_urlsafe(48)
    connection.execute(
        text("""
            INSERT INTO refresh_tokens (token_hash, manager_id, customer_id, expires_at)
            VALUES (:token_hash, :manager_id, :customer_id, :expires_at)
        """),
        {
            "token_hash": hashlib.sha256(token.encode()).hexdigest(),
            "manager_id": user_id if role == "manager" else None,
            "customer_id": user_id if role == "customer" else None,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        },
    )
    return token


def set_refresh_cookie(response: Response, token: str):
    response.set_cookie(
        key="refresh_token",
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/",
    )
    response.headers["Cache-Control"] = "no-store"


app = FastAPI()


@app.middleware("http")
async def prevent_sensitive_response_caching(request: Request, call_next):
    response = await call_next(request)
    if request.url.path in {
        "/register",
        "/customers/check-username",
        "/find-id",
        "/reset-password/check-account",
        "/reset-password",
    }:
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

class UsernameCheckRequest(BaseModel):
    username: str

class FindIdRequest(BaseModel):
    name: str
    phone: str
    birth_date: date

class AccountCheckRequest(BaseModel):
    username: str
    name: str
    phone: str
    birth_date: date


class NoticeCreateRequest(BaseModel):
    title: str = Field(min_length=1, max_length=70)
    content: str = Field(min_length=1)
    is_pinned: bool = False


class NoticeDeleteRequest(BaseModel):
    notice_ids: list[int] = Field(min_length=1)


class NoticeDraftDeleteRequest(BaseModel):
    draft_ids: list[int] = Field(min_length=1)


class Register(BaseModel):
    name: str = Field(min_length=1, max_length=15)
    username: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=8, max_length=64)
    birth_date: date
    phone: str = Field(pattern=r"^010\d{8}$")
    
    
    @field_validator("username")
    @classmethod
    def validate_username(cls, username: str) -> str:
        username = username.strip().lower()

        if not re.fullmatch(
            r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$",
            username,
        ):
            raise ValueError("올바른 이메일 형식을 입력해 주세요.")

        return username

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str) -> str:

        if not re.search(r"[A-Za-z]", password):
            raise ValueError("비밀번호에는 영문이 포함되어야 합니다.")

        if not re.search(r"\d", password):
            raise ValueError("비밀번호에는 숫자가 포함되어야 합니다.")

        if not re.search(r"[^A-Za-z0-9]", password):
            raise ValueError("비밀번호에는 특수문자가 포함되어야 합니다.")

        return password

class EstimateRequest(BaseModel):
    cleaning_type: Literal[
        "move_in",
        "move_out",
        "residence",
        "office",
        "special",
        "partial",
    ]
    detail_type: str = Field(min_length=1)
    area_range: Literal[
        "under-10",
        "10-20",
        "20-30",
        "30-40",
        "40-50",
        "over-50",
    ] | None = None

    @field_validator("cleaning_type", "detail_type", "area_range", mode="before")
    @classmethod
    def trim_selection_values(cls, value):
        return value.strip() if isinstance(value, str) else value

    @model_validator(mode="after")
    def validate_estimate_selection(self):
        residential_types = {"apartment", "villa", "officetel", "house"}
        commercial_types = {"office", "restaurant-cafe", "academy-hospital", "store"}
        partial_types = {
            "bathroom",
            "kitchen",
            "balcony",
            "floor",
            "refrigerator",
            "air-conditioner",
        }
        special_types = {
            "hoarding-home",
            "large-waste",
            "estate-cleanout",
            "fire-damage",
            "water-damage",
            "pet-waste",
        }

        allowed_details = {
            "move_in": residential_types,
            "move_out": residential_types,
            "residence": residential_types,
            "office": commercial_types,
            "partial": partial_types,
            "special": special_types,
        }[self.cleaning_type]

        if self.detail_type not in allowed_details:
            raise ValueError(
                "세부 선택 항목이 청소 유형과 일치하지 않습니다."
            )

        requires_area = self.cleaning_type in {
            "move_in",
            "move_out",
            "residence",
            "office",
        }
        if requires_area and self.area_range is None:
            raise ValueError("주거·상가 청소는 평수 구간을 선택해 주세요.")
        if not requires_area and self.area_range is not None:
            raise ValueError("부분·특수 청소에는 평수 구간을 전달하지 않습니다.")

        return self


class EstimateEmailRequest(EstimateRequest):
    recipient_email: str = Field(min_length=5, max_length=254)

    @field_validator("recipient_email", mode="before")
    @classmethod
    def normalize_recipient_email(cls, value):
        if isinstance(value, str):
            value = value.strip().lower()
            if not re.fullmatch(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", value):
                raise ValueError("올바른 이메일 주소를 입력해 주세요.")
        return value


class ResetPasswordRequest(BaseModel):
    name: str
    username: str
    phone: str
    birth_date: date
    new_password: str = Field(min_length=8, max_length=64)

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, new_password: str) -> str:
        if re.search(r"\s", new_password):
            raise ValueError("비밀번호에는 공백을 넣을 수 없습니다.")

        if not re.search(r"[A-Za-z]", new_password):
            raise ValueError("비밀번호에는 영문이 포함되어야 합니다.")

        if not re.search(r"\d", new_password):
            raise ValueError("비밀번호에는 숫자가 포함되어야 합니다.")

        if not re.search(r"[^A-Za-z0-9]", new_password):
            raise ValueError("비밀번호에는 특수문자가 포함되어야 합니다.")

        return new_password


ESTIMATE_AREA_PYEONG = {
    "under-10": 10,
    "10-20": 15,
    "20-30": 25,
    "30-40": 35,
    "40-50": 45,
    "over-50": 50,
}

ESTIMATE_RATE_PER_PYEONG = {
    "move_in": 12_000,
    "move_out": 13_000,
    "residence": 15_000,
    "office": 15_000,
}

FIXED_ESTIMATE_AMOUNTS = {
    "partial": {
        "bathroom": 80_000,
        "kitchen": 100_000,
        "balcony": 80_000,
        "floor": 100_000,
        "refrigerator": 80_000,
        "air-conditioner": 120_000,
    },
    "special": {
        "hoarding-home": 750_000,
        "large-waste": 300_000,
        "estate-cleanout": 400_000,
        "fire-damage": 600_000,
        "water-damage": 500_000,
        "pet-waste": 400_000,
    },
}


@app.get("/estimate")
def get_estimate(request: Annotated[EstimateRequest, Query()]):
    if request.cleaning_type in ESTIMATE_RATE_PER_PYEONG:
        area_pyeong = ESTIMATE_AREA_PYEONG[request.area_range]
        rate_per_pyeong = ESTIMATE_RATE_PER_PYEONG[request.cleaning_type]
        amount = area_pyeong * rate_per_pyeong
        is_starting_estimate = request.area_range == "over-50"
        calculation = f"{area_pyeong}평 × {rate_per_pyeong:,}원"
        pricing_basis = "per_pyeong"
    else:
        amount = FIXED_ESTIMATE_AMOUNTS[request.cleaning_type][request.detail_type]
        is_starting_estimate = False
        calculation = "선택 항목별 참고 금액"
        pricing_basis = "fixed_reference"

    return {
        "cleaning_type": request.cleaning_type,
        "detail_type": request.detail_type,
        "area_range": request.area_range,
        "estimated_amount": amount,
        "currency": "KRW",
        "pricing_basis": pricing_basis,
        "calculation": calculation,
        "is_starting_estimate": is_starting_estimate,
        "message": "선택하신 조건의 예상 금액입니다. 실제 작업 범위와 현장 상태에 따라 달라질 수 있습니다.",
    }


def send_email_in_background(email_message: EmailMessage):
    api_key = os.getenv("BREVO_API_KEY", "").strip()
    sender_email = os.getenv("BREVO_SENDER_EMAIL", "").strip()
    sender_name = os.getenv("BREVO_SENDER_NAME", "제이클리닝").strip() or "제이클리닝"
    if not api_key or not sender_email:
        print("이메일 발송 실패: Brevo 설정 누락", flush=True)
        return

    try:
        response = requests.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={"api-key": api_key, "Accept": "application/json"},
            json={
                "sender": {"email": sender_email, "name": sender_name},
                "to": [{"email": str(email_message["To"]).strip()}],
                "subject": str(email_message["Subject"]),
                "textContent": email_message.get_content(),
            },
            timeout=(5, 15),
            allow_redirects=False,
        )
        if response.status_code != 201:
            # Do not log API keys, recipients, message contents, or provider bodies.
            print(f"이메일 발송 실패: Brevo HTTP {response.status_code}", flush=True)
            return
        print("이메일 발송 요청 접수 완료: Brevo", flush=True)
    except requests.RequestException as error:
        print(f"이메일 발송 실패: {type(error).__name__}", flush=True)


def send_registration_emails(
    name: str,
    customer_email: str,
    customer_id: int,
    created_at: str,
):
    if not all(os.getenv(key, "").strip() for key in ("BREVO_API_KEY", "BREVO_SENDER_EMAIL")):
        print("회원가입 안내 이메일 발송 실패: Brevo 설정 누락", flush=True)
        return

    customer_message = EmailMessage()
    customer_message["Subject"] = "제이클리닝 회원가입이 완료되었습니다"
    customer_message["To"] = customer_email
    customer_message.set_content(
        f"안녕하세요, {name} 회원님.\n\n"
        "제이클리닝 회원가입이 완료되었습니다.\n"
        f"가입 아이디: {customer_email}\n\n"
        "서비스 이용에 감사드립니다.\n"
        "제이클리닝 드림"
    )
    send_email_in_background(
        customer_message,
    )

    admin_email = ADMIN_USERNAME.strip().lower()
    if not re.fullmatch(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", admin_email):
        print("관리자 가입 알림 메일 생략: ADMIN_USERNAME 이메일 형식 확인 필요", flush=True)
        return

    admin_message = EmailMessage()
    admin_message["Subject"] = "제이클리닝 신규 회원가입 알림"
    admin_message["To"] = admin_email
    admin_message.set_content(
        f"{ADMIN_NAME.strip()} 관리자님, 신규 회원가입이 완료되었습니다.\n\n"
        f"회원 ID: {customer_id}\n"
        f"이름: {name}\n"
        f"아이디: {customer_email}\n"
        f"가입 일시: {created_at}\n"
    )
    send_email_in_background(
        admin_message,
    )


@app.post("/estimate/email", status_code=status.HTTP_202_ACCEPTED)
def email_estimate(
    request: EstimateEmailRequest,
    background_tasks: BackgroundTasks,
):
    if not all(os.getenv(key, "").strip() for key in ("BREVO_API_KEY", "BREVO_SENDER_EMAIL")):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="이메일 발송 설정이 완료되지 않았습니다.",
        )

    estimate = get_estimate(request)
    cleaning_labels = {
        "move_in": "입주 청소", "move_out": "이사 청소", "residence": "거주 청소",
        "office": "상가/사무실", "special": "특수 청소", "partial": "부분 청소",
    }
    detail_labels = {
        "apartment": "아파트", "villa": "빌라", "officetel": "오피스텔", "house": "주택",
        "restaurant-cafe": "식당/카페", "academy-hospital": "학원/병원", "store": "일반 상가/매장",
        "bathroom": "화장실 / 욕실 집중", "kitchen": "주방 / 싱크대 집중", "balcony": "창틀 / 베란다",
        "floor": "방 바닥 / 거실 마루", "refrigerator": "냉장고 / 가전 내부",
        "air-conditioner": "에어컨 필터 및 분해", "hoarding-home": "쓰레기집 / 방치 공간",
        "large-waste": "대형 폐기물 수거", "estate-cleanout": "유품 정리 / 빈집 정리",
        "fire-damage": "화재 / 그을음 현장", "water-damage": "누수 / 침수 피해 복구",
        "pet-waste": "반려동물 오염 공간",
    }
    area_labels = {
        "under-10": "10평 이하", "10-20": "10평 ~ 20평", "20-30": "20평 ~ 30평",
        "30-40": "30평 ~ 40평", "40-50": "40평 ~ 50평", "over-50": "50평 이상",
    }
    amount = f"{estimate['estimated_amount']:,}원"
    if estimate["is_starting_estimate"]:
        amount += "부터"

    email_message = EmailMessage()
    email_message["Subject"] = "제이클리닝 예상 견적 결과"
    email_message["To"] = request.recipient_email
    email_message.set_content(
        "안녕하세요. 제이클리닝 예상 견적 결과입니다.\n\n"
        f"청소 종류: {cleaning_labels[request.cleaning_type]}\n"
        f"공간 / 항목: {detail_labels.get(request.detail_type, request.detail_type)}\n"
        f"면적: {area_labels.get(request.area_range, '해당 없음')}\n"
        f"산정 기준: {estimate['calculation']}\n"
        f"예상 금액: {amount}\n\n"
        f"{estimate['message']}\n"
    )

    background_tasks.add_task(
        send_email_in_background,
        email_message,
    )

    return {"message": "견적 이메일 전송 요청을 접수했습니다. 잠시 후 받은 편지함을 확인해 주세요."}



@app.post("/register", status_code=status.HTTP_201_CREATED)
def register_customer(
    request: Register,
    background_tasks: BackgroundTasks,
):
    name = request.name.strip()
    username = request.username.strip().lower()
    phone = request.phone.strip()

    if not name:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="이름을 입력해 주세요.",
        )

    duplicate_query = text("""
        SELECT
            EXISTS (
                SELECT 1
                FROM customers
                WHERE username = :username
            ) AS username_exists,
            EXISTS (
                SELECT 1
                FROM customers
                WHERE phone = :phone
            ) AS phone_exists
    """)

    insert_query = text("""
        INSERT INTO customers (
            name,
            username,
            password_hash,
            birth_date,
            phone
        )
        VALUES (
            :name,
            :username,
            :password_hash,
            :birth_date,
            :phone
        )
        RETURNING
            id,
            name,
            username,
            created_at
    """)

    try:
        with engine.begin() as connection:
            duplicate = connection.execute(
                duplicate_query,
                {
                    "username": username,
                    "phone": phone,
                },
            ).mappings().one()

            if duplicate["username_exists"]:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="이미 사용 중인 아이디입니다.",
                )

            if duplicate["phone_exists"]:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="이미 가입된 전화번호입니다.",
                )

            row = connection.execute(
                insert_query,
                {
                    "name": name,
                    "username": username,
                    "password_hash": password_hasher.hash(
                        request.password
                    ),
                    "birth_date": request.birth_date,
                    "phone": phone,
                },
            ).mappings().one()

    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="입력 정보가 DB 제약조건을 만족하지 않습니다. 아이디 또는 전화번호 중복을 확인해 주세요.",
        ) from error
    background_tasks.add_task(
        send_registration_emails,
        row["name"].strip(),
        row["username"].strip().lower(),
        row["id"],
        row["created_at"].isoformat(),
    )

    return {
        "message": "회원가입이 완료되었습니다.",
    }



@app.post("/login")
def login(login_data: LoginRequest, response: Response):
    username = login_data.username.strip().lower()

    manager_query = text("""
        SELECT id, name, username, password_hash
        FROM managers
        WHERE username = :username
    """)

    customer_query = text("""
        SELECT id, name, username, password_hash
        FROM customers
        WHERE username = :username
    """)

    with engine.begin() as connection:
        manager = connection.execute(
            manager_query,
            {"username": username},
        ).mappings().one_or_none()

        if manager is not None and password_hasher.verify(
            login_data.password, manager["password_hash"]
        ):
            name = manager["name"].strip()
            access_token = create_access_token({
                "sub": manager["username"].strip().lower(),
                "id": manager["id"],
                "role": "manager",
            })

            refresh_token = store_refresh_token(connection, manager["id"], "manager")
            set_refresh_cookie(response, refresh_token)

            return {
                "message": "관리자 로그인 성공",
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": manager["id"],
                    "name": name,
                    "username": manager["username"].strip().lower(),
                    "role": "manager",
                    "greeting": f"{name} 관리자님",
                },
            }

        customer = connection.execute(
            customer_query,
            {"username": username},
        ).mappings().one_or_none()

        if customer is not None and password_hasher.verify(
            login_data.password, customer["password_hash"]
        ):
            name = customer["name"].strip()
            access_token = create_access_token({
                "sub": customer["username"].strip().lower(),
                "id": customer["id"],
                "role": "customer",
            })

            refresh_token = store_refresh_token(connection, customer["id"], "customer")
            set_refresh_cookie(response, refresh_token)

            return {
                "message": "회원 로그인 성공",
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": customer["id"],
                    "name": name,
                    "username": customer["username"].strip().lower(),
                    "role": "customer",
                    "greeting": f"{name} 회원님",
                },
            }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="아이디 또는 비밀번호가 올바르지 않습니다.",
    )

@app.post("/refresh")
def refresh_access_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="다시 로그인해 주세요.")

    token_hash = hashlib.sha256(token.encode()).hexdigest()
    with engine.begin() as connection:
        session = connection.execute(
            text("""
                DELETE FROM refresh_tokens
                WHERE token_hash = :token_hash AND expires_at > CURRENT_TIMESTAMP
                RETURNING manager_id, customer_id
            """),
            {"token_hash": token_hash},
        ).mappings().one_or_none()

        if session is None:
            raise HTTPException(status_code=401, detail="토큰이 만료되었거나 유효하지 않습니다.")

        role = "manager" if session["manager_id"] is not None else "customer"
        user_id = session["manager_id"] if role == "manager" else session["customer_id"]
        query = text("SELECT username FROM managers WHERE id = :id") if role == "manager" else text("SELECT username FROM customers WHERE id = :id")
        username = connection.execute(query, {"id": user_id}).scalar_one_or_none()
        if username is None:
            raise HTTPException(status_code=401, detail="다시 로그인해 주세요.")

        access_token = create_access_token({
            "sub": username.strip().lower(), "id": user_id, "role": role,
        })
        new_refresh_token = store_refresh_token(connection, user_id, role)

    set_refresh_cookie(response, new_refresh_token)
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/logout")
def logout(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if token:
        with engine.begin() as connection:
            connection.execute(
                text("DELETE FROM refresh_tokens WHERE token_hash = :token_hash"),
                {"token_hash": hashlib.sha256(token.encode()).hexdigest()},
            )
    response.delete_cookie("refresh_token", path="/", secure=COOKIE_SECURE, httponly=True, samesite="lax")
    response.headers["Cache-Control"] = "no-store"
    return {"message": "로그아웃되었습니다."}


@app.get("/me")
def get_current_user(
    current_user: dict = Depends(get_current_user_payload),
):
    return {
        "user": {
            "id": current_user["id"],
            "role": current_user["role"],
        },
    }


@app.get("/customers")
def get_customers(
    page: int = Query(default=1, ge=1),
    manager_id: int = Depends(get_current_manager),
):
    limit = 10
    offset = (page - 1) * limit

    count_query = text("""
        SELECT COUNT(*)
        FROM customers
    """)

    query = text("""
        SELECT id, name, username, phone, created_at
        FROM customers
        ORDER BY created_at DESC, id DESC
        LIMIT :limit
        OFFSET :offset
    """)

    try:
        with engine.connect() as connection:
            total_count = connection.execute(count_query).scalar_one()
            customers = connection.execute(
                query,
                {
                    "limit": limit,
                    "offset": offset,
                },
            ).mappings().all()
    except SQLAlchemyError as error:
        print(f"회원 목록 조회 실패: {type(error).__name__}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="회원 목록을 불러오지 못했습니다.",
        ) from error

    total_pages = max(1, (total_count + limit - 1) // limit)

    return {
        "customers": [dict(customer) for customer in customers],
        "page": page,
        "limit": limit,
        "total_count": total_count,
        "total_pages": total_pages,
    }


@app.post("/customers/check-username")
def check_username(request: UsernameCheckRequest):
    username = request.username.strip().lower()

    if not username:
        raise HTTPException(
            status_code=422,
            detail="아이디를 입력해 주세요.",
        )

    with engine.connect() as connection:
        exists = connection.execute(
            text("""
                SELECT EXISTS (
                    SELECT 1
                    FROM customers
                    WHERE username = :username
                )
            """),
            {"username": username},
        ).scalar_one()

    if exists:
        raise HTTPException(
            status_code=409,
            detail="중복된 아이디가 있습니다.",
        )

    return {
        "available": True,
        "message": "사용 가능한 아이디입니다.",
    }


@app.post("/find-id")
def find_id(request: FindIdRequest):
    query = text("""
        SELECT username
        FROM customers
        WHERE name = :name
          AND phone = :phone
          AND birth_date = :birth_date
    """)

    with engine.connect() as connection:
        customer = connection.execute(
            query,
            {
                "name": request.name.strip(),
                "phone": request.phone.strip(),
                "birth_date": request.birth_date,
            },
        ).mappings().one_or_none()

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="일치하는 회원 정보를 찾지 못했습니다.",
        )

    username = customer["username"]
    email_id, email_domain = username.split("@", 1)

    visible_length = min(
        6,
        max(1, len(email_id) - 1),
    )

    masked_email_id = (
        email_id[:visible_length]
        + "*" * (len(email_id) - visible_length)
    )

    return {
        "username": f"{masked_email_id}@{email_domain}",
    }

@app.post("/reset-password/check-account")
def check_account(request: AccountCheckRequest):
    username = request.username.strip()
    phone = request.phone.strip()
    name = request.name.strip()

    if not username or not phone:
        raise HTTPException(
            status_code=400,
            detail="아이디와 전화번호를 입력해 주세요.",
        )

    params = {
        "username": username,
        "name": name,
        "phone": phone,
        "birth_date": request.birth_date,
    }

    with engine.connect() as connection:
        account_exists = connection.execute(
            text("""
                SELECT EXISTS (
                    SELECT 1
                    FROM customers
                    WHERE username = :username
                      AND name = :name
                      AND phone = :phone
                      AND birth_date = :birth_date
                )
            """),
            params,
        ).scalar_one()

    if not account_exists:
        raise HTTPException(
            status_code=404,
            detail="아이디 또는 전화번호가 일치하지 않습니다.",
        )

    return {
        "verified": True,
        "message": "계정이 확인되었습니다.",
    }


@app.post("/reset-password")
def reset_password(request: ResetPasswordRequest):
    username = request.username.strip().lower()
    phone = request.phone.strip()
    name = request.name.strip()

    if not username or not phone or not name:
        raise HTTPException(
            status_code=400,
            detail="모든 항목을 입력해 주세요.",
        )

    params = {
        "username": username,
        "phone": phone,
        "name": name,
        "birth_date": request.birth_date,
        "password_hash": password_hasher.hash(request.new_password),
    }

    with engine.begin() as connection:
        updated_customer = connection.execute(
            text("""
                UPDATE customers
                SET
                    password_hash = :password_hash,
                    updated_at = CURRENT_TIMESTAMP
                WHERE username = :username
                  AND phone = :phone
                  AND name = :name
                  AND birth_date = :birth_date
                RETURNING id
            """),
            params,
        ).first()

        if updated_customer is None:
            raise HTTPException(
                status_code=404,
                detail="일치하는 회원 정보를 찾지 못했습니다.",
            )

    return {
        "message": "비밀번호가 변경되었습니다.",
    }


@app.post("/notices", status_code=status.HTTP_201_CREATED)
def create_notice(
    request: NoticeCreateRequest,
    manager_id: int = Depends(get_current_manager),
):
    title = request.title.strip()
    content = request.content.strip()

    if not title or not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="제목과 내용을 입력해 주세요.",
        )

    try:
        with engine.begin() as connection:
            notice = connection.execute(
                text("""
                    INSERT INTO public.notices (title, content, is_pinned)
                    VALUES (:title, :content, :is_pinned)
                    RETURNING
                        id,
                        title,
                        content,
                        is_pinned,
                        view_count,
                        created_at,
                        updated_at
                """),
                {
                    "title": title,
                    "content": content,
                    "is_pinned": request.is_pinned,
                },
            ).mappings().one()
    except SQLAlchemyError as error:
        print(f"공지사항 저장 실패: {error}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="공지사항을 저장하지 못했습니다.",
        ) from error

    print(f"공지사항 저장 완료: id={notice['id']}, manager_id={manager_id}", flush=True)
    return {
        "message": "게시되었습니다.",
        "notice": dict(notice),
    }


@app.post("/notices/drafts", status_code=status.HTTP_201_CREATED)
def save_notice_draft(
    request: NoticeCreateRequest,
    manager_id: int = Depends(get_current_manager),
):
    title = request.title.strip()
    content = request.content.strip()

    if not title or not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="제목과 내용을 입력해 주세요.",
        )

    try:
        with engine.begin() as connection:
            draft = connection.execute(
                text("""
                    INSERT INTO public.notices (
                        title,
                        content,
                        status,
                        is_pinned
                    )
                    VALUES (
                        :title,
                        :content,
                        'draft',
                        :is_pinned
                    )
                    RETURNING
                        id,
                        title,
                        content,
                        status,
                        is_pinned,
                        view_count,
                        created_at,
                        updated_at
                """),
                {
                    "title": title,
                    "content": content,
                    "is_pinned": request.is_pinned,
                },
            ).mappings().one()
    except SQLAlchemyError as error:
        print(f"공지사항 임시저장 실패: {error}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="공지사항을 임시저장하지 못했습니다.",
        ) from error

    print(
        f"공지사항 임시저장 완료: id={draft['id']}, manager_id={manager_id}",
        flush=True,
    )
    return {
        "message": "임시저장되었습니다.",
        "draft": dict(draft),
    }


@app.get("/notices")
def get_notices(page: int = Query(default=1, ge=1)):
    limit = 10
    offset = (page - 1) * limit

    count_query = text("""
        SELECT COUNT(*)
        FROM public.notices
        WHERE status = 'published'
    """)

    query = text("""
        SELECT
            id,
            title,
            content,
            is_pinned,
            view_count,
            created_at,
            updated_at
        FROM public.notices
        WHERE status = 'published'
        ORDER BY is_pinned DESC, created_at DESC, id DESC
        LIMIT :limit
        OFFSET :offset
    """)

    try:
        with engine.connect() as connection:
            total_count = connection.execute(count_query).scalar_one()
            rows = connection.execute(
                query,
                {"limit": limit, "offset": offset},
            ).mappings().all()
    except SQLAlchemyError as error:
        print(f"공지사항 조회 실패: {error}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="공지사항을 조회하지 못했습니다.",
        ) from error

    total_pages = max(1, (total_count + limit - 1) // limit)

    return {
        "notices": [dict(row) for row in rows],
        "page": page,
        "limit": limit,
        "total_count": total_count,
        "total_pages": total_pages,
    }


@app.get("/notices/drafts")
def get_notice_drafts(
    page: int = Query(default=1, ge=1),
    manager_id: int = Depends(get_current_manager),
):
    limit = 10
    offset = (page - 1) * limit

    count_query = text("""
        SELECT COUNT(*)
        FROM public.notices
        WHERE status = 'draft'
    """)

    query = text("""
        SELECT
            id,
            title,
            content,
            is_pinned,
            view_count,
            created_at,
            updated_at
        FROM public.notices
        WHERE status = 'draft'
        ORDER BY updated_at DESC, id DESC
        LIMIT :limit
        OFFSET :offset
    """)

    try:
        with engine.connect() as connection:
            total_count = connection.execute(count_query).scalar_one()
            rows = connection.execute(
                query,
                {"limit": limit, "offset": offset},
            ).mappings().all()
    except SQLAlchemyError as error:
        print(f"공지사항 초안 조회 실패: {error}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="임시저장 보관함을 불러오지 못했습니다.",
        ) from error

    print(
        f"공지사항 초안 조회 완료: count={total_count}, page={page}, manager_id={manager_id}",
        flush=True,
    )
    total_pages = max(1, (total_count + limit - 1) // limit)
    return {
        "drafts": [dict(row) for row in rows],
        "page": page,
        "limit": limit,
        "total_count": total_count,
        "total_pages": total_pages,
    }


@app.delete("/notices/drafts")
def delete_notice_drafts(
    request: NoticeDraftDeleteRequest,
    manager_id: int = Depends(get_current_manager),
):
    draft_ids = list(dict.fromkeys(request.draft_ids))

    if any(draft_id <= 0 for draft_id in draft_ids):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="삭제할 임시저장 번호가 올바르지 않습니다.",
        )

    delete_query = text("""
        DELETE FROM public.notices
        WHERE id IN :draft_ids
          AND status = 'draft'
        RETURNING id
    """).bindparams(bindparam("draft_ids", expanding=True))

    try:
        with engine.begin() as connection:
            deleted_rows = connection.execute(
                delete_query,
                {"draft_ids": draft_ids},
            ).mappings().all()
    except SQLAlchemyError as error:
        print(f"공지사항 초안 일괄 삭제 실패: {error}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="임시저장 글을 삭제하지 못했습니다.",
        ) from error

    if not deleted_rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="삭제할 임시저장 글을 찾을 수 없습니다.",
        )

    deleted_ids = [row["id"] for row in deleted_rows]
    print(
        f"공지사항 초안 일괄 삭제 완료: count={len(deleted_ids)}, manager_id={manager_id}",
        flush=True,
    )
    return {
        "message": "선택한 임시저장 글이 삭제되었습니다.",
        "deleted_count": len(deleted_ids),
        "deleted_ids": deleted_ids,
    }


@app.get("/notices/drafts/{draft_id}")
def get_notice_draft(
    draft_id: int,
    manager_id: int = Depends(get_current_manager),
):
    if draft_id <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="임시저장 번호가 올바르지 않습니다.",
        )

    try:
        with engine.connect() as connection:
            draft = connection.execute(
                text("""
                    SELECT
                        id,
                        title,
                        content,
                        is_pinned,
                        view_count,
                        created_at,
                        updated_at
                    FROM public.notices
                    WHERE id = :draft_id
                      AND status = 'draft'
                """),
                {"draft_id": draft_id},
            ).mappings().one_or_none()
    except SQLAlchemyError as error:
        print(f"공지사항 초안 상세 조회 실패: {error}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="임시저장 내용을 불러오지 못했습니다.",
        ) from error

    if draft is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="임시저장 글을 찾을 수 없습니다.",
        )

    print(
        f"공지사항 초안 상세 조회 완료: id={draft_id}, manager_id={manager_id}",
        flush=True,
    )
    return {"draft": dict(draft)}


@app.put("/notices/drafts/{draft_id}")
def update_notice_draft(
    draft_id: int,
    request: NoticeCreateRequest,
    manager_id: int = Depends(get_current_manager),
):
    if draft_id <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="임시저장 번호가 올바르지 않습니다.",
        )

    title = request.title.strip()
    content = request.content.strip()
    if not title or not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="제목과 내용을 입력해 주세요.",
        )

    try:
        with engine.begin() as connection:
            draft = connection.execute(
                text("""
                    UPDATE public.notices
                    SET
                        title = :title,
                        content = :content,
                        is_pinned = :is_pinned,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = :draft_id
                      AND status = 'draft'
                    RETURNING
                        id,
                        title,
                        content,
                        is_pinned,
                        view_count,
                        created_at,
                        updated_at
                """),
                {
                    "draft_id": draft_id,
                    "title": title,
                    "content": content,
                    "is_pinned": request.is_pinned,
                },
            ).mappings().one_or_none()
    except SQLAlchemyError as error:
        print(f"공지사항 초안 수정 실패: {error}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="임시저장 내용을 수정하지 못했습니다.",
        ) from error

    if draft is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="수정할 임시저장 글을 찾을 수 없습니다.",
        )

    print(
        f"공지사항 초안 수정 완료: id={draft_id}, manager_id={manager_id}",
        flush=True,
    )
    return {
        "message": "임시저장 내용이 수정되었습니다.",
        "draft": dict(draft),
    }


@app.delete("/notices")
def delete_notices(
    request: NoticeDeleteRequest,
    manager_id: int = Depends(get_current_manager),
):
    notice_ids = list(dict.fromkeys(request.notice_ids))

    if any(notice_id <= 0 for notice_id in notice_ids):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="삭제할 공지사항 번호가 올바르지 않습니다.",
        )

    delete_query = text("""
        DELETE FROM public.notices
        WHERE id IN :notice_ids
        RETURNING id
    """).bindparams(bindparam("notice_ids", expanding=True))

    try:
        with engine.begin() as connection:
            deleted_rows = connection.execute(
                delete_query,
                {"notice_ids": notice_ids},
            ).mappings().all()
    except SQLAlchemyError as error:
        print(f"공지사항 삭제 실패: {error}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="공지사항을 삭제하지 못했습니다.",
        ) from error

    if not deleted_rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="삭제할 공지사항을 찾을 수 없습니다.",
        )

    deleted_ids = [row["id"] for row in deleted_rows]
    print(
        f"공지사항 삭제 완료: count={len(deleted_ids)}, manager_id={manager_id}",
        flush=True,
    )
    return {
        "message": "선택한 공지사항이 삭제되었습니다.",
        "deleted_count": len(deleted_ids),
        "deleted_ids": deleted_ids,
    }


@app.get("/notices/{notice_id}")
def get_notice(notice_id: int):
    try:
        with engine.begin() as connection:
            notice = connection.execute(
                text("""
                    UPDATE public.notices
                    SET view_count = view_count + 1
                    WHERE id = :notice_id
                      AND status = 'published'
                    RETURNING
                        id,
                        title,
                        content,
                        is_pinned,
                        view_count,
                        created_at,
                        updated_at
                """),
                {"notice_id": notice_id},
            ).mappings().one_or_none()

            if notice is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="공지사항을 찾을 수 없습니다.",
                )

            previous_notice = connection.execute(
                text("""
                    SELECT id, title
                    FROM public.notices
                    WHERE id < :notice_id
                      AND status = 'published'
                    ORDER BY id DESC
                    LIMIT 1
                """),
                {"notice_id": notice_id},
            ).mappings().one_or_none()

            next_notice = connection.execute(
                text("""
                    SELECT id, title
                    FROM public.notices
                    WHERE id > :notice_id
                      AND status = 'published'
                    ORDER BY id ASC
                    LIMIT 1
                """),
                {"notice_id": notice_id},
            ).mappings().one_or_none()
    except SQLAlchemyError as error:
        print(f"공지사항 상세 조회 실패: {error}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="공지사항을 조회하지 못했습니다.",
        ) from error

    return {
        "notice": dict(notice),
        "previous_notice": dict(previous_notice) if previous_notice else None,
        "next_notice": dict(next_notice) if next_notice else None,
    }

