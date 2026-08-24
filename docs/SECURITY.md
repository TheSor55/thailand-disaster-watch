# Security baseline

## Trust boundaries

- Browser input and all upstream responses are untrusted.
- API keys, tokens, and credentials remain in server-side environment bindings.
- External data must be schema-validated before use.
- Remote URLs and geospatial payloads require allowlisting, size limits, timeouts, and safe parsing.
- Public CORS proxies and undocumented scraping paths are prohibited.
- Organization/tenant IDs, roles, and classification checks are server-derived; client claims are untrusted.

## Controls required before production

- Secret scanning and dependency review in CI
- Least-privilege environment bindings
- Security headers, Content Security Policy, HTTPS, and restricted CORS
- Request validation, response size limits, upstream timeouts, and rate limiting
- Cache-key review to prevent credential or tenant-data leakage
- Log redaction and no sensitive payload logging
- Dependency and license review
- Incident response, rollback, and data-source disable switches
- RBAC for viewer, analyst, approver, incident manager, data steward, and administrator duties; final role names/permissions require owner approval
- Tenant/organization isolation at query, cache, export, share-link, log, and storage boundaries
- Append-only audit events with actor, action, target, time, tenant, rule/version, and result
- Expiring/revocable share links, QR targets, download authorization, and classification-aware redaction
- PDPA data-minimization, purpose, retention, access/correction/deletion workflow, and breach process subject to legal review

## Current state

No secret is present in the repository. A disabled Worker-only GISTDA pilot adapter exists, but no frontend live source/layer or production integration is enabled. `.env*` and `.dev.vars*` files are ignored except explicit examples; `.env.example` contains empty server-side placeholders only. Production DNS, credentials, deployment, and permissions are not configured.

Business-continuity records may contain employee, supplier, customer, site, route, inventory, and contractual information. They default to `CONFIDENTIAL` or `RESTRICTED` until an authorized data owner classifies them. They must never be exposed through the public disaster map by inheritance or convenience.

## GISTDA pilot controls

- `GISTDA_API_KEY` is Worker-only; it is never accepted from the browser, placed in a URL, response, cache key, or log.
- `GISTDA_PILOT_ENABLED` defaults false and missing key/timeout configuration fails closed.
- Request logs contain provider, outcome, status code, latency, and time only.
- The pilot returns `no-store`; no TTL is invented before rate/update/license review.
- Current OpenAPI uses an `API-Key` header. Older catalog query-key examples are not followed.
- A key-like value was observed in official catalog metadata during verification. It was neither used nor committed. GISTDA should remove/rotate it through an authorized security channel.

## Human review gates

Architecture, authentication, paid services, production data, DNS, GitHub settings, deployment, and any write-capable external integration require explicit approval.

## PHASE 2.6 review boundary

- Production source maps are disabled. No external runtime CDN script or unsafe HTML rendering is used.
- Provider routes must remain Worker allowlisted; controlled providers are never selected from a browser-supplied URL.
- Production must add and verify CSP, frame-ancestor/clickjacking control, Referrer-Policy, Permissions-Policy, restricted CORS, and HTTPS at the hosting/Worker boundary before deployment.
- Public disaster data and future private BCM data use separate storage, authorization, cache, export, log, and retention boundaries.
- Future names, mobile numbers, employee status, emergency contacts, and location data are personal data candidates. They must not enter public storage and require approved PDPA purpose, minimization, access, retention, correction/deletion, and breach processes.
- Dependency review is recorded per PHASE 2.6 quality run; major upgrades require compatibility testing and are not automatic.

The static-host `_headers` baseline defines CSP allowlists for local assets and the current OSM tile dependency, denies framing, limits referrer data and browser permissions, and enables MIME sniffing protection. These headers require verification on the final Cloudflare Pages/Worker deployment; their presence in the build is not deployment evidence.

PHASE 2.6 production dependency audit result: 26 production dependencies reviewed by `pnpm audit --prod`; 0 known info/low/moderate/high/critical advisories reported on 2026-08-24. Registry results are time-sensitive and must be rerun before release.
