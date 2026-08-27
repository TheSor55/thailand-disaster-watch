import type { OfficialAlert } from '../../domain/warning';

interface SituationAlertCardProps {
  alerts: OfficialAlert[];
  provinceNameTh: string;
}

export function SituationAlertCard({ alerts, provinceNameTh }: SituationAlertCardProps) {
  if (alerts.length === 0) {
    return (
      <section className="panel alert-panel" aria-label="ประกาศเตือนภัยทางการ">
        <div className="panel-heading">
          <h2>Situation Alerts (ประกาศเตือนภัย)</h2>
          <span className="status-chip status-chip--small">NO ACTIVE ALERT</span>
        </div>
        <div className="empty-state">
          <span aria-hidden="true">✓</span>
          <p>ไม่มีประกาศเตือนภัยระดับรุนแรงในพื้นที่ {provinceNameTh} ในขณะนี้</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel alert-panel" aria-label="ประกาศเตือนภัยทางการ">
      <div className="panel-heading">
        <h2>Situation Alerts (ประกาศเตือนภัย)</h2>
        <span className="status-chip status-chip--warning">{alerts.length} ประกาศ</span>
      </div>

      <div className="alert-list">
        {alerts.map((alert) => (
          <article key={alert.alertId} className={`alert-item alert-item--${alert.severity.toLowerCase()}`}>
            <div className="alert-item__header">
              <span className="alert-badge">{alert.issuer} · {alert.issueNo}</span>
              <strong className="alert-issuer">{alert.issuerNameTh}</strong>
            </div>
            <h4 className="alert-title">{alert.titleTh}</h4>
            <p className="alert-summary">{alert.summaryTh}</p>
            <div className="alert-footer">
              <small>พื้นที่: {alert.targetAreas.join(', ')}</small>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap', gap: '4px' }}>
                <small className="source-attr">แหล่งข้อมูล: {alert.sourceAttribution}</small>
                {alert.officialUrl && (
                  <a
                    href={alert.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alert-official-link"
                    style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    ตรวจประกาศทางการฉบับจริง ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
