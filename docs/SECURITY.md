# Security baseline

## Trust boundaries

- Browser input and all upstream responses are untrusted.
- API keys, tokens, and credentials remain in server-side environment bindings.
- External data must be schema-validated before use.
- Remote URLs and geospatial payloads require allowlisting, size limits, timeouts, and safe parsing.

## Controls required before production

- Secret scanning and dependency review in CI
- Least-privilege environment bindings
- Security headers, Content Security Policy, HTTPS, and restricted CORS
- Request validation, response size limits, upstream timeouts, and rate limiting
- Cache-key review to prevent credential or tenant-data leakage
- Log redaction and no sensitive payload logging
- Dependency and license review
- Incident response, rollback, and data-source disable switches

## Current state

No secrets or external integrations are present. `.env*` and `.dev.vars*` files are ignored except explicit examples. `.env.example` contains empty server-side placeholders only. Production DNS, credentials, deployment, and permissions are not configured in PHASE 0.5.

## Human review gates

Architecture, authentication, paid services, production data, DNS, GitHub settings, deployment, and any write-capable external integration require explicit approval.
