# Roadmap

| Phase | Scope | Entry condition | Exit gate |
|---:|---|---|---|
| 0 | Repository, architecture, docs, baseline, checks | Project approval | Checks pass; risks documented |
| 0.5 | Architecture stabilization and GitHub bootstrap | Phase 0 approval | Vinext removed, GitHub/CI and local quality gates pass |
| 1 | UI shell and GIS map | Phase 0.5 review/approval | **Complete:** PR #1 merged to `main`; checks and human review passed |
| 2 | Official data, safety, governance, BCM and multi-hazard extension contracts | Phase 1 merged | Evidence/status register, authority/freshness/conflict models, safety/BCM/offline/export/mobile contracts; no live API; checks and human review |
| 3 | GISTDA integration | Approved GISTDA dataset/service | Adapter, contract, attribution, fallback, tests |
| 4 | Rain/weather | Approved TMD dataset/service | Observed/forecast/model/warning separated and tested |
| 5 | River and dam | Approved RID/HII datasets/services | Units, timestamps, trends, freshness, fallbacks tested |
| 6 | CCTV | Written authorization and stable endpoint | Access, attribution, freshness, failure handling tested |
| 7 | Situation intelligence | Verified inputs and authoritative thresholds | Rule traceability and summary limitations verified |
| 8 | Production | All preceding gates complete | Security, regression, responsive, performance, accessibility, operational/legal and deployment approval |

Earthquake and tsunami implementation phases are not scheduled by this document. PHASE 2 only establishes governed extension points and a migration assessment; implementation requires a separately approved phase transition.

Phase transitions require human review. Work that is blocked by one data integration does not prevent safe work on independent, already-approved components.
