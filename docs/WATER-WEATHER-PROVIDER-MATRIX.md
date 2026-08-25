# Water & Weather Provider Selection Matrix

This matrix evaluates and compares candidate official data providers for weather and water operational telemetry.

## Capability Matrix

| Capability | TMD | RID | ThaiWater (HII) | EGAT |
|---|---|---|---|---|
| **Rain observed** | Yes (Telemetry) | Varies (Local gauges) | Yes (Aggregated Telemetry) | No |
| **Rain forecast** | Yes (Official forecasts) | No | Yes (WRF models) | No |
| **River level** | No | Yes (Key gauging stations) | Yes (Aggregated Telemetry) | No |
| **Discharge** | No | Yes (Calculated flow) | Yes (Aggregated Telemetry) | No |
| **Reservoir** | No | Yes (Irrigation dams) | Yes (Aggregated Telemetry) | Yes (EGAT dams) |
| **Warning** | Yes (Official warnings) | Yes (Operational warnings) | No (Advisories only) | No |
| **API** | Yes (UID/UKey required) | Yes (Public JSON endpoints) | Yes (Conceptual standard) | Varies (CSV reference only) |
| **Timestamp quality** | High (Separate observed/issued) | Varies (Needs local parse) | High (Standard exchange) | Low (Annual update frequency) |
| **License** | Stated non-commercial | Varies by dataset | PENDING | CC BY (Historical only) |
| **Production readiness** | **PENDING — TECHNICAL CONNECTIVITY GATED** | **PENDING — TECHNICAL CONNECTIVITY VERIFIED** | **PENDING** | **APPROVED (CONDITIONAL)** |

---

## Detailed Provider Profiles

### 1. Thai Meteorological Department (TMD)
- **Authority**: Primary official weather, rainfall, storm, and earthquake warning authority in Thailand.
- **API Connectivity**: Publicly accessible with registered API credentials (`uid` and `ukey`). Outputs JSON and XML.
- **Timestamp Semantics**: Supports distinct temporal markers (`observedAt`, `issuedAt`, `validFrom`, `validTo`).
- **Production Status**: `PENDING — TECHNICAL CONNECTIVITY GATED`. Written confirmation for commercial use in decision-support applications is required.

### 2. Royal Irrigation Department (RID)
- **Authority**: Primary authority for river levels, water flow, and irrigation reservoirs.
- **API Connectivity**: Maintains direct JSON endpoints for reservoirs (`/reservoir/api/reservoir/public`) and dams (`/reservoir/api/dam/public`).
- **Timestamp Semantics**: Telemetry dates require custom verification parsing; timestamp schema is not standardized.
- **Production Status**: `PENDING — TECHNICAL CONNECTIVITY VERIFIED`. Technical connectivity and normalization checked in Phase 2.9 pilot. Written permission or explicit open usage license is required for production.

### 3. Hydro-Informatics Institute (HII / ThaiWater)
- **Authority**: Secondary aggregator that standardizes water data exchange across agencies.
- **API Connectivity**: Standard documents conceptual JSON formats (e.g. `/Rainfall`, `/Runoff`, `/LargesizedWaterResources`). Live operational API access needs written owner agreement.
- **Timestamp Semantics**: Follows high-quality standardized date schemas.
- **Production Status**: `PENDING`. Needs explicit connection permission.

### 4. EGAT
- **Authority**: Operates major power generation reservoirs.
- **API Connectivity**: The live database is a web frontend only. The national open data portal offers an annual CSV inflow dataset.
- **Timestamp Semantics**: Low frequency (annual) which is unsuitable for live disaster warnings.
- **Production Status**: `APPROVED_WITH_CONDITIONS` for historical reference analytics only. Live telemetry remains `PENDING`.
