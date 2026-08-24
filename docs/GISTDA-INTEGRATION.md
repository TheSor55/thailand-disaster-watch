# GISTDA verification and controlled pilot — PHASE 2.5

Verification date: **2026-08-24**

Engineering reviewer: **Project engineering review; human approval pending**

Production status: **`PENDING — DO NOT USE IN PRODUCTION`**

## Decision

No GISTDA dataset is promoted to `APPROVED` or `APPROVED_WITH_CONDITIONS`. The repository contains a disabled, Worker-only TMS pilot adapter and contract tests. The React application exposes no GISTDA source or live layer. Enabling the pilot requires an authorized key, an approved request-timeout setting, and an explicit environment flag; production still requires a later code/config approval.

## Dataset verification

| Candidate | Official evidence | Verified facts | Missing evidence | Decision |
|---|---|---|---|---|
| Flood extent dataset (`disasters-03`) | [GISTDA Open Data record](https://opendata.gistda.or.th/th/dataset/disasters-03) | Owner GISTDA; national coverage; data category public; license label `Open Data Common`; API key registration required; update frequency recorded as unknown | Full license text/version; commercial/redistribution terms; mandatory attribution; authoritative response schema; observation/publish timestamp semantics; rate/SLA | `PENDING — DO NOT INTEGRATE` |
| Disaster Platform flood 1/3/7/30-day Feature API | [Official OpenAPI UI](https://disaster.gistda.or.th/services/open-api?type=flood) | Base URL and paths; JSON; optional bbox/limit/offset/admin filters; `API-Key` HTTP header; documented 200/400/401/404 | 200 response schema is empty in OpenAPI; real schema not observed without an authorized key; update time, CRS, rate/SLA and full reuse terms absent | `PENDING — NO UI/PRODUCTION PATH` |
| Flood 1/3/7/30-day WMS/WMTS | Same official OpenAPI | XML response documented; key required | Capabilities/layer/CRS/style and timestamp semantics unavailable without authorized access | `PENDING` |
| Flood 1/3/7/30-day TMS | Same official OpenAPI | `{z}/{x}/{y}` paths; `image/png`; key required; tile transport suits MapLibre better than massive GeoJSON | Tile scheme/zoom bounds, observation time, cache/rate policy, attribution and commercial terms unverified | Disabled Worker pilot for engineering verification only; production `PENDING` |
| Flood frequency | Official OpenAPI and catalog | Feature/map routes are listed | Historical semantics are not an observed current flood layer; same license/schema/access gaps | `PENDING` |
| “เช็คน้ำ”, private, undocumented, forecasts, CCTV | No complete approved record in this review | None | License/authorization/schema | `PENDING — EXCLUDED` |

## Authentication and observed behavior

- Current Disaster Platform OpenAPI defines `api_key` as an `API-Key` HTTP header.
- The catalog record shows older/different GI-service examples using an `api_key` query parameter. This inconsistency requires GISTDA confirmation; the pilot follows the current OpenAPI header and never puts a key in a URL.
- Unauthenticated checks on 2026-08-24 returned HTTP `407 Authentication Required`, although OpenAPI documents `401`; the adapter maps both to `AUTHENTICATION_FAILED`.
- CORS preflight from the production target returned `204`, allowed `API-Key`, and reported `Access-Control-Allow-Origin: *`. This does **not** justify exposing a key in React.
- No rate-limit headers or SLA were established. No polling or production cache policy is implemented.
- Official catalog metadata exposed a key-like credential in a resource example. It was not used or copied. The data owner should remove/rotate it; the project must treat all catalog examples as compromised and require its own authorized secret.

## Pilot architecture

```text
MapLibre (future, internal URL only)
  -> Cloudflare Worker route
  -> validation-gated GISTDA TMS client
  -> API-Key header from Worker secret
  -> official GISTDA API Gateway
```

Internal candidate route:

`GET /api/providers/gistda/flood/1day/tiles/{z}/{x}/{y}.png`

The route is disabled unless all conditions are satisfied:

- `GISTDA_PILOT_ENABLED=true`
- `GISTDA_API_KEY` exists as a Worker secret/local ignored environment value
- `GISTDA_REQUEST_TIMEOUT_MS` contains a human-approved positive value

There is deliberately no default timeout, cache TTL, polling interval, freshness threshold, or maximum zoom. The adapter deduplicates concurrent requests for the same tile within a Worker isolate, sends no secret in URL/log/response, validates HTTP status, `image/png`, and non-empty bytes, and returns `Cache-Control: no-store` until policy review.

## Timestamp and provenance

The reviewed TMS contract exposes no `Observed At` or `Published At`. The internal metadata therefore records:

- `observedAt: null`
- `retrievedAt`: Worker receipt time
- `freshness: UNKNOWN`
- `productionStatus: PENDING`

UI must display Observation time as `—`/`Observation time unavailable`; it must not call the layer `LIVE`, infer severity, aggregate province status, or generate a warning.

## Errors

| Condition | Internal code |
|---|---|
| Pilot disabled | `GISTDA_PILOT_DISABLED` |
| Timeout policy missing | `PILOT_CONFIGURATION_REQUIRED` |
| Secret missing | `AUTHENTICATION_NOT_CONFIGURED` |
| Upstream 401/407 | `AUTHENTICATION_FAILED` |
| Upstream 429 | `RATE_LIMITED` |
| Upstream 404 | `NO_DATA` |
| Timeout | `TIMEOUT` |
| Wrong content type or empty body | `INVALID_RESPONSE` |
| Other upstream/network failure | `GISTDA_UNAVAILABLE` |

One tile failure is isolated. The UI must show `GISTDA DATA TEMPORARILY UNAVAILABLE` if a future approved layer is enabled.

## Human verification required

Before any map layer is enabled, obtain and approve: complete license text/version, commercial/public-display and derivative/cache rights, mandatory attribution wording, authorized API key, current endpoint/version, tile scheme/zoom/CRS, rate/SLA/cache policy, timestamp semantics, and a successful contract capture with no sensitive data. GISTDA should also be notified of the key-like value in catalog metadata through an authorized channel.
