# Safety architecture

## Non-negotiable controls

1. Official warning and observation data always outrank models, external advisories, and AI summaries.
2. AI is advisory only. It cannot issue/cancel a warning, change incident state, approve a trigger, send a notification, or execute a BCM action.
3. Operational actions require an authenticated human approval with role, time, rule/version, evidence snapshot, and comment in the audit log.
4. Every card, map layer, export, and share view displays source, observation/issue time, freshness, confidence, and conflict state where applicable.
5. Unknown, delayed, stale, unavailable, and conflicting states are explicit and must not use reassuring defaults.
6. No threshold, impact radius, warning level, or action rule may enter production without an authoritative source, owner, version, effective date, test, and approval.
7. `EXERCISE` mode is visually persistent, watermarked in exports, isolated from production notifications/actions, and included in audit events.
8. Earthquake does not mean damage and does not constitute a tsunami warning.
9. Geographic proximity does not equal predicted impact.
10. AI cannot create an evacuation route. Official evacuation information has priority.
11. No data is safer than fabricated data.

## Human-in-the-loop path

```text
Governed evidence
  -> rule evaluation (traceable, no action)
  -> recommendation
  -> authorized human review
  -> approve / reject / revise
  -> controlled action
  -> acknowledgement and recovery tracking
```

Any missing approval, expired authorization, stale evidence, unresolved critical conflict, or degraded action channel fails closed. Emergency teams may use documented out-of-band procedures; the application must not invent one.

## Source and system health

The health view reports provider status, last successful sync, latency, error state, cache status, Worker status, adapter enabled state, last attempted receipt, last source observation, freshness, and validation failures. Credentials and raw confidential payloads are excluded. Health state is observable but does not itself change official hazard status.

PHASE 2.6 implements a reusable banner vocabulary for `NO LIVE DATA`, `LIVE DATA`, `DELAYED`, `STALE`, `OFFLINE`, `DEGRADED`, `EXERCISE`, `OFFICIAL WARNING`, and `SYSTEM ADVISORY`. Only `NO LIVE DATA` is used in the current application. Visual and text semantics keep official warning, observed data, forecast, model output, system advisory, BCM recommendation, BCM activation, and exercise distinct. Color is never the only status signal.

## Audit requirements

Security-sensitive and operational events are append-only: sign-in, role/permission change, source configuration, rule version, evaluation, approval/rejection, export/share, notification attempt/result, incident transition, and exercise-mode change. Retention and access periods remain subject to legal/organizational approval.
