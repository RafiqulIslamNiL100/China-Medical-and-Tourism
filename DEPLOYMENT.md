# Deploying the backend so the live Vercel site actually works

The Vercel-deployed frontend (`apps/web`) currently has nothing to talk to — `services/api`
only runs inside the development sandbox this project was built in. This guide gets a
real, public instance of the backend running so the live site's login/register/hospital
browsing/apply-flow (and eventually every screen) actually works.

This assumes Railway, but any host that can run a Dockerfile + a Postgres database works
the same way (Render, Fly.io, etc.) — the only Railway-specific parts are the exact
dashboard clicks in step 2–3.

## 1. Prerequisites

- The code is already on GitHub at `RafiqulIslamNiL100/China-Medical-and-Tourism`
  (`main` branch) — no separate push needed.
- A Railway (or equivalent) account, connected to the same GitHub account/org so it can
  read this repo.

## 2. Create the Postgres database

In Railway: **New Project → Provision PostgreSQL**. Railway gives you a connection
string (`DATABASE_URL`) immediately — copy it, you'll need it in step 4.

## 3. Deploy the backend service

In the same Railway project: **New → GitHub Repo** → select this repo.

- **Root Directory**: leave as the repo root (the Dockerfile needs the whole monorepo
  as build context, since `services/api` depends on the shared `database/prisma`
  schema via the npm workspace).
- **Build method**: Dockerfile. Point it at `services/api/Dockerfile`.
- Railway auto-detects the exposed port from the `PORT` env var it injects — `main.ts`
  already reads `process.env.PORT`, so no extra config needed there.

## 4. Set environment variables on the backend service

| Variable | Value |
|---|---|
| `DATABASE_URL` | The connection string from step 2 |
| `JWT_ACCESS_SECRET` | A long random string — **not** the dev placeholder in `.env.example` |
| `JWT_REFRESH_SECRET` | A different long random string |
| `RESEND_API_KEY` | Your Resend API key (optional — omit it and email just logs server-side instead of sending) |
| `RESEND_FROM_EMAIL` | e.g. `"China Medical and Tourism <onboarding@resend.dev>"` (optional, has a default) |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins, e.g. `https://your-app.vercel.app` (optional — omit it during setup and the API allows all origins, which is fine short-term but should be locked down before calling this production) |
| `S3_BUCKET` | Bucket name for persistent document storage (optional — see "Known limitations" below for what happens without it) |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Credentials for the bucket above |
| `S3_REGION` | Bucket region, e.g. `auto` for Cloudflare R2, `us-east-1` for AWS |
| `S3_ENDPOINT` | Only needed for non-AWS S3-compatible providers (Cloudflare R2, Railway Buckets, MinIO) — omit for real AWS S3 |
| `STRIPE_SECRET_KEY` | Your Stripe **secret** key (optional — omit it and payments are simulated by the built-in mock processor). Use a `sk_test_...` key until you're genuinely ready to take real payments |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe **publishable** key (optional — only needed if/when the frontend integrates Stripe.js directly) |
| `STRIPE_WEBHOOK_SECRET` | The signing secret for the webhook endpoint below (optional — only needed to verify `POST /v1/payments/webhook/stripe`) |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` | Your Twilio credentials (optional — omit them and SMS just logs server-side instead of sending) |
| `TWILIO_FROM_NUMBER` | A phone number you own on Twilio, in E.164 format, e.g. `+15551234567` |

Generate strong secrets with `openssl rand -hex 32` (run locally, don't reuse the repo's
dev placeholders). All four `S3_*` variables must be set together for `StorageService`
to use real object storage; all three `TWILIO_*` variables must be set together for
`SmsService` to send real SMS — partial sets fall back to the mock/local/console
behavior, same pattern as everything else in this table.

If you set `STRIPE_SECRET_KEY`, also register a webhook endpoint in the Stripe
dashboard pointing at `https://<your-backend-domain>/v1/payments/webhook/stripe`, and
copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

Deploy. The container's `CMD` runs `prisma migrate deploy` automatically before starting
the server, so the database schema is created on first boot — no manual migration step.

## 5. Seed demo data (optional)

To get the same demo accounts documented in `docs/PROJECT_CONTEXT.md` §15 (Amara Nwosu,
etc.) into the production database, run the seed script once against the production
`DATABASE_URL`. From your own machine:

```bash
DATABASE_URL="<the production connection string>" node database/prisma/seed.js
```

It's idempotent — safe to run once and forget.

## 6. Point Vercel at the real backend

In the Vercel project's **Settings → Environment Variables**, add:

```
NEXT_PUBLIC_API_BASE_URL = https://<your-railway-backend-domain>/v1
```

(Get the domain from Railway's service settings — it issues a `*.up.railway.app` URL by
default, or you can attach a custom domain.) Set this for the **Production** environment
at minimum. Redeploy the Vercel project (Vercel usually does this automatically when env
vars change, but trigger a manual redeploy from the dashboard if it doesn't).

## 7. Verify

- `https://<backend-domain>/health` should return `{"status":"ok",...}`.
- The live Vercel site's `/register` and `/login` should now work end-to-end.

## Known limitations once deployed

These are documented adapters (see `docs/PROJECT_CONTEXT.md` §17–18), not deployment
bugs — worth knowing about before treating the live site as fully production-ready:

- **Uploaded documents don't persist unless `S3_*` env vars are set.** Without them,
  `StorageService` writes to local disk (`.data/documents/`) inside the container. Most
  PaaS containers are ephemeral — anything written to disk is lost on the next deploy or
  restart. The code already supports real S3-compatible storage (AWS S3, Cloudflare R2,
  Railway Buckets, MinIO) — set the four `S3_*` variables above and it activates
  automatically, no code changes needed.
- **Payments are mocked unless `STRIPE_SECRET_KEY` is set.** Without it, every token
  except the literal string `"tok_decline"` "succeeds" and no real money moves. The
  code already supports real Stripe payments — set `STRIPE_SECRET_KEY` and it
  activates automatically. In Stripe mode, `paymentMethodToken` must be a real Stripe
  PaymentMethod id (a Stripe test card like `"pm_card_visa"`, never real card data)
  rather than the mock path's `"tok_visa"`-style token.
- **SMS is logged to the console unless all three `TWILIO_*` vars are set.** The code
  already supports real SMS via Twilio; set the three variables above and it
  activates automatically. Recipients also need `smsEnabled: true` on their
  notification preferences, since SMS defaults to opt-in (unlike email).
- **Demo account passwords are public.** Every seeded account shares the password
  `Passw0rd!23`, documented in this repo. Before treating a production database as real,
  run `database/prisma/rotate-demo-passwords.js` (see its header comment) to set a real,
  private password, or delete the demo accounts entirely.
- **`CORS_ORIGINS` should be set explicitly in production.** Leaving it unset allows
  all origins, which is fine for initial setup but not for a long-lived production
  deployment — set it to your exact frontend domain(s) once the site is stable.

All six portals — patient, hospital staff, operations, admin, and the three partner
roles — are now wired to the real API end to end (see `docs/PROJECT_CONTEXT.md` §14).
There is no remaining mock-data screen in `apps/web`.
