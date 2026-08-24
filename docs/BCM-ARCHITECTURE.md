# Business continuity management architecture

PHASE 2 defines extension points only. No production business rule, trigger threshold, notification, or automatic action is implemented.

```text
Hazard evidence
  -> Exposure
  -> Business impact
  -> Trigger evaluation
  -> Recommendation
  -> Human approval
  -> Action
  -> Recovery and closure
```

## Domain boundaries

| Domain | Minimum future fields | Control |
|---|---|---|
| Hazard | governed record IDs, authority, time, freshness, conflict | Never infer missing measurements |
| Exposure | site/asset/supplier/logistics/labor reference, geography, data owner | Confidential by default where identifiable |
| Business impact | impact type, affected operation, evidence, estimate method/version | Estimate must be labeled; no fabricated amount |
| Trigger evaluation | rule ID/version, evaluated inputs, result, time | Approved authoritative rule only |
| Recommendation | proposed action, rationale, assumptions, expiry | Advisory; cannot execute |
| Approval | approver identity/role, decision, time, comment | Required before controlled action |
| Action | owner, status, due time, acknowledgement, evidence | Permission-scoped and auditable |
| Recovery | recovery criteria/version, checkpoints, residual risk, closure approval | Closure requires human confirmation |

## Planned impact domains

- People
- Facility
- Production
- Supply Chain
- IT
- Utilities
- Logistics
- Customer

Future extensions include BIA, MTPD/MAO, RTO, RPO, Critical Process, Dependencies, My Sites, Geofence, Action Owner, and Escalation Matrix. Definitions, ownership, units, and acceptance rules require business approval before implementation.

No customer, employee, supplier-contract, personal-location, or commercially sensitive record belongs in a public map or share link. Organization/tenant isolation, field-level classification, RBAC, redaction, retention, and deletion policy are prerequisites.

## Incident lifecycle

`DETECTED -> MONITORING -> ESCALATED -> BCM_REVIEW -> ACTIVATED_BY_HUMAN -> STABILIZED -> RECOVERY -> CLOSED -> POST_INCIDENT_REVIEW` is a vocabulary, not an automatic transition graph. Each transition requires an approved rule or human decision, records the actor and evidence, and may be rejected. Official-source corrections create a new auditable event rather than rewriting history.
