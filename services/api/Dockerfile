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
CMD ["sh", "-c", "npx prisma migrate deploy --schema database/prisma/schema.prisma && node services/api/dist/main.js"]
