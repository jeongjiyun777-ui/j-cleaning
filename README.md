# J-CLEANING | 청소 견적 포트폴리오

[한국어](README.md) · [English](README.en.md) · [日本語](README.ja.md)

> 개인 포트폴리오 및 학습용 프로젝트입니다. 견적 금액은 예시이며 실제 청소 서비스 가격이나 계약을 의미하지 않습니다. 실제 개인정보 대신 테스트용 데이터를 사용해 주세요.

### 소개

J-CLEANING은 청소 서비스를 선택하고 예상 견적을 확인한 뒤 이메일로 받아볼 수 있는 포트폴리오용 웹 애플리케이션입니다. 고객 계정, 관리자 로그인, 공지사항과 임시저장 기능도 포함합니다.

### 주요 기능

- 입주·이사·거주·상가·특수·부분 청소 선택
- 공간 종류와 평수에 따른 예시 견적 계산
- 예상 견적 이메일 발송 요청
- 고객 회원가입, 로그인, 토큰 갱신 및 로그아웃
- 관리자 공지사항 작성, 임시저장, 조회 및 삭제
- 공지사항 목록·상세 페이지와 시공후기 이미지 갤러리

### 기술 스택

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Python, FastAPI, Pydantic, SQLAlchemy
- Database: PostgreSQL
- Authentication: JWT access token, HttpOnly refresh-token cookie

### 데이터 흐름

브라우저가 Next.js의 `/api/*` 경로로 요청하면 Next.js rewrite가 FastAPI로 전달합니다. FastAPI는 입력을 검증하고 견적을 계산하거나 PostgreSQL에 필요한 데이터를 저장·조회한 뒤 JSON 응답을 반환합니다. 견적 요청 결과 자체는 데이터베이스에 저장하지 않습니다.

### 로컬 실행

1. PostgreSQL 데이터베이스를 만들고 `db/schema.sql`, `db/refresh_tokens.sql` 순서로 실행합니다.
2. `backend/config/.env`에 DB 접속 정보와 인증·관리자·SMTP 환경변수를 설정합니다. 실제 `.env` 파일이나 비밀값은 GitHub에 올리지 마세요.
3. 백엔드 폴더에서 `python -m pip install -r requirements.txt`로 의존성을 설치합니다.
4. 백엔드 폴더에서 실행합니다.

```bash
python -m uvicorn main:app --reload --port 8000
```

5. 프론트엔드 폴더에서 패키지를 설치하고 `BACKEND_URL=http://127.0.0.1:8000`을 `frontend/.env.local`에 설정합니다.

```bash
npm install
npm run dev
```

프론트엔드는 `http://localhost:3000`, FastAPI 문서는 `http://127.0.0.1:8000/docs`에서 확인할 수 있습니다.

### 배포 메모

- Vercel 프로젝트의 Root Directory는 `frontend`로 설정하고, `BACKEND_URL`을 배포된 FastAPI 주소로 지정합니다.
- Render Web Service의 Root Directory는 `backend`로 설정하고, 빌드 명령을 `pip install -r requirements.txt`로 지정하고 시작 명령을 `uvicorn main:app --host 0.0.0.0 --port $PORT`로 설정합니다.
- Neon의 PostgreSQL 접속 정보를 Render 환경변수로 등록합니다. `SESSION_SECRET`, 관리자 비밀번호 해시, SMTP 비밀번호는 코드나 README에 넣지 않습니다.
- 배포 환경에서는 `COOKIE_SECURE=true`로 설정하고, FastAPI CORS 허용 목록에 실제 프론트엔드 도메인을 반영해야 합니다.
- Render 무료 웹 서비스는 유휴 상태에서 잠들 수 있습니다. 또한 Render 무료 서비스는 SMTP 포트(25, 465, 587)로 직접 연결할 수 없으므로, 무료 플랜에서 이메일 발송을 사용하려면 SMTP 외 발송 방식을 검토해야 합니다.
- 현재 회원목록 화면의 API 주소와 백엔드 경로가 일치하는지 배포 전에 점검해야 합니다.

### 테스트 계정

공개 데모 계정은 아직 기재하지 않았습니다. 계정을 준비한 뒤 테스트용 계정만 여기에 추가하세요. 실제 사용자의 이름, 이메일, 전화번호, 생년월일 또는 비밀번호를 공개하지 마세요.
