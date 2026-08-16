# ──────────────────────────────────────────────
# Stage 1: deps — install all dependencies
# ──────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy workspace manifests for dependency resolution
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/logger/package.json ./packages/logger/

# Install all dependencies (including devDeps needed for build)
RUN pnpm install --frozen-lockfile

# ──────────────────────────────────────────────
# Stage 2: builder — compile packages & API
# ──────────────────────────────────────────────
FROM deps AS builder

WORKDIR /app

# Copy all source code
COPY packages/logger/ ./packages/logger/
COPY packages/database/ ./packages/database/
COPY apps/api/ ./apps/api/

# Build shared packages first (turbo respects ^build order)
RUN pnpm --filter @mini-commerce/logger build
RUN pnpm --filter @mini-commerce/database build

# Generate Prisma client
RUN pnpm --filter @mini-commerce/database exec prisma generate --schema prisma/schema.prisma

# Build API
RUN pnpm --filter @mini-commerce/api build

# Prune to production deps only
RUN pnpm --filter @mini-commerce/api --prod deploy /app/pruned

# ──────────────────────────────────────────────
# Stage 3: runner — lean production image
# ──────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy pruned production node_modules
COPY --from=builder /app/pruned/node_modules ./node_modules

# Copy compiled packages
COPY --from=builder /app/packages/logger/dist ./packages/logger/dist
COPY --from=builder /app/packages/database/dist ./packages/database/dist

# Copy compiled API
COPY --from=builder /app/apps/api/dist ./dist

# Copy Prisma migrations (needed for migrate deploy at startup)
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

# Non-root user for security
RUN addgroup -S commerce && adduser -S api -G commerce
USER api

EXPOSE 3000

# dumb-init handles PID 1 signal forwarding properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
