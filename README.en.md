# J-CLEANING | Cleaning Estimates and Request Notifications

[한국어](README.md) · [English](README.en.md) · [日本語](README.ja.md)

[Live site](https://j-cleaning.vercel.app/)

A web application that calculates an example cleaning estimate from customer selections and emails the result on request. It also notifies the business owner to support follow-up. Planned, developed, and deployed by Jiyun Jeong as a personal portfolio.

## Try the live service

No local setup is required. Open the [deployed service](https://j-cleaning.vercel.app/) and use these accounts on the [login page](https://j-cleaning.vercel.app/login).

| Role | Username | Password |
| --- | --- | --- |
| Administrator | `admin1234@naver.com` | `ab#12345678` |
| Customer 1 | `rlfehd1234@naver.com` | `ab#12345678` |
| Customer 2 | `rlfehd123@naver.com` | `ab#12345678` |

These are shared demo accounts. Do not enter real personal information. Other visitors may change the demo data, and the free backend may take time to wake up.

## What the system handles

Customers select a cleaning service, space, and size. The server calculates a price using predefined rules and immediately shows the result, reducing repeated manual calculations. An email request sends the estimate to the customer and a separate notification with their email and estimate details to the owner. Final pricing and consultation remain human tasks.

`Selections → server calculation → on-screen estimate → email request → customer email + owner notification`

## Features

- Conditional selections for move-in, moving, occupied homes, commercial, specialist, and partial cleaning
- Customer estimate emails, owner request alerts, registration confirmations and administrator alerts
- Registration, login, account recovery, password changes, JWT and refresh tokens, logout
- Administrator customer lists, notices, deletion, saved drafts, and draft editing
- Ten-item pagination for notices, drafts, and customers; notice details and previous/next links
- Mobile forms/header, service images, and a project gallery

## Problems and fixes

| Problem | Change |
| --- | --- |
| Registration fields differed from the existing table | Inspected the actual schema and aligned request models with SQL fields |
| Filled inputs were still reported empty | Connected value/onChange to parent state and submitted through form onSubmit |
| Frontend and API paths differed | Routed `/api` requests through Next.js rewrites and BACKEND_URL |
| View counts increased twice in development | Identified repeated development execution and adjusted Strict Mode; stronger duplicate protection remains needed |
| SMTP failed after deployment | Switched to the Brevo HTTPS API and BackgroundTasks |
| Only customers received estimate emails | Added a separate owner notification addressed to ADMIN_NOTIFICATION_EMAIL |
| Mobile layout and dark-mode text broke | Fixed light-mode form colors, menu/logo spacing, and text wrapping |
| Personal data appeared in debug logs | Removed frontend debug logs and restricted caching of sensitive responses |

## How I worked through problems

I split the estimate flow into customer selections, server calculations, result rendering, and customer/owner emails. When filled inputs were treated as empty, I traced the connection between inputs and parent state. For database errors, I compared actual table columns with SQL. When deployed emails failed, I checked the delivery stage and runtime environment instead of treating a successful UI response as proof of delivery, then replaced SMTP with an HTTPS API. I added a dedicated recipient and background task where estimates previously reached only customers. Tracing where a flow breaks and reconnecting it was as important as adding features.

## Technology and deployment

Next.js 16 · React 19 · TypeScript · Tailwind CSS / Python · FastAPI · Pydantic / PostgreSQL · SQLAlchemy / JWT · pwdlib · BackgroundTasks · Brevo

- **Vercel** serves the UI and forwards `/api` through `BACKEND_URL` to Render.
- **Render** calculates estimates and handles authentication, administration, and email requests.
- **Neon** stores customers, notices, drafts, and tokens. Estimate results are not stored in the database.

`frontend/`: UI · `backend/main.py`: API/calculation/email · `db/`: SQL schemas

## Post-deployment validation — in progress

Public-service validation and preparation for Locust load testing started on October 15, 2026. Load-test measurements have not yet been published.

- Start with 10 simulated users, then gradually increase load for scenarios such as public notices and estimate calculations.
- Compare Locust response times, failure rates, and throughput with server-side CPU and RAM usage.
- Separate tests from real visitors and exclude estimate/registration email delivery from load tests.
- Record cold-start delays separately from sustained performance and use the findings to improve request limits, SQL, and delivery-failure tracking.

## Scope and next improvements

This is a learning/portfolio service. Prices are examples, not actual cleaning quotes or contracts; use test data. Owner notifications include the customer's submitted email; phone consultation requests are not implemented. BackgroundTasks processes delivery after the request, so acceptance does not mean inbox delivery. Production use requires consultation consent, request limits, retry/failure tracking, and stronger account recovery. The free backend may take time to wake up.
