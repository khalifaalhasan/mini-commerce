# 🛒 Mini E-Commerce (Single Tenant)

Proyek mini e-commerce sederhana untuk satu tenant (single tenant). Dibangun dengan pendekatan monorepo yang memisahkan backend, frontend, dan infrastruktur.

---

## 📁 Struktur Proyek

```
mini-eccomerce/
├── be/        # Backend (NestJS)
├── fe/        # Frontend (React)
└── infra/     # Infrastruktur (Docker, Caddy)
```

---

## 🧰 Tech Stack

### Backend (`/be`)

| Teknologi | Keterangan |
|---|---|
| [NestJS v11](https://nestjs.com/) | Framework utama backend berbasis Node.js |
| [TypeScript](https://www.typescriptlang.org/) | Bahasa utama |
| [Prisma v7](https://www.prisma.io/) | ORM untuk query dan migrasi database |
| [PostgreSQL](https://www.postgresql.org/) | Database relasional |
| [Better Auth](https://www.better-auth.com/) | Autentikasi (session, OAuth, dll.) |
| [nestjs-pino](https://github.com/iamolegga/nestjs-pino) | Structured logging dengan Pino |
| [class-validator](https://github.com/typestack/class-validator) | Validasi DTO |
| [NestJS Swagger](https://docs.nestjs.com/openapi/introduction) | Dokumentasi API otomatis |
| [Bun](https://bun.sh/) | Package manager & runtime |
| [Husky](https://typicode.github.io/husky/) | Git hooks (pre-commit lint) |

### Frontend (`/fe`)

| Teknologi | Keterangan |
|---|---|
| [React](https://react.dev/) | UI library utama |
| *(menyusul)* | Stack detail masih dalam perencanaan |

### Infrastruktur (`/infra`)

| Teknologi | Keterangan |
|---|---|
| [Docker](https://www.docker.com/) & Docker Compose | Containerisasi service |
| [Caddy](https://caddyserver.com/) | Reverse proxy + HTTPS otomatis |

---

## 🚀 Cara Menjalankan

### Prasyarat

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Bun](https://bun.sh/) (untuk development lokal backend)
- Node.js >= 20

### Development (Backend)

```bash
# Masuk ke folder backend
cd be

# Install dependencies
bun install

# Jalankan database (PostgreSQL via Docker)
docker compose up -d

# Jalankan migrasi Prisma
bunx prisma migrate dev

# Jalankan server development
bun run start:dev
```

API akan berjalan di `http://localhost:3000`  
Swagger docs: `http://localhost:3000/api`

---

## 📌 Catatan

- Proyek ini dirancang untuk **single tenant** — satu deployment melayani satu toko.
- Detail frontend dan konfigurasi Caddy menyusul.
