# NSPE Microservices Monorepo (Nx) — Detailed README

This repository demonstrates a lightweight Nx monorepo setup for multiple NestJS microservices. It is intentionally non-invasive: each service keeps its own folder and package.json, and the workspace uses Nx `run-commands` to orchestrate builds and starts.

Current projects

- `apigateway` — API gateway that routes requests to internal services (NestJS)
- `auth-service` — Authentication and authorization microservice (NestJS)
- `file-management-service` — File and storage-related operations (NestJS)
- `users-service` — User management, seeding scripts, and related workers (NestJS)

Why this structure?

- Keep existing service-level structure and scripts intact for minimal migration effort.
- Use Nx as a thin orchestration layer to run scripts, provide unified commands, and later adopt more advanced Nx features (caching, generators, and coordinated builds).
- Provide an example repository for teaching or bootstrapping microservice development with basic CI.

Repository contents (high level)

- `nx.json`, `workspace.json`, `tsconfig.base.json` — workspace configuration.
- `package.json` (root) — convenience scripts and devDependencies (nx, concurrently).
- Service folders: `apigateway/`, `auth-service/`, `file-management-service/`, `users-service/` — each contains its own NestJS project and `package.json`.
- `.github/workflows/ci.yml` — simple CI that builds all services on push/PR.

Quickstart (Windows PowerShell)

1. Clone or prepare the repo locally.

```powershell
# clone (if on GitHub) or open the folder locally
git clone https://github.com/<your-org-or-username>/<repo>.git
cd <repo>
```

2. Install dependencies (root-level dev tools and project deps). This repo keeps per-service dependencies in each service's `package.json`. Installing at root will install devDependencies declared at the root (nx, concurrently). Each service uses its own local dependencies when running via `npm --prefix`.

```powershell
npm install
```

3. Build all services (simple verification):

```powershell
npm run build:all
```

4. Run a single service with Nx (example):

```powershell
npx nx run apigateway:start
```

5. Run all services in parallel (for local development):

```powershell
npm run start:all
```

Development workflow and tips

- Each service is a standalone NestJS app. Use the service-level `package.json` scripts to build, test, and run (`npm --prefix <service> run <script>`).
- To run tests for a specific service:

```powershell
npm --prefix users-service run test
```

- If you add shared code or utilities you want to reuse, consider converting the repo into a more typical Nx layout (move services into `apps/` and create shared `libs/`). I can automate that conversion.

CI (GitHub Actions)

- The included workflow `.github/workflows/ci.yml` runs on push and PR to `main`.
- It performs:
  - Checkout
  - Install Node.js and run `npm ci`
  - Run `npm run build:all` which builds each microservice using their existing `npm` scripts.

Publishing this example to GitHub

1. Create a repository on GitHub (e.g. `NSPE-insp/apigateway-example`).
2. Push the local repo to GitHub:

```powershell
git init
git add .
git commit -m "chore: init Nx microservices example"
git branch -M main
git remote add origin https://github.com/<your-org-or-username>/<repo>.git
git push -u origin main
```

3. The CI workflow will run automatically for pushes/PRs to `main`.

Suggested GitHub repository description

- Short: "Nx monorepo example: NestJS microservices (API gateway, auth, file management, users) with basic CI."

Troubleshooting

- If `npx nx` complains about missing packages, ensure you ran `npm install` at the root and that `nx` exists in `node_modules` or use `npx nx` which downloads it transiently.
- If builds fail in CI due to missing service dependencies, run `npm --prefix <service> install` locally inside that service to verify dependency tree.
- For long running or port collisions, use environment variables per service (each service supports `.env` files — add `.env.development` etc.).

Roadmap / next improvements

- Convert each service into Nx-managed apps under `apps/` and hoist shared devDependencies.
- Add Nx caching and remote caching to speed up CI.
- Add unit/integration tests to CI and linting steps.
- Add Dockerfiles and a docker-compose example for local multi-service runs.

Contributing

- Fork and submit PRs. Keep each service’s changes contained to its folder unless you’re extracting shared libs.
- Add descriptive commits and update this README when adding services or changing CI.

License

This example is provided under the MIT license — see `LICENSE`.

Contact / Support

- If you want help converting this into a fully Nx-native monorepo (apps/libs + hoisted deps + generators), tell me where to start and I’ll perform the migration steps.
# Monorepo workspace (Nx)

This repository contains multiple NestJS microservices. It has been organized as a lightweight Nx workspace so you can run and build the individual services from the repository root without moving files.

Included projects:

- `apigateway`
- `auth-service`
- `file-management-service`
- `users-service`

How to use

1. Install root-level dev tools (nx is used as a CLI wrapper):

```powershell
npm install -g nx@latest
npm install
```

2. Run a service via Nx (examples):

```powershell
npx nx run apigateway:start
npx nx run users-service:start:dev
npx nx run auth-service:build
```

Notes

- This workspace uses run-commands targets that call each service's own npm scripts (no files were moved).
- If you want a deeper Nx integration (workspace libs, caching across builds, generators), I can convert each service into proper Nx applications and hoist shared dependencies.

Publishing this example to GitHub

1. Create a new repository on GitHub (for example: `NSPE-insp/apigateway-example`).
2. Push the existing folder to the new repository from your local machine:

```powershell
git init
git add .
git commit -m "chore: init monorepo Nx example"
git branch -M main
git remote add origin https://github.com/<your-org-or-username>/<repo>.git
git push -u origin main
```

3. The included GitHub Actions workflow (`.github/workflows/ci.yml`) will run on push and PR to `main` and execute `npm run build:all` to build all microservices.

If you'd like, I can also:

- Create the GitHub repository for you (requires a GitHub token or authorization),
- Add more CI steps (lint, test, cache), or
- Convert this into a fully Nx-managed monorepo with hoisted devDependencies.

