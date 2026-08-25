# TMD Integration Verification Request

This document lists the information and approvals required from the Thai Meteorological Department (TMD) before connecting live APIs in future phases.

## Verification Checklist

### 1. Data Reuse & Public Display Rights
- [ ] Confirm in writing that the project may display TMD weather forecasts, warnings, and rain observations on a public-facing website (`disaster.futuregreennet.com`).
- [ ] Verify if there are any restrictions on commercial use (decision support) or redistribute limits.

### 2. Attribution Wording
- [ ] Obtain the canonical attribution text required by TMD (e.g., "Source: Thai Meteorological Department").
- [ ] Confirm where the attribution must be placed relative to data tables or maps.

### 3. API Connectivity & Rate Limits
- [ ] Request/register a dedicated development and production API Key (`uid` and `ukey`).
- [ ] Confirm API rate limits (e.g., requests per minute/day) to prevent service blockages.
- [ ] Obtain documentation for error responses, downtime scheduling, and SLA commitments.

### 4. Timestamp & Validity Semantics
- [ ] Confirm the timezone (typically UTC+7) of the returned JSON/XML fields.
- [ ] Validate how to distinguish between `observedAt`, `issuedAt`, `validFrom`, and `validTo` fields in warning messages.
- [ ] Verify dataset freshness intervals (e.g., is weather warning updated every 3 hours or on-demand?).
