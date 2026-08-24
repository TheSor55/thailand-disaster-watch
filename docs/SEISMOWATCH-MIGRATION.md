# SeismoWatch migration assessment

Reference reviewed: `TheSor55/seismowatch` README and single-page implementation, 2026-08-24. Claims and endpoints in that repository are implementation evidence only; they do not establish license, reliability, or authority.

## Decision matrix

| Decision | Elements | Reason |
|---|---|---|
| Reuse concept | provider-specific adapters; normalized event model; per-source status; isolated failures via settled requests; earthquake/tsunami separation; manual refresh; geographic filters | Sound product/architecture patterns when rebuilt behind governed contracts |
| Rewrite | all provider clients; normalization; revision handling; deduplication; timestamp model; source health; map/UI modules; mobile/offline behavior | Current implementation is one large browser file and lacks production governance boundaries |
| Reject | public CORS proxy chain; direct browser production fetching; silent preference for USGS; silent heuristic merge; hard-coded magnitude/radius/impact assumptions; copying the full page | Security, traceability, license, correctness, and maintainability risks |
| Verify before use | USGS/EMSC/GEOFON/NOAA/GDACS endpoints; permissions; polling/WebSocket claims; cadence; attribution; geographic zones; warning/impact thresholds | Reachability or README text is not approval evidence |

## Specific migration risks

- Event merging currently uses approximate time/location/magnitude tolerances and can discard provenance. The replacement must retain all provider records, revision IDs, match evidence, and unresolved conflicts.
- Choosing one provider silently as canonical is prohibited. Authority and preferred display are explicit, reviewable policy.
- Earthquake magnitude alone does not establish tsunami, damage, or a business action. Any relationship needs an authoritative rule/model and clear limitations.
- Public CORS proxies expose availability, integrity, privacy, and terms-of-use risks. Approved adapters run server-side through allowlisted Worker routes with schema validation and bounded caching.
- CDN runtime dependencies and a network basemap prevent true offline operation; a future PWA must declare `ONLINE`, `DEGRADED`, or `OFFLINE`, its last synchronization time, and unavailable capabilities.

## Target module boundaries

```text
source adapter -> schema validator -> normalized governed record
              -> provenance/revision store -> conflict/dedup review
              -> hazard module -> map/panel/export
```

Provider adapters are enabled independently and only after their record in `DATA-SOURCES.md` and `DATA-LICENSE-REGISTRY.md` is approved for the intended scope.

PHASE 2.6 compatibility is contract-only: normalized events support point geometry, occurrence time, optional magnitude/depth, multiple provider source-event IDs, and official bulletin association. Deduplication thresholds, authority preference, feeds, and operational actions remain intentionally undefined and disabled.
