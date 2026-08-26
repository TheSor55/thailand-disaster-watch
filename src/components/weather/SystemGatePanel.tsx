/**
 * SystemGatePanel — read-only display of environment gate flags.
 * Provides no controls that enable providers.
 * Development information only — visible to developers to verify
 * safety gates remain closed.
 */

interface GateFlag {
  key: string;
  label: string;
  value: string | boolean | null | undefined;
}

interface SystemGatePanelProps {
  flags: GateFlag[];
}

export function SystemGatePanel({ flags }: SystemGatePanelProps) {
  return (
    <section className="system-gate-panel" aria-label="System Gate Status">
      <div className="system-gate-panel__header">
        <span className="eyebrow">SYSTEM GATE STATUS</span>
        <p className="system-gate-panel__note">Read-only. No controls to enable production here.</p>
      </div>
      <ul className="system-gate-panel__list" role="list">
        {flags.map((flag) => {
          const isDisabled = flag.value === false || flag.value === 'false' || flag.value == null;
          return (
            <li key={flag.key} className="system-gate-panel__row">
              <code className="system-gate-panel__key">{flag.key}</code>
              <span
                className={`system-gate-panel__value ${isDisabled ? 'system-gate-panel__value--off' : 'system-gate-panel__value--on'}`}
                aria-label={`${flag.key}: ${String(flag.value ?? 'not set')}`}
              >
                {String(flag.value ?? 'not set')}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
