# 예상 견적 PDF 이메일

## 처리 흐름

1. `POST /estimate/email`은 선택 항목과 수신 이메일을 검증하고 서버에서 금액을 다시 계산합니다.
2. `BackgroundTasks`에 계산 결과를 넘기고 HTTP 202(발송 요청 접수)를 반환합니다.
3. `estimate_pdf.py`가 항목 코드를 한글로 바꾸고 `templates/estimate.html`의 표에 값을 채웁니다.
4. xhtml2pdf가 HTML을 PDF 바이트로 변환합니다. 파일을 디스크나 DB에 저장하지 않습니다.
5. 같은 PDF를 고객 메일과 관리자 알림 메일에 각각 첨부합니다.

## 구성

- `estimate_pdf.py`: 표시 항목, HTML 렌더링, 메모리 내 PDF 생성
- `templates/estimate.html`: A4 표 양식 및 CSS
- `assets/`: 한글 글꼴, 글꼴 라이선스, 로고 (배포에 함께 포함)
- `main.py`: 요청 접수 및 백그라운드 이메일 발송
- `tests/test_estimate_pdf.py`: 실제 PDF 변환 및 모의 전송 검증

프로젝트 원본은 기존 SMTP를 유지하고, GitHub 배포본은 Brevo HTTPS API를 사용합니다.
Brevo 전송은 첨부파일을 Base64 문자열로 변환하여 전달합니다.
관리자 수신자는 기존 `ADMIN_NOTIFICATION_EMAIL` 설정을 사용합니다.
PDF 기능을 위한 추가 비밀 환경변수나 DB 변경은 없습니다.

## 설치 및 테스트

backend 디렉터리에서 실행합니다.

```powershell
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

운영 서버는 `requirements.txt`를 설치합니다. Render 재배포 때 새 의존성과 assets/templates가 모두 포함되어야 합니다.
테스트는 외부 HTTP/DB 연결을 차단하며 실제 이메일을 발송하지 않습니다.

## 현재 동작의 한계

HTTP 202는 요청 접수이며 PDF 생성이나 메일 수신 완료를 보장하지 않습니다.
BackgroundTasks는 별도의 영구 작업 큐가 아니어서 서버가 종료되면 미완료 작업이 유실될 수 있습니다.
PDF 변환 실패 시 깨진 첨부파일을 보내지 않고 오류 종류만 서버 로그에 남깁니다.
메일 제공자가 접수한 뒤의 수신 실패나 스팸 분류는 이 응답으로 확인할 수 없습니다.
재시도/발송 상태 저장/수신 확인 웹훅은 이번 변경에 포함하지 않습니다.
