# 테스트 실행

backend 폴더에서 실행합니다.

```powershell
python -m pip install -r requirements-dev.txt
python -m pytest -v
```

`conftest.py`는 실제 .env 로딩과 DB 엔진 생성을 차단합니다.
DB가 필요한 테스트는 별도 메모리 SQLite만 사용하며, 실제 HTTP 서비스와 메일은 호출하지 않습니다.
테스트가 통과해도 PostgreSQL 전용 SQL, 실제 메일 수신, 브라우저 동작 및 배포 환경까지 확인한 것은 아닙니다.
