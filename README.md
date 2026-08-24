# Thailand Disaster Watch v1.0

Production target: `https://disaster.futuregreennet.com`

Thailand Disaster Watch is a planned situation-monitoring and decision-support web application for water and flood conditions in Thailand. It is not an official government warning system.

## Current status

- Current Phase: **0.5 — Architecture Stabilization + GitHub Bootstrap**
- Real Data: **NOT CONNECTED**
- Operational Use: **NOT APPROVED**
- Production: **NOT DEPLOYED**

## Technology baseline

- React 19, TypeScript, and Vite client application
- Static frontend target for Cloudflare Pages
- Isolated Cloudflare Worker API Gateway
- Tailwind CSS
- ESLint, TypeScript type checking, Node test runner
- pnpm with dependency build-script allowlist

## Local development

Requirements: Node.js 22.13 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` only when local configuration is required. Never commit real secrets.

The frontend exposes only variables prefixed with `VITE_`. Provider credentials belong in secure Cloudflare Worker bindings and must not be added until the source audit and license review are approved.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm build` produces the static frontend in `dist/web` and performs a dry-run Worker bundle in `dist/worker`. It does not deploy either artifact.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Data sources](docs/DATA-SOURCES.md)
- [Data license registry](docs/DATA-LICENSE-REGISTRY.md)
- [API contract](docs/API-CONTRACT.md)
- [Security](docs/SECURITY.md)
- [Design system](docs/DESIGN-SYSTEM.md)
- [Roadmap](docs/ROADMAP.md)
- [Disclaimer](docs/DISCLAIMER.md)

## Data policy

External datasets must not be connected to production until ownership, official documentation, schema, timestamps, license/reuse terms, attribution, and operational constraints have been verified and recorded as `APPROVED`.
