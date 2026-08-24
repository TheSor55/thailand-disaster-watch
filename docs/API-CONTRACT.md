# Internal API contract baseline

This document defines proposed internal conventions only. It does not describe or imply any external provider endpoint, and no endpoint is implemented in PHASE 0.

## Normalized observation envelope

```ts
type VerificationStatus = 'VERIFIED' | 'UNVERIFIED';
type AvailabilityStatus = 'AVAILABLE' | 'TEMPORARILY_UNAVAILABLE';

interface Observation<T> {
  value: T;
  unit: string | null;
  source: {
    id: string;
    name: string;
    attribution: string;
  };
  observedAt: string | null;
  receivedAt: string;
  verificationStatus: VerificationStatus;
  availabilityStatus: AvailabilityStatus;
}
```

`observedAt = null` must render as `UPDATE TIME UNKNOWN`. `receivedAt` is not a substitute for observation time.

## Error envelope

```json
{
  "error": {
    "code": "SOURCE_TEMPORARILY_UNAVAILABLE",
    "message": "DATA TEMPORARILY UNAVAILABLE",
    "sourceId": "source-identifier",
    "retryable": true
  }
}
```

## Contract rules

- Keep observed, forecast, model, and warning payloads distinct.
- Units and coordinate reference systems are explicit; adapters must not silently infer them.
- Upstream timestamps must retain their original timezone/offset semantics before normalization.
- Unknown or unverified external schemas must fail closed and remain unavailable to production.
- Internal routes, pagination, filtering, cache metadata, and detailed schemas will be versioned only when their Phase implementation is approved.
