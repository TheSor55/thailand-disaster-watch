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
      <dl className={compact ? 'provenance provenance--compact' : 'provenance'}>
        <div><dt>Source</dt><dd>{record.source}</dd></div>
        <div><dt>Provider</dt><dd>{record.provider}</dd></div>
        <div><dt>Dataset</dt><dd>{record.dataset}</dd></div>
        <div><dt>Authority</dt><dd>{record.authority}</dd></div>
        <div><dt>Data Type</dt><dd>{record.dataType}</dd></div>
        {!compact && (
          <>
            <div><dt>Observed</dt><dd>{record.observedAt ?? '—'}</dd></div>
            <div><dt>Published</dt><dd>{record.publishedAt ?? '—'}</dd></div>
            <div><dt>Retrieved</dt><dd>{record.retrievedAt ?? '—'}</dd></div>
            <div><dt>Freshness</dt><dd>{record.freshness}</dd></div>
            <div><dt>Confidence</dt><dd>{record.confidence}</dd></div>
            <div><dt>Attribution</dt><dd>{unknown(record.attribution)}</dd></div>
          </>
        )}
        <div><dt>Status</dt><dd>{record.status}</dd></div>
      </dl>
    );
  }

  return (
    <dl className={compact ? 'provenance provenance--compact' : 'provenance'}>
      <div>
        <dt>Source</dt>
        <dd>Not connected</dd>
      </div>
      <div><dt>Provider</dt><dd>Not provided</dd></div>
      <div><dt>Dataset</dt><dd>Not provided</dd></div>
      {!compact && (
        <>
          <div>
            <dt>Observed</dt>
            <dd>—</dd>
          </div>
          <div><dt>Published</dt><dd>—</dd></div>
          <div>
            <dt>Retrieved</dt>
            <dd>—</dd>
          </div>
        </>
      )}
      <div>
        <dt>Updated</dt>
        <dd>—</dd>
      </div>
      <div>
        <dt>Status</dt>
        <dd><span className="status-dot" aria-hidden="true" /> No live data</dd>
      </div>
    </dl>
  );
}
