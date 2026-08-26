import type { DamTelemetry } from '../../domain/dam';

interface DamSituationCardProps {
  dams: DamTelemetry[];
  provinceNameTh: string;
}

export function DamSituationCard({ dams, provinceNameTh }: DamSituationCardProps) {
  if (dams.length === 0) {
    return (
      <div className="water-card water-card--empty">
        <div className="water-card__header">
          <span className="eyebrow">RESERVOIR & DAM TELEMETRY</span>
          <h4>🏞 ปริมาณน้ำกักเก็บในเขื่อนหลัก</h4>
        </div>
        <p className="empty-text">ไม่มีเขื่อนหลักขนาดใหญ่ในพื้นที่จังหวัด{provinceNameTh} (ติดตามเขื่อนในลุ่มน้ำใกล้เคียง)</p>
      </div>
    );
  }

  return (
    <div className="water-card" aria-label="สถานการณ์น้ำในเขื่อนหลัก">
      <div className="water-card__header">
        <span className="eyebrow">OBSERVED · RESERVOIR TELEMETRY</span>
        <h4>🏞 เขื่อนหลักในพื้นที่ / ลุ่มน้ำใกล้เคียง</h4>
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

              <div className="dam-footer">
                <small className="source-attr">แหล่งข้อมูล: {dam.attribution}</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
