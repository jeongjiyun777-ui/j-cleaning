# J-CLEANING | 清掃見積もりポートフォリオ

[한국어](README.md) · [English](README.en.md) · [日本語](README.ja.md)

> 個人ポートフォリオです。見積もりは参考用です。実際の個人情報ではなくテストデータを使用してください。

### 概要

J-CLEANINGは、清掃サービスを選択して参考見積もりを確認し、メールで受け取るためのポートフォリオ用Webアプリケーションです。顧客アカウント、管理者ログイン、お知らせ、下書き機能も含まれています。

### 主な機能

- 入居前・引越し・居住中・商業施設・特殊・部分清掃の選択
- 空間の種類と面積に基づく参考見積もり
- 見積もりメールの送信リクエスト
- 顧客登録、ログイン、トークン更新、ログアウト
- 管理者によるお知らせ作成、下書き、一覧表示、削除
- お知らせ一覧・詳細ページと施工写真ギャラリー

### 技術スタック

- フロントエンド: Next.js 16、React 19、TypeScript、Tailwind CSS
- バックエンド: Python、FastAPI、Pydantic、SQLAlchemy
- データベース: PostgreSQL
- 認証: JWTアクセストークン、HttpOnlyリフレッシュトークンCookie

### データの流れ

ブラウザーからNext.jsの`/api/*`へ送信されたリクエストは、rewriteによってFastAPIへ転送されます。APIは入力を検証し、見積もり計算またはPostgreSQLの読み書きを行い、JSONを返します。見積もり結果自体はデータベースに保存しません。

### ローカル起動

1. PostgreSQLデータベースを作成し、`db/schema.sql`、続けて`db/refresh_tokens.sql`を実行します。
2. DB、認証、管理者、SMTPの環境変数を`backend/config/.env`に設定します。実際の`.env`ファイルや秘密情報をGitHubに登録しないでください。
3. `python -m pip install -r requirements.txt`でバックエンドの依存パッケージをインストールします。
4. `backend`フォルダーでAPIを起動します。

```bash
python -m uvicorn main:app --reload --port 8000
```

5. フロントエンドのパッケージをインストールし、`frontend/.env.local`に`BACKEND_URL=http://127.0.0.1:8000`を設定します。

```bash
npm install
npm run dev
```

フロントエンドは`http://localhost:3000`、FastAPIのドキュメントは`http://127.0.0.1:8000/docs`で確認できます。

### デプロイ時の注意

- VercelのRoot Directoryを`frontend`に設定し、`BACKEND_URL`にデプロイ済みFastAPIのURLを登録します。
- Render Web ServiceのRoot Directoryを`backend`に設定します。ビルドコマンドを`pip install -r requirements.txt`に設定し、起動コマンドを`uvicorn main:app --host 0.0.0.0 --port $PORT`にします。
- Neon PostgreSQLの接続情報をRenderの環境変数に登録します。`SESSION_SECRET`、管理者パスワードハッシュ、SMTPパスワードをソースコードやREADMEに書かないでください。
- 本番環境では`COOKIE_SECURE=true`を設定し、FastAPIのCORS許可リストに実際のフロントエンドドメインを追加します。
- Render無料Webサービスは、しばらくアクセスがないと停止する場合があります。また無料サービスからSMTPポート（25、465、587）へ直接接続できないため、無料プランでメールを送信する場合は別の対応方式が必要です。
- デプロイ前に会員一覧画面のAPIパスとバックエンドのルートが一致しているか確認してください。

### テストアカウント

公開デモアカウントはまだ掲載していません。専用のテストアカウントを用意してから、その情報だけを追加してください。実際の利用者の氏名、メールアドレス、電話番号、生年月日、パスワードは公開しないでください。
