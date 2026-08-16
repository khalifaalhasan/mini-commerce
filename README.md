# mini-commerce

Monorepo e-commerce platform dibangun dengan **Turborepo** + **pnpm workspaces**.  
Stack: **NestJS** (API) · **Prisma** (Database) · **Caddy** (Reverse Proxy) · **PostgreSQL**

---

## Struktur Monorepo

```
mini-commerce/
├── apps/
│   ├── api/          # @mini-commerce/api       — NestJS REST API
│   ├── storefront/   # @mini-commerce/storefront — Frontend (WIP)
│   └── admin/        # @mini-commerce/admin      — Admin panel (WIP)
│
├── packages/
│   ├── database/     # @mini-commerce/database  — Prisma client & schema
│   └── logger/       # @mini-commerce/logger    — Shared log enums
│
├── deploy/
│   └── docker/       # Deployment configs
│
├── docker-compose.yml  # PostgreSQL + Caddy
├── turbo.json          # Turborepo pipeline
├── pnpm-workspace.yaml
└── package.json
```

---

## Prasyarat

| Tool | Versi Minimum |
|------|--------------|
| Node.js | `>= 20` |
| pnpm | `>= 9.0.0` |
| Docker & Docker Compose | `>= v2` |

Install pnpm jika belum ada:

```bash
npm install -g pnpm@9
```

---

## Quick Start

### 1. Clone & Install dependencies

```bash
git clone <repo-url> mini-commerce
cd mini-commerce
pnpm install
```

### 2. Setup environment

```bash
cp .env.example .env   # sesuaikan isi .env
```

Variabel yang wajib diisi di `.env`:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"
POSTGRES_USER=commerce
POSTGRES_PASSWORD=secret
POSTGRES_DB=commerce_db

# Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Jalankan infrastruktur (PostgreSQL + Caddy)

```bash
docker compose up -d
```

### 4. Jalankan migrasi database

```bash
pnpm db:migrate
```

### 5. Jalankan development server

```bash
# Semua apps sekaligus
pnpm dev

# Hanya API
pnpm dev:api

# Hanya Storefront
pnpm dev:storefront
```

---

## Scripts

### Root (monorepo-level)

| Script | Keterangan |
|--------|------------|
| `pnpm dev` | Jalankan semua apps dalam mode dev (paralel) |
| `pnpm dev:api` | Jalankan API + semua dependensinya |
| `pnpm dev:storefront` | Jalankan Storefront + dependensinya |
| `pnpm build` | Build semua packages & apps (topological order) |
| `pnpm lint` | Lint semua packages & apps |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:migrate` | Jalankan migrasi database |
| `pnpm active:workspace` | Lihat semua workspace packages yang terdaftar |

### Per-package (dengan `--filter`)

Gunakan flag `--filter` untuk menjalankan script di package tertentu:

```bash
# Format sintaks filter
pnpm --filter <package-name> <script>

# Contoh
pnpm --filter @mini-commerce/api start:dev
pnpm --filter @mini-commerce/api lint
pnpm --filter @mini-commerce/api test
pnpm --filter @mini-commerce/database db:generate
pnpm --filter @mini-commerce/database db:migrate
```

> **Tip:** Suffix `...` setelah nama package artinya "package ini + semua dependensinya"
>
> ```bash
> # Jalankan api DAN packages/database + packages/logger (dependensinya)
> pnpm turbo dev --filter=@mini-commerce/api...
> ```

---

## Workspace Packages

### `@mini-commerce/api` — `apps/api`

NestJS REST API.

```bash
# Dev server (watch mode)
pnpm --filter @mini-commerce/api start:dev

# Build production
pnpm --filter @mini-commerce/api build

# Test
pnpm --filter @mini-commerce/api test
pnpm --filter @mini-commerce/api test:cov
pnpm --filter @mini-commerce/api test:e2e
```

### `@mini-commerce/database` — `packages/database`

Berisi Prisma schema, migrations, dan re-export `PrismaClient`.

```bash
# Generate Prisma Client setelah schema berubah
pnpm db:generate

# Buat & jalankan migrasi baru
pnpm db:migrate
```

### `@mini-commerce/logger` — `packages/logger`

Shared enums untuk logging (`LogContext`, `LogEvent`). Tidak ada script khusus.

---

## Database

### Membuat migrasi baru

```bash
pnpm db:migrate
# Prisma akan meminta nama migrasi secara interaktif
```

### Reset database (hati-hati di production!)

```bash
pnpm --filter @mini-commerce/database exec prisma migrate reset
```

### Prisma Studio (GUI database)

```bash
pnpm --filter @mini-commerce/database exec prisma studio
```

---

## Infrastruktur (Docker)

```bash
# Jalankan PostgreSQL + Caddy
docker compose up -d

# Lihat status container
docker compose ps

# Lihat logs
docker compose logs -f

# Stop semua container
docker compose down

# Stop dan hapus volume (RESET data!)
docker compose down -v
```

---

## Turbo Pipeline

Pipeline didefinisikan di [`turbo.json`](./turbo.json):

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

| Key | Artinya |
|-----|---------|
| `^build` | Jalankan `build` di semua **dependencies** terlebih dahulu |
| `cache: false` | Jangan cache output (dev server selalu fresh) |
| `persistent: true` | Proses berjalan terus (tidak dianggap selesai) |

---

## Konvensi Commit

Project ini menggunakan **Conventional Commits** yang dienforce oleh `commitlint` via Husky.

```
<type>(<scope>): <deskripsi singkat>
```

| Type | Kapan dipakai |
|------|--------------|
| `feat` | Fitur baru |
| `fix` | Bug fix |
| `chore` | Maintenance, config, tooling |
| `refactor` | Refactor tanpa ubah behavior |
| `docs` | Dokumentasi saja |
| `test` | Tambah atau perbaiki test |
| `ci` | Perubahan CI/CD pipeline |
| `build` | Perubahan build system / dependencies |
| `perf` | Optimasi performa |

**Contoh:**

```bash
feat(apps/api): add product pagination endpoint
fix(packages/database): correct migration rollback
chore(infra): update docker-compose postgres version
docs: update README with turbo usage guide
refactor(packages/logger): rename LogContext enum values
```

---

## Menambah Package Baru

```bash
# 1. Buat direktori package
mkdir -p packages/my-package/src

# 2. Buat package.json
cat > packages/my-package/package.json << 'EOF'
{
  "name": "@mini-commerce/my-package",
  "version": "0.0.1",
  "main": "./src/index.ts"
}
EOF

# 3. Install ulang untuk register workspace
pnpm install

# 4. Gunakan sebagai dependency di package lain
pnpm --filter @mini-commerce/api add @mini-commerce/my-package
```

---

## Troubleshooting

### `turbo: command not found`

Turbo diinstall sebagai devDependency root, bukan global. Selalu jalankan via `pnpm`:

```bash
# Benar — lewat script root
pnpm dev
pnpm build

# Benar — lewat pnpm prefix
pnpm turbo dev

# Salah — jika turbo tidak diinstall global
turbo dev
```

### `No tasks were executed`

Pastikan package yang di-filter punya script yang sesuai di `package.json`-nya. Misalnya `dev:api` adalah script root, bukan task turbo langsung:

```bash
# Benar
pnpm dev:api           # memanggil: turbo dev --filter=@mini-commerce/api...

# Salah (dev:api bukan turbo task)
pnpm turbo dev:api
```

### Port sudah digunakan

```bash
# Cek proses di port 3000
lsof -i :3000
kill -9 <PID>
```

### Prisma client tidak ter-generate

```bash
pnpm db:generate
```

---

## Lisensi

UNLICENSED — Internal project.
