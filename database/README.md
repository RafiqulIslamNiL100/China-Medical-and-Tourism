# Database

Prisma schema for the Asia Health Link and Travel platform. See
`docs/06-database-design/` for the entity-relationship overview and field-by-field
schema reference, and `docs/03-architecture/04-database-architecture.md` for the
platform/topology decisions this schema implements.

## Setup

```bash
cd database
npm install
cp .env.example .env   # adjust DATABASE_URL if not using the default local Postgres
npm run validate       # check schema syntax
npm run generate       # generate the Prisma Client
npm run migrate:dev    # create and apply a migration against your local database
```

## Notes

- Pinned to Prisma 6.x — Prisma 7 moved the datasource `url` out of `schema.prisma`
  into a separate `prisma.config.ts`; re-evaluate that migration once the ecosystem
  (docs, examples, this schema) has caught up.
- No migrations are checked in yet — the first `prisma migrate dev` run against a real
  Postgres instance generates the initial migration.
- This package is intentionally standalone (not yet wired into `apps/web` or any
  backend service) — Phase 4's full backend folder structure will determine where the
  generated Prisma Client is consumed from.
