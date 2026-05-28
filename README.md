# Microservices Backend in NestJS

This repository is an Nx-managed monorepo containing a NestJS API Gateway and three NestJS TCP microservices.

## Architecture Overview

The system follows a gateway + internal microservices pattern:

- **API Gateway (`apigateway`)** exposes HTTP endpoints and Swagger docs.
- **Users Service (`users-service`)** manages users, roles, profiles, planning, diplomas, and password-reset email triggers.
- **Auth Service (`auth-service`)** issues and refreshes JWT access/refresh tokens.
- **File Management Service (`file-management-service`)** manages Cahier Journal entries.

### Runtime communication

- External clients call the API Gateway over HTTP.
- Gateway communicates with internal services through **NestJS microservices transport: TCP**.
- Services exchange messages via `ClientProxy.send(<pattern>, <payload>)` and `@MessagePattern(<pattern>)` handlers.

## Service Topology

| Service | Type | Default Port | Main Responsibility |
|---|---|---:|---|
| `apigateway` | HTTP API | `3000` (`PORT` fallback) | Public API, request validation, auth guard, Swagger |
| `users-service` | TCP microservice | `3001` | User lifecycle, inspector/professor domain operations |
| `auth-service` | TCP microservice | `3002` | JWT credential generation + refresh |
| `file-management-service` | TCP microservice | `3003` | Cahier Journal CRUD |

## Technical Details

### 1) API Gateway (`apigateway`)

- Global prefix: `api`
- Swagger UI: `/api`
- CORS enabled (`*` origin)
- Uses global `ValidationPipe`
- Registers TCP clients:
  - `USERS_SERVICE` -> `localhost:3001`
  - `AUTH_SERVICE` -> `localhost:3002`
  - `FILE_SERVICE` -> `localhost:3003`

Main controller groups:

- `auth/*` routes authentication and registration flows.
- `inspec/*` routes inspector profile and inspector-linked data.
- `prof/*` routes professor profile, planning, diplomas, and cahier journal.

Security:

- `AuthGuard` is registered globally via `APP_GUARD`.
- Public endpoints are marked with `@Public()` metadata.
- Role checks are implemented using custom guards (`IsInspec`, `IsProf`).

### 2) Users Service (`users-service`)

Transport:

- Nest microservice over TCP on `3001`.

Data and domain:

- Uses **Prisma** with PostgreSQL (`users-service/prisma/schema.prisma`).
- Core entities include:
  - `User` with role (`INSPEC` / `PROF`)
  - `Inspec`
  - `Prof`
  - `Planning`
  - `profDiplome`
  - `CahierJournal`
  - `Circonscription`
  - `Etablissement`

Messaging examples:

- `user-register`, `user-login`, `change-password`
- `inspec-profile`, `inspec-update-profile`, `inspec-professeur`, `inspec-circonscription-etablissement`
- `prof-profile`, `prof-update-profile`, `prof-get-inspec`
- `prof-add-planning`, `perso-planning`, `perso-edit-planning`, `prof-delete-planning`
- `prof-update-diplome`, `prof-add-diplome`, `prof-delete-diplome`
- `new-paper-CJ`, `edit-paper-CJ`, `get-paper-CJ`, `delete-paper-CJ`

Email integration:

- Uses `@nestjs-modules/mailer` to send password reset/change notifications.

### 3) Auth Service (`auth-service`)

Transport:

- Nest microservice over TCP on `3002`.

Responsibilities:

- Generates access + refresh tokens from user payload (`auth` pattern).
- Validates refresh token and issues new access token (`refreshToken` pattern).

Security implementation:

- Uses `@nestjs/jwt`.
- Token secrets are loaded from environment variables (see Environment section).

### 4) File Management Service (`file-management-service`)

Transport:

- Nest microservice over TCP on `3003`.

Responsibilities:

- Handles Cahier Journal operations through message patterns:
  - `create-paper-CJ`
  - `get-cahier-journal`
  - `delete-paper-CJ`
  - `edit-paper-CJ`

Data:

- Uses Prisma + PostgreSQL schema in `file-management-service/prisma/schema.prisma`.

## Repository Structure

```text
.
├── apigateway/
├── auth-service/
├── users-service/
├── file-management-service/
├── workspace.json
├── nx.json
└── package.json
```

- Nx is used as an orchestration layer.
- Each service remains independently structured with its own `package.json` and scripts.

## Environment Variables

The code currently reads the following environment variables:

- `PORT` (API Gateway HTTP port)
- `ACCESS_SECRET`
- `REFRESH_SECRET`
- `Host` (SMTP host)
- `Username` (SMTP username)
- `Password` (SMTP password)
- `DATABASE_URL` (Prisma/PostgreSQL connection URL in each Prisma service)

## Local Development

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL

### Install dependencies

```bash
npm install
npm --prefix apigateway ci
npm --prefix auth-service ci
npm --prefix users-service ci
npm --prefix file-management-service ci
```

### Build all services

```bash
npm run build:all
```

### Start all services

```bash
npm run start:all
```

### Start one service

```bash
npx nx run apigateway:start
npx nx run auth-service:start
npx nx run users-service:start
npx nx run file-management-service:start
```

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

Current pipeline:

1. Checkout
2. Setup Node 18
3. `npm ci`
4. `npm run build:all`

## Notes

- This workspace uses legacy `workspace.json` project configuration for Nx command orchestration.
- If you want to modernize Nx setup (`project.json` per app), you can migrate incrementally without changing service business logic.
