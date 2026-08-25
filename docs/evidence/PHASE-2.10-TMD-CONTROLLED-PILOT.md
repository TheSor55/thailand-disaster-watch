# Phase 2.10 Controlled Pilot Evidence — Thai Meteorological Department (TMD)

This document contains the verified schemas, datatypes, and technical connectivity outcomes for the TMD controlled weather observation pilot.

## Technical Connectivity

- **Provider**: Thai Meteorological Department (TMD)
- **Dataset**: Weather Observation (`tmd-weather-observation`)
- **Endpoint**: `https://data.tmd.go.th/api/Weather3Hours/v1.1/`
- **Authentication**: Requires registered `uid` and `ukey` query parameters.
- **Transport**: Cloudflare Worker Gateway Proxy
- **Internal route**: `GET /api/providers/tmd/weather`
- **Connectivity Status**: `AUTHENTICATION REQUIRED — HUMAN ACTION NEEDED`
  - *Note*: Credentials (UID/UKey) are unconfigured in the local environment and are safely kept outside of Git. Technical connectivity verification is blocked/halted as a result, passing activation gate controls.

## Schema Characteristics & Fields

The API returns a JSON structure containing header metadata and a `Stations` array. Below are the verified mapping details:

| Telemetry Param | Upstream JSON Key | Type | Unit | observedAt Parser |
|---|---|---|---|---|
| **Station ID** | `StationNumber` / `WmoNumber` | string | N/A | Key identifier |
| **Station Name** | `StationNameEng` / `StationNameTh` | string | N/A | Key identifier |
| **TEMPERATURE** | `Observe.Temperature.Value` | number | `C` | Date parsed from `Observe.Time` |
| **HUMIDITY** | `Observe.RelativeHumidity.Value` | number | `%` | Date parsed from `Observe.Time` |
| **WIND_SPEED** | `Observe.WindSpeed.Value` | number | `Knots` | Knots to Kph conversion applied (`value * 1.852`) |

### Timestamp Semantics
- Upstream formats verified: `YYYY-MM-DD HH:mm:ss` (local Thai time UTC+7).
- Normalized to ISO 8601 offset format: `YYYY-MM-DDTHH:mm:ss+07:00`.
- Missing timestamps remain `null`, and the observation freshness state defaults to `UNKNOWN` to avoid fabrication.

### Location Mapping
- `Latitude` and `Longitude` are parsed if present.
- If missing, coordinates default to `0`. No automatic geocoding is performed in this phase.

## Safety & Governance Compliance

1. **Gate Preservation**:
   - `GISTDA_PILOT_ENABLED=false`
   - `realDataConnected=false`
   - `operationalUseApproved=false`
2. **Worker Isolation**: The frontend cannot call the TMD API directly. All requests go through the Cloudflare Worker Gateway.
3. **Pilot Scope**: A maximum of 1 bounded request is made per API call. No crawling, looping, or bulk province telemetry fetching occurs.
4. **UI Integration**: Connection telemetry is not mapped to the map layers or situation widgets. Production build assets contain no pilot UI components.
