# Windy Capability Matrix

This matrix catalogs the integration feasibility of each Windy capability under our zero-new-cost constraint.

| Capability / API Product | Testing Tier (Free) | Production Tier (Paid) | Production Allowed? | Status | Source / Limitations |
|---|---|---|---|---|---|
| **Map Forecast API** | Available | Available | No | `RESTRICTED` | Free key outputs shuffled/scrambled weather maps. |
| **Point Forecast API** | Available | Available | No | `RESTRICTED` | Free key outputs scrambled points forecast JSON. |
| **ECMWF (IFS)** | Available | Available | No | `RESTRICTED` | Subject to Windy wrapping & ECMWF commercial redistribute terms. |
| **GFS** | Available | Available | No | `RESTRICTED` | Public domain NOAA model, but Windy wrapper requires subscription. |
| **ICON** | Available | Available | No | `RESTRICTED` | DWD model, but Windy wrapper requires subscription. |
| **Rain Forecast** | Available (Scrambled) | Available | No | `RESTRICTED` | Scrambled in point/map API test keys. |
| **Rain Accumulation** | Available (Scrambled) | Available | No | `RESTRICTED` | Scrambled in point/map API test keys. |
| **Wind** | Available (Scrambled) | Available | No | `RESTRICTED` | Scrambled in point/map API test keys. |
| **Temperature** | Available (Scrambled) | Available | No | `RESTRICTED` | Scrambled in point/map API test keys. |
| **Pressure** | Available (Scrambled) | Available | No | `RESTRICTED` | Scrambled in point/map API test keys. |
| **Clouds** | Available (Scrambled) | Available | No | `RESTRICTED` | Scrambled in point/map API test keys. |
| **Radar** | `NOT_AVAILABLE` | `NOT_AVAILABLE` | No | `NOT_AVAILABLE` | Programmatic API radar tiles/animations are not supported by Windy. |
| **Satellite** | `NOT_AVAILABLE` | `NOT_AVAILABLE` | No | `NOT_AVAILABLE` | Programmatic API satellite tiles/animations are not supported by Windy. |
| **Waves** | Available (Scrambled) | Available | No | `RESTRICTED` | Scrambled in point/map API test keys. |
| **Severe Weather** | Available (Scrambled) | Available | No | `RESTRICTED` | Scrambled in point/map API test keys. |
| **Model Comparison** | Available (Scrambled) | Available | No | `RESTRICTED` | Scrambled in point/map API test keys. |

---

## Technical Classifications

- **FREE_PRODUCTION**: Available programmatically for production use at no cost.
- **FREE_DEVELOPMENT_ONLY**: Programmatically available but scrambled or bound by dev-only licenses.
- **PAID**: Requires professional billing/subscription.
- **RESTRICTED**: Explicitly forbidden for production redistribution without professional subscription.
- **NOT_AVAILABLE**: Feature not programmatically supported by official Windy APIs.
