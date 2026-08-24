interface DataProvenanceProps {
  compact?: boolean;
}

export function DataProvenance({ compact = false }: DataProvenanceProps) {
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
