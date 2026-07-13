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

Generate strong secrets with `openssl rand -hex 32` (run locally, don't reuse the repo's
dev placeholders).

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

These are documented adapters (see `docs/PROJECT_CONTEXT.md` §17), not deployment bugs —
worth knowing about before treating the live site as production-ready:

- **Uploaded documents don't persist.** `StorageService` writes to local disk
  (`.data/documents/`) inside the container. Most PaaS containers are ephemeral —
  anything written to disk is lost on the next deploy or restart. Fine for a demo,
  not for real patient documents. Fixing this means swapping `StorageService` for a
  real S3-compatible client (the interface is already isolated to one file).
- **Payments are mocked.** `MockPaymentProcessor` never touches a real payment
  network — every token except the literal string `"tok_decline"` "succeeds." No real
  money moves. Swapping in Stripe (or similar) means implementing the same
  `charge()` interface against their SDK.
- **Only a vertical slice of the frontend is wired to the real API** — auth, hospital
  directory, and the patient apply/cases flow. Every other screen (hospital staff
  portal, ops console, admin console, partner portals, and most of the patient
  portal) still reads static mock data until it's wired the same way.
