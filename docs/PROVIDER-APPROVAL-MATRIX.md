# Provider approval matrix — PHASE 2.6

Activation is fail-closed. A provider may be considered for production only when its production status is `APPROVED` or `APPROVED_WITH_CONDITIONS` and every mandatory gate below has documented human approval for the exact dataset and intended use.

| Provider | License | Display rights | Authentication | Schema | Timestamp semantics | Operational policy | Attribution | Human approval | Activation |
|---|---|---|---|---|---|---|---|---|---|
| GISTDA Disaster Platform | PENDING | PENDING | CONFIGURED FOR CONTROLLED PILOT | PENDING | PENDING | PENDING | PENDING | PENDING | **BLOCKED** |

`CONFIGURED FOR CONTROLLED PILOT` is technical evidence only. It is not approval for public display, operational use, caching, export, redistribution, or production traffic. The executable guard is `src/domain/providerGovernance.ts`.

## Required evidence

- Exact provider, dataset/service, documentation revision, and intended use
- License and display/export/redistribution rights
- Authentication and secret-handling review
- Response schema, units, coordinate reference, and timestamp semantics
- Rate, timeout, retry, cache, freshness, support, and attribution policy
- Named human decision, conditions, effective date, and review date

No gate may be inferred from connectivity alone.
