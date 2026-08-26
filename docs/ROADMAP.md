# Roadmap

| Phase | Scope | Entry condition | Exit gate |
|---:|---|---|---|
| 0 | Repository, architecture, docs, baseline, checks | Project approval | Checks pass; risks documented |
| 0.5 | Architecture stabilization and GitHub bootstrap | Phase 0 approval | Vinext removed, GitHub/CI and local quality gates pass |
| 1 | UI shell and GIS map | Phase 0.5 review/approval | **Complete:** PR #1 merged to `main`; checks and human review passed |
| 2 | Official data, safety, governance, BCM and multi-hazard extension contracts | Phase 1 merged | **Complete:** PR #2 merged to `main`; CI and human review passed |
| 2.5 | GISTDA dataset verification and controlled pilot | Phase 2 merged | **Controlled Local Pilot: COMPLETE. Production Approval: PENDING.** Sanitized evidence recorded; disabled Worker adapter/tests retained; human decisions on license, attribution, schema, timestamp, rate/cache/SLA, CRS/zoom/tile scheme and operational policy remain required; no production layer |
| 2.6 | Platform hardening and provider approval readiness | PR #3 merged and safety flags false | Responsive/bundle/GIS audit; fail-closed activation, health, reliability, safety, provenance, offline/export/BCM/event contracts; security/accessibility review; GISTDA remains blocked; CI and human review required |
| 2.7 | Cross-device UX & GIS refinement | Phase 2.6 review/approval | **Complete:** PR #5 merged to `main`; responsive layouts and MapLibre mobile UX verified |
| 2.8 | Water & Weather provider readiness | PR #5 merged | **Complete:** PR merged to `main`; TMD/RID/ThaiWater/EGAT APIs audited, domain models and test validations added |
| 2.9 | Controlled weather/water provider pilot | Phase 2.8 review/approval | **Complete:** PR #7 merged to `main`; RID controlled pilot verified. Production Approval: PENDING. No live production display |
| 2.10 | Controlled TMD Weather Provider Pilot | Phase 2.9 review/approval | **Complete:** PR #8 merged to `main`; TMD controlled pilot verified. Production Approval: PENDING. No live production display |
| 2.11 | Windy Free Feasibility Audit | Phase 2.10 review/approval | **Complete:** PR #9 merged to `main`; Windy feasibility & licensing audit completed. Zero-cost alternatives mapped |
| 2.12 | Open-Meteo Controlled Forecast Prototype | Phase 2.11 review/approval | **Complete:** PR #10 merged to `main`; Open-Meteo controlled pilot verified. Production Approval: PENDING. No live production display |
| 3.0 | Multi-Source Weather Situation Pipeline | Phase 2.12 review/approval | **Controlled Situation Pipeline: COMPLETE. Production Approval: PENDING.** Worker-level orchestration combining TMD observed and Open-Meteo model forecast parameters. Gated by default; no production display |
| 3.1 | Weather Situation UI Safe Preview | Phase 3.0 review/approval | **Complete:** PR #12 merged to `main`; Separated OBSERVED, MODEL_FORECAST, source provenance, freshness, FutureGreen branding, and developer identity. |
| 3.2 | Usable Weather Preview & Controlled Live Mode | Phase 3.1 review/approval | **Complete:** PR #13 merged to `main`; Dual explicit DEMO and CONTROLLED LIVE modes, location preset selector, explainer guide, and zero silent fallback. |
| 3.3 | Real User Acceptance Test & UX Refinement | Phase 3.2 review/approval | **Complete:** Real user journeys validated, responsive navigation refined, dynamic breadcrumbs added, touch ergonomics improved, and zero silent fallback verified. |
| 3.4 | Free Radar Source Feasibility & Controlled Radar Layer | Phase 3.3 review/approval | **Complete:** PR #15 merged to `main`; RainViewer candidate audited, domain/worker adapter added, controlled MapLibre raster layer with timestamps and mandatory attribution, default OFF, zero nowcasting. |
| 3.5 | Multi-Source Weather & Radar Intelligence Preview | Phase 3.4 review/approval | **Controlled Intelligence Preview: COMPLETE. Production Approval: PENDING.** Unified TMD (`OBSERVED`), RainViewer (`OBSERVED_REMOTE_SENSING`), and Open-Meteo (`MODEL_FORECAST`) with conservative Time Alignment Matrix, Source Comparison, failure isolation, and zero nowcasting. |
| 3 | GISTDA integration | Exact GISTDA dataset/service approved after 2.5 gate | Adapter, contract, attribution, fallback, tests and production enablement review |
| 4 | Rain/weather | Approved TMD dataset/service | Observed/forecast/model/warning separated and tested |
| 5 | River and dam | Approved RID/HII datasets/services | Units, timestamps, trends, freshness, fallbacks tested |
| 6 | CCTV | Written authorization and stable endpoint | Access, attribution, freshness, failure handling tested |
| 7 | Situation intelligence | Verified inputs and authoritative thresholds | Rule traceability and summary limitations verified |
| 8 | Production | All preceding gates complete | Security, regression, responsive, performance, accessibility, operational/legal and deployment approval |

Earthquake and tsunami implementation phases are not scheduled by this document. PHASE 2 only establishes governed extension points and a migration assessment; implementation requires a separately approved phase transition.

Phase transitions require human review. Work that is blocked by one data integration does not prevent safe work on independent, already-approved components.
