# Builds and runs services/api (NestJS). Build context must be the repo root
# (the npm workspace root), e.g.: docker build -f services/api/Dockerfile .
FROM node:22-alpine AS build
WORKDIR /app

# Workspace manifests first, for better layer caching on dependency installs.
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY database/package.json database/package.json
COPY services/api/package.json services/api/package.json

RUN npm ci

COPY database database
COPY services/api services/api

RUN npx prisma generate --schema database/prisma/schema.prisma
RUN npm run build --workspace=services/api

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/database database
COPY --from=build /app/services/api/dist services/api/dist
COPY --from=build /app/services/api/package.json services/api/package.json

EXPOSE 3001

# Applies any pending Postgres migrations (no-op if already applied), then starts the
# server. DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET must be set in the host's
# environment — see services/api/.env.example.
#
# The echo markers make the platform's deploy logs self-diagnosing: if you see
# "[boot] applying migrations..." but never "[boot] migrations applied", the container
# died in migrate deploy — i.e. it can't reach DATABASE_URL (the #1 cause of a
# "successful build" that then fails to respond). Seeing "launching server" followed by
# no "listening" line points at the app/port instead. PORT is safe to log; secrets are not.
CMD ["sh", "-c", "echo \"[boot] starting; PORT=${PORT:-3001}\" && echo '[boot] applying migrations...' && npx prisma migrate deploy --schema database/prisma/schema.prisma && echo '[boot] migrations applied; launching server...' && node services/api/dist/main.js"]
