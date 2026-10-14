# J-CLEANING | 청소 예상 견적과 고객 요청 알림

[한국어](README.md) · [English](README.en.md) · [日本語](README.ja.md)

[서비스 보기](https://j-cleaning.vercel.app/)

고객이 청소 종류와 공간을 선택하면 예상 금액을 보여주고, 원하는 고객에게 견적을 이메일로 보내는 웹 서비스입니다. 대표에게도 요청 내용을 알려 후속 상담을 돕습니다. 정지윤이 기획·개발·배포한 개인 포트폴리오입니다.

## 시스템이 대신 하는 일

고객이 버튼으로 청소 종류·공간·면적을 선택하면 서버가 정해진 기준으로 금액을 계산합니다. 직원이 매번 같은 계산을 할 필요를 줄이고, 결과는 화면에 바로 표시합니다. 고객이 이메일 발송을 요청하면 고객에게 견적을 보내고, 대표에게 고객 이메일과 견적 내용을 별도로 알립니다. 최종 가격 확인과 상담은 사람이 맡습니다.

`선택 → 서버 계산 → 화면의 예상 견적 → 이메일 요청 → 고객 견적·대표 알림`

## 주요 기능

- 입주·이사·거주·상가·특수·부분 청소의 조건별 선택 화면과 예시 견적 계산
- 고객용 견적 메일, 관리자 견적 요청 알림, 회원가입 안내와 관리자 가입 알림
- 회원가입·로그인·계정 찾기·비밀번호 변경, JWT와 리프레시 토큰, 로그아웃
- 관리자 회원목록, 공지 작성·삭제·임시저장·초안 재편집
- 공지·초안·회원목록 10개 단위 페이지네이션, 공지 상세·이전글·다음글
- 모바일 헤더·입력 폼, 청소 소개 이미지와 시공후기 갤러리

## 문제를 해결한 방법

| 문제 | 수정한 내용 |
| --- | --- |
| 기존 고객 테이블과 가입 코드의 열이 다름 | 실제 스키마를 확인하고 요청 모델·SQL의 필드명을 일치시킴 |
| 입력했는데 필수항목이 비어 있다고 표시 | input의 value·onChange와 부모 상태를 연결하고 form의 onSubmit으로 제출 |
| 화면과 API 요청 주소가 달라 실패 | Next.js rewrite와 BACKEND_URL로 `/api` 요청을 FastAPI에 전달 |
| 개발 중 조회수가 두 번 증가 | 개발 모드의 반복 실행을 확인해 Strict Mode 설정 조정; 운영에서 중복 방지 보강 필요 |
| 배포 후 SMTP 메일이 실패 | Brevo HTTPS API로 변경하고 BackgroundTasks에서 고객·관리자 메일 발송 |
| 고객에게만 견적 메일이 도착 | ADMIN_NOTIFICATION_EMAIL을 별도 to로 사용해 대표 알림 작업 추가 |
| 모바일·다크모드에서 글자와 배치가 깨짐 | 입력 색상과 light 모드를 정리하고 메뉴·로고 간격 및 텍스트 줄바꿈 보완 |
| 개인정보가 로그에 남음 | 프론트 디버그 로그 제거와 민감한 응답 캐시 제한 |

## 구성과 실행

Next.js 16 · React 19 · TypeScript · Tailwind CSS / Python · FastAPI · Pydantic / PostgreSQL · SQLAlchemy / JWT · pwdlib · BackgroundTasks · Brevo

- **Vercel**: 화면과 `/api` 요청 전달. `BACKEND_URL`로 Render 연결.
- **Render**: 견적 계산·인증·관리 업무·이메일 요청 처리.
- **Neon**: 회원·공지·초안·토큰 저장. 예상 견적 결과는 DB에 저장하지 않음.

`frontend/`: 화면 · `backend/main.py`: API·계산·메일 · `db/`: 스키마

`db/schema.sql`, `db/refresh_tokens.sql`을 적용하고 `backend/config/.env`에 DB·인증 설정을 넣습니다. 배포용 메일 코드는 `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `ADMIN_NOTIFICATION_EMAIL`을 사용합니다. 실제 비밀값은 Render 환경변수에만 입력합니다. 배포에서는 `COOKIE_SECURE=true`를 사용합니다.

```bash
# backend 폴더
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
# frontend 폴더 (.env.local: BACKEND_URL=http://127.0.0.1:8000)
npm install
npm run dev
```

## 범위와 남은 개선

학습·포트폴리오 서비스로, 표시 금액은 실제 청소 계약 가격이 아닙니다. 테스트 데이터로 이용해 주세요. 현재 관리자 견적 알림에는 고객이 입력한 이메일이 포함되며, 전화 상담 접수 기능은 구현 범위에 포함하지 않습니다. 메일은 BackgroundTasks에서 처리하므로 요청 접수와 실제 수신은 다릅니다. 운영 전에는 상담 동의, 요청 제한, 발송 재시도·실패 추적, 안전한 계정 복구를 보강해야 합니다. 무료 백엔드는 첫 접속이 늦을 수 있습니다.
