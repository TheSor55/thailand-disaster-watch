# Observability contract — PHASE 2.6

Observability is operational metadata, not a payload archive. Events are structured and sanitized before leaving a trust boundary.

## Allowed request event fields

```text
requestId
provider
dataset
route
outcome
statusCode
latency
timestamp
```

Route values must be normalized templates without query strings. Provider responses, tiles, request/response headers, URLs containing parameters, organization data, and browser storage are not log fields.

## Forbidden content

- Secret, API key, bearer token, cookie, authorization value, or private credential
- Raw upstream payload or confidential BCM record
- Personal data, precise personal location, emergency contact, or employee status
- Unbounded error objects or stack traces returned to users

Provider health contains only provider ID, health status, last success/failure, latency, consecutive failure count, freshness, and separately governed operational status. Health does not change warning authority or production eligibility.

Retention, access, alert routing, sampling, monitoring provider, and incident escalation remain `PENDING HUMAN APPROVAL`.
