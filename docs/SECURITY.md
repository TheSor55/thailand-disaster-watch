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

No secrets or external integrations are present. `.env*` and `.dev.vars*` files are ignored except explicit examples. `.env.example` contains empty server-side placeholders only. Production DNS, credentials, deployment, and permissions are not configured in PHASE 2.

Business-continuity records may contain employee, supplier, customer, site, route, inventory, and contractual information. They default to `CONFIDENTIAL` or `RESTRICTED` until an authorized data owner classifies them. They must never be exposed through the public disaster map by inheritance or convenience.

## Human review gates

Architecture, authentication, paid services, production data, DNS, GitHub settings, deployment, and any write-capable external integration require explicit approval.
