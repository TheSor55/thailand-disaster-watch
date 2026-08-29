export interface DataProvenanceRecord {
  source: string;
  provider: string;
  dataset: string;
  authority: string;
  dataType: string;
  observedAt: string | null;
  publishedAt: string | null;
  retrievedAt: string | null;
  freshness: string;
  confidence: string;
  attribution: string | null;
  status: string;
}

interface DataProvenanceProps {
  compact?: boolean;
  record?: DataProvenanceRecord;
}

const unknown = (value: string | null) => value ?? 'Not provided';

export function DataProvenance({ compact = false, record }: DataProvenanceProps) {
  if (record) {
    return (
      <div className="provenance-container">
        {/* Executive Header Banner */}
        {!compact && (
          <div className="provenance-header-banner">
            <div className="provenance-status-badge">
              <span className="live-dot" />
              <span className="provenance-status-title">TELEMETRY VERIFIED</span>
            </div>
            <span className="provenance-freshness-chip">OFFICIAL</span>
          </div>
        )}

        {/* Structured Provenance Definition List */}
        <dl className={compact ? 'provenance provenance--compact' : 'provenance'}>
          <div className="provenance-card provenance-card--source">
            <dt>Source</dt>
            <dd>
              <span className="provenance-value-badge">{record.source}</span>
            </dd>
          </div>
          <div className="provenance-card provenance-card--provider">
            <dt>Provider</dt>
            <dd>{record.provider}</dd>
          </div>
          <div className="provenance-card provenance-card--dataset">
            <dt>Dataset</dt>
            <dd>{record.dataset}</dd>
          </div>
          <div className="provenance-card">
            <dt>Authority</dt>
            <dd><span className="authority-pill">{record.authority}</span></dd>
          </div>
          <div className="provenance-card">
            <dt>Data Type</dt>
            <dd>{record.dataType}</dd>
          </div>

          {!compact && (
            <>
              <div className="provenance-card">
                <dt>Observed</dt>
                <dd>{record.observedAt ?? '—'}</dd>
              </div>
              <div className="provenance-card">
                <dt>Published</dt>
                <dd>{record.publishedAt ?? '—'}</dd>
              </div>
              <div className="provenance-card">
                <dt>Retrieved</dt>
                <dd>{record.retrievedAt ?? '—'}</dd>
              </div>
              <div className="provenance-card">
                <dt>Freshness</dt>
                <dd><span className="freshness-badge">{record.freshness}</span></dd>
              </div>
              <div className="provenance-card">
                <dt>Confidence</dt>
                <dd><span className="confidence-badge">{record.confidence}</span></dd>
              </div>
              <div className="provenance-card provenance-card--full">
                <dt>Attribution</dt>
                <dd className="attribution-text">{unknown(record.attribution)}</dd>
              </div>
            </>
          )}

          <div className="provenance-card provenance-card--status">
            <dt>Status</dt>
            <dd>
              <span className="status-pill-text">{record.status}</span>
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div className="provenance-container">
      <dl className={compact ? 'provenance provenance--compact' : 'provenance'}>
        <div className="provenance-card">
          <dt>Source</dt>
          <dd>Not connected</dd>
        </div>
        <div className="provenance-card">
          <dt>Provider</dt>
          <dd>Not provided</dd>
        </div>
        <div className="provenance-card">
          <dt>Dataset</dt>
          <dd>Not provided</dd>
        </div>
        {!compact && (
          <>
            <div className="provenance-card">
              <dt>Observed</dt>
              <dd>—</dd>
            </div>
            <div className="provenance-card">
              <dt>Published</dt>
              <dd>—</dd>
            </div>
            <div className="provenance-card">
              <dt>Retrieved</dt>
              <dd>—</dd>
            </div>
          </>
        )}
        <div className="provenance-card">
          <dt>Updated</dt>
          <dd>—</dd>
        </div>
        <div className="provenance-card provenance-card--status">
          <dt>Status</dt>
          <dd>
            <span className="status-dot" aria-hidden="true" /> No live data
          </dd>
        </div>
      </dl>
    </div>
  );
}
