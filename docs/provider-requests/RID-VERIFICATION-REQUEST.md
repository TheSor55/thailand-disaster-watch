# RID Integration Verification Request

This document lists the parameters, API rules, and legal rights to clarify with the Royal Irrigation Department (RID) prior to live connection.

## Verification Checklist

### 1. Data Reuse & Public Display Rights
- [ ] Confirm in writing that reservoir telemetry and river level observations may be displayed publicly on our dashboard.
- [ ] Identify if there is a specific license version (e.g. Open Government License) applicable to the endpoints.

### 2. API Endpoints & Stability
- [ ] Confirm that reservoir public endpoints (`https://app.rid.go.th/reservoir/api/reservoir/public`) and dam public endpoints (`https://app.rid.go.th/reservoir/api/dam/public`) are canonical and authorized for production integrations.
- [ ] Request the SLA, maximum rate limits, and caching policies.
- [ ] Confirm fallback procedures when endpoints fail or return outdated values.

### 3. Data Semantics & Units
- [ ] Validate standard units returned (e.g. water volume in million cubic meters, river level in meters relative to MSL).
- [ ] Verify the parsing schema for dates and times; ensure date values specify timezone offsets.
- [ ] Establish how to map station ID values to physical geographic coordinates without manual parsing guesses.
