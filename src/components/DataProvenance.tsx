interface DataProvenanceProps {
  compact?: boolean;
  record?: {
    source: string;
    dataset: string;
    dataType: string;
    observedAt: string | null;
    retrievedAt: string | null;
    freshness: string;
    attribution: string;
    status: string;
  };
}

export function DataProvenance({ compact = false, record }: DataProvenanceProps) {
  if (record) {
    return (
      <dl className={compact ? 'provenance provenance--compact' : 'provenance'}>
        <div><dt>Source</dt><dd>{record.source}</dd></div>
        <div><dt>Dataset</dt><dd>{record.dataset}</dd></div>
        <div><dt>Data Type</dt><dd>{record.dataType}</dd></div>
        {!compact && (
          <>
            <div><dt>Observed</dt><dd>{record.observedAt ?? '—'}</dd></div>
            <div><dt>Retrieved</dt><dd>{record.retrievedAt ?? '—'}</dd></div>
            <div><dt>Freshness</dt><dd>{record.freshness}</dd></div>
            <div><dt>License</dt><dd>{record.attribution}</dd></div>
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
      {!compact && (
        <>
          <div>
            <dt>Observed</dt>
            <dd>—</dd>
          </div>
          <div>
            <dt>Received</dt>
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
