# Architecture — PHASE 2 foundation

## Status

PHASE 1 GIS navigation is merged. PHASE 2 freezes data-governance, safety, multi-hazard, offline, export, and BCM extension boundaries. No disaster-data integration is implemented, operational use is not approved, and production is not deployed.

## Context

```text
Browser / PWA
      |
      v
React + TypeScript + Vite (Cloudflare Pages)
      |-- dashboard and hazard modules
      |-- MapLibre GIS navigation
      |-- local THA ADM1 GeoJSON boundary
      |-- explicit source/time/freshness/conflict states
      `-- client state and PWA cache metadata
      |
      v
Cloudflare Worker API Gateway
      |-- authentication and secrets
      |-- API proxy and cache
      |-- normalization, validation, provenance, and revisions
      |-- source isolation and disable switches
      `-- rate-limit protection
      |
      v
Individually approved official/authorized data providers
```

GitHub is intended to be the single source of truth. Production target: `disaster.futuregreennet.com`.

## Boundaries

- `src/app/`: client application composition.
- `src/map/`: MapLibre view, style contract, boundary selection, fit-bounds, and source failure states.
- `src/config/regions.ts`: replaceable application navigation grouping; not an official jurisdiction.
- `src/domain/navigation.ts`: URL-derived national, region, province, and quick-view state.
- `src/domain/`: source-independent data types and rules.
- `src/services/`: adapters for verified external sources; one directory per owner.
- `src/components/`: reusable presentation components.
- `worker/`: isolated edge API Gateway, proxy, caching, normalization, and secret-bound integrations.
- `tests/`: unit, contract, integration, and regression tests.
- `docs/`: decisions, contracts, security, licensing, and operational guidance.

## Data flow principles

1. The browser calls only internal APIs for integrations requiring secrets or controlled caching.
2. Each adapter validates the upstream schema before normalization.
3. Normalized records retain source, unit, `observedAt`, `receivedAt`, and verification status.
4. Freshness is calculated from source-specific policy approved during integration.
5. Source failures are isolated and returned as explicit unavailable states.
6. Rule-based situation status precedes any AI-generated summary. Thresholds require verified authority.
7. Provider authority order is explicit; conflicts remain visible and are not averaged or silently resolved.
8. Public CORS proxies and direct browser requests to controlled providers are prohibited.

## PHASE 2 module boundaries

- `hazards/flood`, `hazards/earthquake`, and `hazards/tsunami` consume the same governed envelope but keep domain schemas/rules separate.
- `sources/<owner>` adapters own only transport and source schema; they cannot issue system actions.
- `governance` owns classification, authority, freshness, conflict, confidence, provenance, and production status.
- `incidents` links evidence to human-controlled lifecycle and audit events.
- `bcm` owns future exposure, impact, trigger evaluation, recommendation, approval, action, and recovery boundaries.
- `exports` renders permission-filtered, attributed snapshots/reports without changing operational state.

## Online, degraded, and offline modes

- `ONLINE`: current network paths available; freshness still evaluated per source.
- `DEGRADED`: one or more dependencies fail; other sources and cached records remain isolated and labeled.
- `OFFLINE`: no network; shell and approved cached records may remain, with last synchronization and stale/unknown status.
- `EXERCISE`: isolated training context and visible watermark; never triggers production actions or notifications.

A future service worker may cache the application shell and explicitly approved public resources. It must not cache secrets, unrestricted upstream payloads, confidential BCM data, or OSM Standard tiles for offline packaging.

Approved future offline packages may include the last known situation, BCM checklist, emergency contacts, site information, and approved emergency documents, subject to classification, encryption, tenant scope, expiry, and retention approval. Offline UI must state `OFFLINE — SHOWING CACHED DATA FROM [TIME]`.

## Deployment baseline

The client builds as static assets through Vite for a future Cloudflare Pages deployment. The API Gateway builds separately as Cloudflare Worker-compatible ESM. No D1, R2, domain, DNS, production secret, or deployment resource is enabled in PHASE 0.5.

## Vinext decision

Vinext, Next.js, React Server Components, and SSR were removed in PHASE 0.5. The approved requirements are a client-side Web GIS/dashboard, REST integrations, PWA behavior, and a separate edge API Gateway. The baseline contains no server-rendering, server-action, cookie/header, or framework-routing requirement that justifies a beta production dependency.

## Retained PHASE 1 decisions

- MapLibre GL JS is the approved client GIS engine.
- Browser routes are parsed without a routing dependency and restored on refresh via the static-host rewrite in `public/_redirects`.
- The geoBoundaries file is local and pinned; OpenStreetMap raster tiles remain a network dependency and have no availability SLA.

## Architecture decisions still open

- Production-grade basemap provider or self-hosting before production approval.
- Cache TTL and stale thresholds per approved dataset.
- Persistent storage needs after source audit and retention requirements.
- Authentication/authorization requirements for any non-public operational features.
- Tenant/organization persistence, audit-log storage, retention, and disaster recovery.
- Approved source-specific cache/freshness policies and conflict rules.
- Mobile PWA install/update strategy and approved offline basemap/data package.
