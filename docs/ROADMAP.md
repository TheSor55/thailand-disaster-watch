# Roadmap

| Phase | Scope | Entry condition | Exit gate |
|---:|---|---|---|
| 0 | Repository, architecture, docs, baseline, checks | Project approval | Checks pass; risks documented |
| 0.5 | Architecture stabilization and GitHub bootstrap | Phase 0 approval | Vinext removed, GitHub/CI and local quality gates pass |
| 1 | UI shell and GIS map | Phase 0 review/approval | Responsive states and map shell verified; no unlabeled mock data |
| 2 | Official data source audit | Source-owner candidates confirmed | Evidence, license, attribution, schema, timestamp, and production status recorded |
| 3 | GISTDA integration | Approved GISTDA dataset/service | Adapter, contract, attribution, fallback, tests |
| 4 | Rain/weather | Approved TMD dataset/service | Observed/forecast/model/warning separated and tested |
| 5 | River and dam | Approved RID/HII datasets/services | Units, timestamps, trends, freshness, fallbacks tested |
| 6 | CCTV | Written authorization and stable endpoint | Access, attribution, freshness, failure handling tested |
| 7 | Situation intelligence | Verified inputs and authoritative thresholds | Rule traceability and summary limitations verified |
| 8 | Production | All preceding gates complete | Security, regression, responsive, performance, accessibility, deployment approval |

Phase transitions require human review. Work that is blocked by one data integration does not prevent safe work on independent, already-approved components.
