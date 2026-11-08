
# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Dependencies
FROM base AS deps
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# Database migration and seed
FROM deps AS migrate
COPY . .
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"
RUN npx prisma generate
ENV HOME=/tmp
USER node
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed"]

# Build Next.js
FROM deps AS builder
COPY . .
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"
RUN npx prisma generate
RUN npm run build

# Baseline image before runtime hardening (runs as root)
FROM base AS baseline
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]

# Hardened runtime image
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN groupadd --system --gid 1001 nextjs \
    && useradd --system --uid 1001 --gid nextjs \
       --home-dir /home/nextjs --create-home nextjs

COPY --from=builder --chown=1001:1001 /app/public ./public
COPY --from=builder --chown=1001:1001 /app/.next/standalone ./
COPY --from=builder --chown=1001:1001 /app/.next/static ./.next/static

RUN mkdir -p /app/.next/cache \
    && chown -R 1001:1001 /app/.next

USER 1001:1001
EXPOSE 3000
CMD ["node", "server.js"]
