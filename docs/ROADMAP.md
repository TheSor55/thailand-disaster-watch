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
| 2.9 | Controlled weather/water provider pilot | Phase 2.8 review/approval | **Controlled Local Pilot (RID): COMPLETE. Production Approval: PENDING.** Single bounded request transport and telemetry normalization schemas verified. No live production display |
| 3 | GISTDA integration | Exact GISTDA dataset/service approved after 2.5 gate | Adapter, contract, attribution, fallback, tests and production enablement review |
| 4 | Rain/weather | Approved TMD dataset/service | Observed/forecast/model/warning separated and tested |
| 5 | River and dam | Approved RID/HII datasets/services | Units, timestamps, trends, freshness, fallbacks tested |
| 6 | CCTV | Written authorization and stable endpoint | Access, attribution, freshness, failure handling tested |
| 7 | Situation intelligence | Verified inputs and authoritative thresholds | Rule traceability and summary limitations verified |
| 8 | Production | All preceding gates complete | Security, regression, responsive, performance, accessibility, operational/legal and deployment approval |

Earthquake and tsunami implementation phases are not scheduled by this document. PHASE 2 only establishes governed extension points and a migration assessment; implementation requires a separately approved phase transition.

Phase transitions require human review. Work that is blocked by one data integration does not prevent safe work on independent, already-approved components.
