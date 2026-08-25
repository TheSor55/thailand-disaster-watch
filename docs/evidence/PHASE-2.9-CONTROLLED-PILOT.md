# Phase 2.9 Controlled Pilot Evidence — Royal Irrigation Department (RID)

This document contains the verified schemas, datatypes, and technical connectivity outcomes for the RID controlled telemetry pilot.

## Technical Connectivity

- **Provider**: Royal Irrigation Department (RID)
- **Dataset**: Medium/large reservoir telemetry (`rid-reservoir-telemetry`)
- **Endpoint**: `https://app.rid.go.th/reservoir/api/dam/public`
- **Authentication**: None required (public endpoint)
- **Transport**: Cloudflare Worker Gateway Proxy
- **Internal route**: `GET /api/providers/rid/reservoirs`

## Schema Characteristics & Fields

The API returns a JSON array of objects representing dam or reservoir status. Below are the verified mapping details:

| Telemetry Param | Upstream JSON Key | Type | Unit | observedAt Parser |
|---|---|---|---|---|
| **RESERVOIR_STORAGE** | `volume` / `storage` | number | `million m3` (or `volume_unit`) | Date parsed from `dam_date` or `observed_date` |
| **INFLOW** | `inflow` | number | `million m3/day` (or `inflow_unit`) | Date parsed from `dam_date` or `observed_date` |
| **OUTFLOW** | `outflow` | number | `million m3/day` (or `outflow_unit`) | Date parsed from `dam_date` or `observed_date` |

### Timestamp Semantics
- Upstream formats verified: `YYYY-MM-DD` (e.g. `2026-08-25`) and `DD/MM/YYYY` (e.g. `25/08/2026`).
- Missing timestamps remain `null`, and the observation freshness state defaults to `UNKNOWN` to avoid fabrication.

### Location Mapping
- `latitude` and `longitude` are mapped if present.
- If latitude/longitude are missing, coordinates default to `(0, 0)`. No automatic geocoding is performed in this phase.

## Safety & Governance Compliance

1. **Gate Preservation**:
   - `GISTDA_PILOT_ENABLED=false`
   - `realDataConnected=false`
   - `operationalUseApproved=false`
2. **Worker Isolation**: The frontend cannot call the RID API directly. All requests go through the Cloudflare Worker Gateway.
3. **Pilot Scope**: A maximum of 1 bounded request is made per API call. No crawling, looping, or bulk province telemetry fetching occurs.
4. **UI Integration**: Connection telemetry is not mapped to the map layers or situation widgets. Production build assets contain no pilot UI components.
