# ──────────────────────────────────────────────
# Stage 1: deps
# ──────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/logger/package.json ./packages/logger/

RUN pnpm install --frozen-lockfile

# ──────────────────────────────────────────────
# Stage 2: builder
# ──────────────────────────────────────────────
FROM deps AS builder

WORKDIR /app

COPY packages/logger/ ./packages/logger/
COPY apps/admin/ ./apps/admin/

# Build shared packages
RUN pnpm --filter @mini-commerce/logger build

# Build Next.js admin
RUN pnpm --filter @mini-commerce/admin build

# ──────────────────────────────────────────────
# Stage 3: runner (Next.js standalone output)
# ──────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Use Next.js standalone output for minimal image size
COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder /app/apps/admin/public ./apps/admin/public

RUN addgroup -S commerce && adduser -S admin -G commerce
USER admin

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/admin/server.js"]
