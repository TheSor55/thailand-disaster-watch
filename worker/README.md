# Cloudflare Worker API Gateway

The Worker is isolated from the browser bundle and is reserved for authentication, secrets, API proxying, caching, normalization, and rate-limit protection.

PHASE 2.5 retains the non-operational `/api/health` endpoint and adds a disabled GISTDA 1-day flood TMS pilot route. The route is not connected to the React map and fails closed unless an explicit pilot flag, Worker-only key, and human-reviewed timeout are configured. It performs no production caching and exposes no key or upstream URL in logs/responses.

Configuration placeholders:

- `GISTDA_PILOT_ENABLED=false`
- `GISTDA_API_KEY` as a Worker secret
- `GISTDA_REQUEST_TIMEOUT_MS` with no default; requires human review

See `docs/GISTDA-INTEGRATION.md`. No production deployment is approved.
