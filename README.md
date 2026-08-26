# Thailand Disaster Watch v1.0.0

**Production Domain**: `https://disaster.futuregreennet.com`
**Platform**: FutureGreen Disaster Intelligence Platform
**Project Creator & Lead Developer**: Sorawit Suwannarong

Thailand Disaster Watch is a meteorological and hydrological decision-support platform tailored for Thailand. Built with an uncompromising focus on data provenance, spatial precision, and operational safety, v1.0 unites satellite imagery, weather station telemetry, Doppler radar mosaics, and high-resolution numerical model forecasts into a responsive, accessible GIS Command Center.

> [!NOTE]
> **Safety Notice**: This system is a development and decision-support preview tool. Official government disaster warnings issued by the Thai Meteorological Department (TMD) and Department of Disaster Prevention and Mitigation (DDPM) supersede any data displayed on this platform.

---

## 1. Current Status & Governance

- **Release Version**: **v1.0.0**
- **Operational Status**: **NON-OPERATIONAL / DECISION-SUPPORT PREVIEW**
- **Real Data State**: Gated under controlled pilot architecture (`realDataConnected=false`, `operationalUseApproved=false`)
- **Hosting Platform**: Cloudflare Pages + Cloudflare Workers

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript 5.8, Vite 8 (Pure static client bundle)
- **GIS Engine**: MapLibre GL JS (WebGL vector tile rendering)
- **Styling**: Tailwind CSS + Custom Dark Command Center System
- **API Gateway**: Cloudflare Workers (TypeScript)
- **Quality Gates**: ESLint, TypeScript Typecheck, Node Test Runner, Vitest

---

## 3. Local Development

Requirements: Node.js 22.13+ and pnpm 11+ (or npm).

```bash
# Install dependencies
pnpm install

# Start local development server
pnpm dev
```

The web application will be accessible at `http://localhost:3000`.

---

## 4. Quality Checks & Production Build

```bash
pnpm lint       # ESLint validation
pnpm typecheck  # TypeScript strict typecheck
pnpm test       # Baseline tests + Vitest unit suite
pnpm build      # Builds dist/web and validates Worker bundle
```

---

## 5. Documentation Directory

- [Release Notes v1.0](docs/RELEASE-v1.0.md)
- [Production Readiness Review](docs/PRODUCTION-READINESS-v1.0.md)
- [Cloudflare Deployment Guide](docs/DEPLOYMENT-v1.0.md)
- [Known Limitations & Backlog](docs/KNOWN-LIMITATIONS-v1.0.md)
- [Weather & Radar Intelligence](docs/WEATHER-RADAR-INTELLIGENCE.md)
- [Radar Governance & Audit](docs/RADAR-SOURCE-AUDIT.md)
- [Project Roadmap](docs/ROADMAP.md)
- [Data License Registry](docs/DATA-LICENSE-REGISTRY.md)
