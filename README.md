# Thailand Disaster Watch v1.0

Production target: `https://disaster.futuregreennet.com`

Thailand Disaster Watch is a planned multi-hazard situation-monitoring and business-continuity decision-support platform. Flood/water remains the first operational domain; PHASE 2 defines safe extension points for earthquake and tsunami without connecting live data. It is not an official government warning system.

## Current status

- Current Phase: **2.6 — Platform Hardening & Provider Approval Readiness (implementation branch)**
- PHASE 1: **MERGED to `main` via PR #1**
- PHASE 2: **MERGED to `main` via PR #2**
- PHASE 2.5: **MERGED to `main` via PR #3; controlled local pilot complete**
- Real Data: **NOT CONNECTED**
- Operational Use: **NOT APPROVED**
- Production: **NOT DEPLOYED**

## Technology baseline

- React 19, TypeScript, and Vite client application
- Static frontend target for Cloudflare Pages
- Isolated Cloudflare Worker API Gateway
- MapLibre GL JS with a local, licensed Thailand ADM1 boundary file
- Tailwind CSS baseline plus project CSS
- ESLint, TypeScript type checking, Node test runner, and Vitest
- pnpm with dependency build-script allowlist

## Local development

Requirements: Node.js 22.13 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

The application supports direct browser routes such as `/region/north`, `/province/chiang-mai`, and `/quick-view/bangkok-metro`. All disaster modules intentionally show unavailable states. PHASE 2.6 adds fail-closed provider governance, health/reliability contracts, explicit safety/provenance UI, responsive hardening, and lazy GIS loading. The GISTDA layer remains disabled because license, display rights, schema, timestamp, rate/cache, attribution, and human approval evidence remain incomplete.

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
- [GIS architecture](docs/GIS-ARCHITECTURE.md)
- [Data sources](docs/DATA-SOURCES.md)
- [Provider audit records](docs/PROVIDER-AUDIT-RECORDS.md)
- [GISTDA verification and pilot](docs/GISTDA-INTEGRATION.md)
- [Data license registry](docs/DATA-LICENSE-REGISTRY.md)
- [API contract](docs/API-CONTRACT.md)
- [Security](docs/SECURITY.md)
- [Safety architecture](docs/SAFETY-ARCHITECTURE.md)
- [BCM architecture](docs/BCM-ARCHITECTURE.md)
- [Export and sharing](docs/EXPORT-SHARING.md)
- [SeismoWatch migration](docs/SEISMOWATCH-MIGRATION.md)
- [Design system](docs/DESIGN-SYSTEM.md)
- [Roadmap](docs/ROADMAP.md)
- [Provider approval matrix](docs/PROVIDER-APPROVAL-MATRIX.md)
- [Mobile quality gate](docs/MOBILE-QUALITY-GATE.md)
- [Performance budget](docs/PERFORMANCE-BUDGET.md)
- [Observability contract](docs/OBSERVABILITY.md)
- [Disclaimer](docs/DISCLAIMER.md)

## Data policy

External datasets must not be connected to production until ownership, official documentation, schema, timestamps, license/reuse terms, attribution, operational constraints, security, and human approval are verified for the exact intended scope. `APPROVED_WITH_CONDITIONS` is not blanket approval.
