import type { DamTelemetry } from '../../domain/dam';

interface DamSituationCardProps {
  dams: DamTelemetry[];
  provinceNameTh: string;
  onOpenChaoPhrayaFlow?: () => void;
}

const THAIWATER_DIRECT_URL = 'https://twa.thaiwater.net/th/map/basic/large-dam/overall/0?p=modal&c=102.91695%2C15.57230%2C5.000z';
const HII_FLOW_URL = 'https://tiwrm.hii.or.th/DATA/REPORT/php/chart/chaopraya/small/chaopraya.php';

export function DamSituationCard({ dams, provinceNameTh, onOpenChaoPhrayaFlow }: DamSituationCardProps) {
  if (dams.length === 0) {
    return (
      <div className="water-card water-card--empty">
        <div className="water-card__header">
          <span className="eyebrow">RESERVOIR &amp; DAM TELEMETRY</span>
          <h4>🏞 ปริมาณน้ำกักเก็บในเขื่อนหลัก</h4>
        </div>
        <p className="empty-text">ไม่มีเขื่อนหลักขนาดใหญ่ในพื้นที่จังหวัด{provinceNameTh} (ติดตามเขื่อนในลุ่มน้ำใกล้เคียง)</p>
        <div style={{ marginTop: '10px' }}>
          <button
            type="button"
            className="btn-cctv-inspect"
            onClick={onOpenChaoPhrayaFlow}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <span>🌊 ดูผังน้ำลุ่มน้ำเจ้าพระยา (HII Live Flow) ↗</span>
          </button>
        </div>
      </div>
    );
  }

  const now = new Date();
  const thaiDateStr = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  const thaiTimeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="water-card" aria-label="สถานการณ์น้ำในเขื่อนหลัก">
      <div className="water-card__header">
        <div>
          <span className="eyebrow">OBSERVED TELEMETRY · สสน. HII &amp; RID</span>
          <h4>🏞 อ่างเก็บน้ำขนาดใหญ่ (ข้อมูล สสน. HII)</h4>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.66rem',
              fontWeight: 600,
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '6px',
              padding: '3px 8px',
            }}
          >
            📅 {thaiDateStr} | {thaiTimeStr} น.
          </span>
          <button
            type="button"
            className="btn-cctv-inspect"
            onClick={onOpenChaoPhrayaFlow}
            style={{ width: 'auto', padding: '4px 8px', fontSize: '0.62rem' }}
            title="เปิดผังน้ำลุ่มน้ำเจ้าพระยา สสน./HII"
          >
            🌊 ผังน้ำ (HII)
          </button>
        </div>
      </div>

      <div className="dam-table-container">
        <table className="dam-telemetry-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left', minWidth: '135px' }}>อ่างเก็บน้ำ</th>
              <th style={{ textAlign: 'right' }}>น้ำกักเก็บ (ล้าน ลบ.ม.)</th>
              <th style={{ textAlign: 'center' }}>% ความจุ</th>
            </tr>
          </thead>
          <tbody>
            {dams.map((dam) => {
              const bgBadge =
                dam.storagePercent > 80
                  ? '#ef4444'
                  : dam.storagePercent >= 70
                  ? '#2563eb'
                  : dam.storagePercent >= 50
                  ? '#10b981'
                  : '#f59e0b';

              return (
                <tr key={dam.damId}>
                  <td style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem' }}>📍</span>
                      <div>
                        <strong style={{ display: 'block', color: '#f8fafc', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{dam.nameTh}</strong>
                        <small style={{ color: '#94a3b8', fontSize: '0.65rem' }}>{dam.province}</small>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#f8fafc', fontSize: '0.8rem' }}>
                    {dam.currentStorageMcm.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        backgroundColor: bgBadge,
                      }}
                    >
                      {dam.storagePercent}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
        <a
          href={HII_FLOW_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            textDecoration: 'none',
            padding: '7px 10px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            fontWeight: 700,
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
          }}
        >
          <span>🌊 เปิดผังการไหลน้ำเจ้าพระยา (HII Real-time Flow Diagram) ↗</span>
        </a>
      </div>
    </div>
  );
}
