import type { DamTelemetry } from '../../domain/dam';

interface DamSituationCardProps {
  dams: DamTelemetry[];
  provinceNameTh: string;
  onOpenChaoPhrayaFlow?: () => void;
}

const HII_FLOW_URL = 'https://tiwrm.hii.or.th/DATA/REPORT/php/chart/chaopraya/small/chaopraya.php';
const HII_DAM_REPORT_URL = 'https://www.thaiwater.net/water/dam';

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

  return (
    <div className="water-card" aria-label="สถานการณ์น้ำในเขื่อนหลัก">
      <div className="water-card__header">
        <div>
          <span className="eyebrow">OBSERVED · RESERVOIR TELEMETRY</span>
          <h4>🏞 เขื่อนหลักในพื้นที่ / ลุ่มน้ำใกล้เคียง</h4>
        </div>
        <button
          type="button"
          className="btn-cctv-inspect"
          onClick={onOpenChaoPhrayaFlow}
          style={{ width: 'auto', padding: '4px 10px', fontSize: '0.65rem' }}
          title="เปิดผังน้ำลุ่มน้ำเจ้าพระยา สสน./HII"
        >
          🌊 ผังน้ำเจ้าพระยา (HII)
        </button>
      </div>

      <div className="dam-list">
        {dams.map((dam) => {
          const percentColor =
            dam.storagePercent > 80
              ? '#ef4444'
              : dam.storagePercent > 50
              ? '#10b981'
              : '#f59e0b';

          return (
            <div key={dam.damId} className="dam-item">
              <div className="dam-item__top">
                <strong className="dam-name">{dam.nameTh}</strong>
                <span className="dam-percent" style={{ color: percentColor }}>
                  {dam.storagePercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="dam-progress-track" role="progressbar" aria-valuenow={dam.storagePercent} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="dam-progress-fill"
                  style={{
                    width: `${Math.min(100, dam.storagePercent)}%`,
                    backgroundColor: percentColor,
                  }}
                />
              </div>

              <div className="dam-stats-grid">
                <div>
                  <small>ความจุอ่าง:</small>
                  <span>{dam.capacityMcm.toLocaleString()} ล้าน ลบ.ม.</span>
                </div>
                <div>
                  <small>น้ำปัจจุบัน:</small>
                  <strong>{dam.currentStorageMcm.toLocaleString()} ล้าน ลบ.ม.</strong>
                </div>
                <div>
                  <small>น้ำไหลเข้า:</small>
                  <span>+{dam.inflowMcm} ล้าน ลบ.ม./วัน</span>
                </div>
                <div>
                  <small>น้ำระบาย:</small>
                  <span>-{dam.outflowMcm} ล้าน ลบ.ม./วัน</span>
                </div>
              </div>

              <div className="dam-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                <small className="source-attr">แหล่งข้อมูล: {dam.attribution}</small>
                <a
                  href={HII_DAM_REPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 600, textDecoration: 'underline' }}
                  title="ตรวจสอบรายงานสถานการณ์น้ำในเขื่อนใหญ่ กรมชลประทานและ สสน. (HII)"
                >
                  ตรวจค่าสด HII/RID ↗
                </a>
              </div>
            </div>
          );
        })}
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
