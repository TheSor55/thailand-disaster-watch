# GISTDA controlled local pilot result

Evidence date: **2026-08-24**

Evidence classification: **Sanitized engineering verification — no credential or provider tile retained**

## Result

| Field | Verified result |
|---|---|
| Provider | GISTDA |
| Pilot | Controlled Local |
| Environment | Local Cloudflare Worker via Wrangler; not deployed |
| Transport | Worker → GISTDA API Gateway |
| Endpoint family | Disaster Platform flood 1-day TMS |
| Worker status | `READY_FOR_CONTROLLED_PILOT` |
| Authentication | Configured / successful through Worker-only `API-Key` header |
| HTTP result | `200` |
| Media type | `image/png` |
| Response size | `1,118 bytes` |
| Request error | `null` |
| Credential | `REDACTED — NOT STORED` |
| Operational approval | `NO` — `operationalUseApproved = false` |
| Production connection | `NO` — `realDataConnected = false` |
| Production status | `PENDING — DO NOT ENABLE PRODUCTION` |

The controlled request verifies technical authentication and transport only. The test used one Web Mercator XYZ tile assumption containing Bangkok at zoom 6; the provider's authoritative TMS scheme, supported zooms, CRS/projection, and operational tile policy remain unverified. No inference is made about flood presence, observation time, freshness, severity, warning status, or geographic completeness.

## Security closeout

- The temporary ignored secret file was removed after the request.
- The one-time local helper and Worker process were stopped and removed.
- No API key or authorization value was added to source, frontend assets, documentation, logs committed to Git, or Git history.
- No response tile/image was saved or committed.
- No credential screenshot is part of repository evidence.
- A credential exposed during an initial local entry attempt was immediately revoked. The human operator cleared the related local credential, clipboard, and command-history artifacts, and a replacement credential was used for the successful request.
- The replacement credential remains only in the human-controlled local password store and is not a repository artifact.

## Remaining human verification

- Full license text/version and public-display rights
- Commercial/business use and redistribution rights
- Screenshot/export and derivative/cache rights
- Mandatory attribution wording
- Rate limit, cache policy, and SLA
- Observation/publication timestamp semantics and update frequency
- TMS tile scheme, supported zoom levels, and CRS/projection
- WMS/WMTS/TMS operational policy

Until these items are approved, the GISTDA layer remains disabled and the pilot must not be interpreted as production eligibility.
