# Phase 2.12 Controlled Prototype Evidence — Open-Meteo

This document contains the verified schemas, datatypes, and technical connectivity outcomes for the Open-Meteo controlled forecast prototype.

## 1. Technical Connectivity

- **Provider**: Open-Meteo
- **Dataset**: Forecast Model Prediction (`open-meteo-forecast`)
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Authentication**: None required for the free public API tier (up to 10,000 requests/day per IP).
- **Transport**: Cloudflare Worker Gateway Proxy
- **Internal route**: `GET /api/providers/open-meteo/forecast`
- **Location Scope**: Bounded strictly to one coordinate representing Bangkok (`latitude: 13.7563, longitude: 100.5018`). No database crawling or bulk province queries occur.

## 2. Schema Characteristics & Fields

The API returns a JSON payload containing hourly forecast arrays. Below are the verified mapping details:

| Telemetry Param | Upstream JSON Key | Type | Unit | validFrom Parser |
|---|---|---|---|---|
| **VALID_TIME** | `hourly.time` | string array | ISO 8601 local | Convert format `YYYY-MM-DDTHH:mm` to offset `+07:00` |
| **PRECIPITATION** | `hourly.precipitation` | number array | `mm` | Maps to `precipitationMm` |
| **PROBABILITY** | `hourly.precipitation_probability` | number array | `%` | Maps to `precipitationProbabilityPercent` |
| **TEMPERATURE** | `hourly.temperature_2m` | number array | `°C` | Maps to `temperatureCelsius` |
| **HUMIDITY** | `hourly.relative_humidity_2m` | number array | `%` | Maps to `humidityPercent` |
| **WIND_SPEED** | `hourly.wind_speed_10m` | number array | `km/h` | Maps to `windSpeedKph` |

### Timestamp Semantics
- Upstream timezone requested: `Asia/Bangkok`.
- Time formats are local offsets translated using `utc_offset_seconds` metadata to precise ISO 8601 representations (e.g. `2026-08-25T13:00:00+07:00`).
- Open-Meteo does not provide a forecast issuance timestamp; therefore, `issuedAt` is set to `null` to prevent fabrication, and the retrieved time is recorded as `retrievedAt`.

## 3. Legal & Licensing Terms

- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0). Programmatic use for public display and decision-support systems is permitted.
- **Attribution Requirement**: Mandatory. The UI must display "Weather data by Open-Meteo" with a hyperlink pointing to `https://open-meteo.com/`.
- **Production Status**: `PENDING — TECHNICAL CONNECTIVITY VERIFIED`. Technical connectivity and mapping schemas verified; production display requires Phase 3 integration and human sign-off.

## 4. Safety & Governance Compliance

1. **Gate Preservation**:
   - `GISTDA_PILOT_ENABLED=false`
   - `realDataConnected=false`
   - `operationalUseApproved=false`
2. **Worker Isolation**: The frontend cannot call the Open-Meteo API directly. All requests go through the Cloudflare Worker Gateway.
3. **Pilot Scope**: Bounded request (maximum of 1) with no scheduled fetching or background polling.
4. **UI Integration**: Forecast data is not connected to any map overlays, situation cards, BCM models, or alerts. Production build assets contain no live prototype components.
