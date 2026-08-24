import type { ProviderHealthRecord } from '../domain/providerHealth';

interface SystemHealthPanelProps {
  providers: readonly ProviderHealthRecord[];
  operationalStatusByProviderId?: Readonly<Record<string, string>>;
}

const display = (value: string | number | null) => value ?? '—';

export function SystemHealthPanel({
  providers,
  operationalStatusByProviderId = {},
}: SystemHealthPanelProps) {
  return (
    <section className="system-health" aria-labelledby="system-health-heading">
      <h2 id="system-health-heading">Provider health</h2>
      <div className="system-health-table" role="table" aria-label="Provider operational health">
        <div role="row" className="system-health-header">
          <span role="columnheader">Provider</span>
          <span role="columnheader">Connectivity</span>
          <span role="columnheader">Last success</span>
          <span role="columnheader">Last failure</span>
          <span role="columnheader">Latency</span>
          <span role="columnheader">Freshness</span>
          <span role="columnheader">Operational status</span>
        </div>
        {providers.map((provider) => (
          <div role="row" key={provider.providerId}>
            <strong role="cell">{provider.providerId}</strong>
            <span role="cell" data-health-status={provider.status}>{provider.status}</span>
            <span role="cell">{display(provider.lastSuccessAt)}</span>
            <span role="cell">{display(provider.lastFailureAt)}</span>
            <span role="cell">{provider.latencyMs === null ? '—' : `${provider.latencyMs} ms`}</span>
            <span role="cell">{provider.freshness}</span>
            <span role="cell">{operationalStatusByProviderId[provider.providerId] ?? 'UNKNOWN'}</span>
          </div>
        ))}
      </div>
      <p>No credentials or authorization values are included in health records.</p>
    </section>
  );
}
