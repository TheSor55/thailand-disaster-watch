import type { RiverStationTelemetry } from '../../domain/river';

interface RiverStationCardProps {
  stations: RiverStationTelemetry[];
  provinceNameTh: string;
}

const THAIWATER_RIVER_URL = 'https://twa.thaiwater.net/th/map/basic/water-level-discharge/overall/0?p=modal&c=102.91695%2C15.57230%2C5.000z';

export function RiverStationCard({ stations, provinceNameTh }: RiverStationCardProps) {
  if (stations.length === 0) {
    return (
      <div className="water-card water-card--empty">
        <div className="water-card__header">
          <span className="eyebrow">RIVER TELEMETRY</span>
          <h4>🌊 สถานีตรวจวัดระดับน้ำแม่น้ำสายหลัก</h4>
        </div>
        <p className="empty-text">ไม่มีสถานีหลักในตัวเมือง{provinceNameTh} (ติดตามสถานีวัดน้ำต้นน้ำ/ท้ายน้ำ)</p>
      </div>
    );
  }

  return (
    <div className="water-card" aria-label="สถานีตรวจวัดระดับน้ำแม่น้ำสายหลัก">
      <div className="water-card__header">
        <div>
          <span className="eyebrow">OBSERVED · RIVER TELEMETRY</span>
          <h4>🌊 ระดับน้ำและปริมาณน้ำท่า (สสน. HII)</h4>
        </div>
        <a
          href={THAIWATER_RIVER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cctv-inspect"
          style={{ width: 'auto', padding: '4px 8px', fontSize: '0.62rem', textDecoration: 'none' }}
          title="เปิดรายงานระดับน้ำท่าและระดับน้ำสายหลัก Real-time จาก สสน. (ThaiWater.net)"
        >
          🌊 แผนที่น้ำท่า สสน. ↗
        </a>
      </div>

      <div className="river-list">
        {stations.map((st) => {
          const diff = st.bankLevelMsl - st.waterLevelMsl;
          const isWarning = diff < 1.0;
          const trendIcon = st.trend === 'RISING' ? '▲ กำลังเพิ่มขึ้น' : st.trend === 'FALLING' ? '▼ กำลังลดลง' : '▬ ทรงตัว';

          return (
            <div key={st.stationCode} className="river-item">
              <div className="river-item__top">
                <div>
                  <strong className="river-name">{st.riverName} ({st.stationNameTh})</strong>
                  <span className="river-loc">{st.location}</span>
                </div>
                <span className={`status-chip status-chip--${isWarning ? 'warning' : 'stable'}`}>
                  {isWarning ? 'เฝ้าระวัง' : 'ปกติ'}
                </span>
              </div>

              <div className="river-stats-grid">
                <div>
                  <small>ระดับน้ำปัจจุบัน:</small>
                  <strong>{st.waterLevelMsl} ม.รทก.</strong>
                </div>
                <div>
                  <small>ระดับตลิ่ง:</small>
                  <span>{st.bankLevelMsl} ม.รทก.</span>
                </div>
                <div>
                  <small>ต่ำกว่าตลิ่ง:</small>
                  <span style={{ color: isWarning ? '#ef4444' : '#10b981' }}>
                    {diff.toFixed(2)} ม.
                  </span>
                </div>
                <div>
                  <small>แนวโน้ม:</small>
                  <span>{trendIcon}</span>
                </div>
              </div>

              <div className="river-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                <small className="source-attr">แหล่งข้อมูล: {st.attribution}</small>
                <a
                  href={THAIWATER_RIVER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 600, textDecoration: 'underline' }}
                  title="ตรวจสอบระดับน้ำท่าและน้ำสายหลักสดจาก สสน. (ThaiWater.net)"
                >
                  ตรวจค่าสด สสน. ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
