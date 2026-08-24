# Internal API and governance contract — PHASE 2

This is a source-independent design contract. It neither documents nor enables an external provider endpoint.

## Controlled vocabulary

```ts
type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
type DataKind = 'OBSERVED' | 'FORECAST' | 'MODEL' | 'OFFICIAL_WARNING' | 'SYSTEM_ADVISORY' | 'BCM_RECOMMENDATION';
type FreshnessState = 'FRESH' | 'DELAYED' | 'STALE' | 'UNAVAILABLE' | 'UNKNOWN';
type ConflictState = 'CONSISTENT' | 'PARTIAL_AGREEMENT' | 'CONFLICT' | 'INSUFFICIENT_DATA';
type Confidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
type SourceAuthority = 'OFFICIAL_WARNING' | 'OFFICIAL_OBSERVATION' | 'VERIFIED_MODEL' | 'SYSTEM_ADVISORY' | 'AI_SUMMARY';
type IncidentLifecycle = 'DETECTED' | 'MONITORING' | 'ESCALATED' | 'BCM_REVIEW' | 'ACTIVATED_BY_HUMAN' | 'STABILIZED' | 'RECOVERY' | 'CLOSED' | 'POST_INCIDENT_REVIEW';
type SystemMode = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'EXERCISE';
type ProviderHealthStatus = 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE' | 'DISABLED' | 'UNKNOWN';
```

Authority order is binding: `OFFICIAL_WARNING > OFFICIAL_OBSERVATION > VERIFIED_MODEL > SYSTEM_ADVISORY > AI_SUMMARY`. Authority is not a numerical confidence score and does not resolve conflicts automatically.

## Governed record envelope

```ts
interface GovernedRecord<T> {
  id: string;
  hazard: 'FLOOD' | 'HEAVY_RAIN' | 'RIVER' | 'DAM' | 'STORM' | 'EARTHQUAKE' | 'TSUNAMI' | 'LANDSLIDE' | 'DROUGHT' | 'WILDFIRE' | 'OTHER';
  kind: DataKind;
  value: T;
  unit: string | null;
  classification: DataClassification;
  authority: SourceAuthority;
  confidence: Confidence;
  conflictState: ConflictState;
  freshness: FreshnessState;
  source: {
    id: string;
    name: string;
    recordId: string | null;
    attribution: string;
    productionStatus: 'APPROVED' | 'APPROVED_WITH_CONDITIONS' | 'PENDING' | 'RESTRICTED' | 'UNKNOWN' | 'REJECTED';
  };
  observedAt: string | null;
  issuedAt: string | null;
  validFrom: string | null;
  validUntil: string | null;
  receivedAt: string;
  sourceTimezone: string | null;
  revision: string | null;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED';
}
```

All times use ISO 8601 at the internal boundary. Missing source time remains `null` and renders `UPDATE TIME UNKNOWN`; receipt time is never substituted. Original timezone/offset and source payload revision must be retained in protected provenance storage when available.

## Freshness and availability

Freshness is calculated only from an approved per-source policy. No global operational threshold exists in code or this document. Invalid/missing times or policy return `UNKNOWN`; unreachable/disabled sources return `UNAVAILABLE`. `FRESH` data may move to `DELAYED` or `STALE` while the system is `DEGRADED` or `OFFLINE`. Critical `STALE` records are excluded from automated risk evaluation and cannot create a BCM trigger.

## Conflict and confidence

- Differences between providers are retained as separate records; values are never averaged silently.
- Conflict detection rules are hazard-, measurement-, unit-, location-, and time-window-specific and require owner approval.
- UI displays source, time, status, and conflict state together.
- `CONFLICT` renders `DATA SOURCES DISAGREE — HUMAN REVIEW RECOMMENDED`.
- `UNKNOWN` is required when evidence is insufficient.
- AI may summarize labeled records but may not alter confidence, authority, lifecycle, warning status, or action state.

## Error envelope

```json
{
  "error": {
    "code": "SOURCE_TEMPORARILY_UNAVAILABLE",
    "message": "DATA TEMPORARILY UNAVAILABLE",
    "sourceId": "source-identifier",
    "occurredAt": "2026-08-24T00:00:00Z",
    "retryable": true
  }
}
```

One provider failure is isolated. Aggregate responses include health per source and must not represent partial results as complete.

## Provider activation and reliability

Activation requires license, display rights, authentication, schema, timestamp semantics, operational policy, attribution, and human approval gates. Connectivity evidence cannot bypass a gate. Generic timeout, retry/backoff, deduplication, cancellation, circuit breaker, and recovery-probe behavior accepts provider-specific configuration; this contract defines no official GISTDA numeric policy.

Future event normalization retains one normalized hazard event with all source event IDs and optional official bulletin associations. It does not define matching thresholds, silent canonical-provider selection, or operational deduplication rules.

## Incident and BCM extension points

Future incident records link governed hazards to exposure, business impact, evaluated trigger rule/version, recommendation, human approval, action, recovery state, owner, and audit events. The model is defined in `BCM-ARCHITECTURE.md`; PHASE 2 implements no automated action engine.

## PHASE 2.5 GISTDA pilot transport

Candidate internal route: `GET /api/providers/gistda/flood/1day/tiles/{z}/{x}/{y}.png`.

The route is disabled by default and returns a controlled JSON error until Worker-only secret and reviewed pilot configuration are present. A successful response is `image/png`, `Cache-Control: no-store`, and carries non-sensitive provenance headers: provider, observed-at=`unknown`, retrieved-at, and freshness=`UNKNOWN`. The tile has no severity or province status semantics. The official Feature API is not normalized because its reviewed OpenAPI 200 response has no schema.
