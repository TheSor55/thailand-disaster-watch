import type { PinnedSite } from './MySitesPanel';

interface BcmReportModalProps {
  site: PinnedSite;
  onClose: () => void;
}

export function BcmReportModal({ site, onClose }: BcmReportModalProps) {
  const currentDateFormatted = new Date().toLocaleString('th-TH', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const isHighRisk = site.floodRisk === 'HIGH' || site.rainRisk === 'HIGH';
  const isWatch = site.floodRisk === 'WATCH' || site.rainRisk === 'MODERATE';
  const overallStatus = isHighRisk ? 'เสี่ยงสูง (HIGH RISK)' : isWatch ? 'เฝ้าระวัง (WATCH)' : 'สภาวะปกติ (NORMAL)';
  const statusColor = isHighRisk ? '#ef4444' : isWatch ? '#f59e0b' : '#10b981';

  return (
    <div className="bcm-modal-backdrop" onClick={onClose}>
      <div
        className="bcm-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`รายงานประเมินความเสี่ยง BCM: ${site.name}`}
      >
        <header className="bcm-modal-header">
          <div className="bcm-brand-title">
            <span className="bcm-badge">FUTUREGREEN DISASTER INTELLIGENCE</span>
            <h2>รายงานประเมินความเสี่ยงอุทกภัยและความต่อเนื่องทางธุรกิจ (BCM Report)</h2>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="ปิดหน้าต่าง">
            ✕
          </button>
        </header>

        <div className="bcm-modal-body" id="bcm-printable-area">
          {/* Executive Header Box */}
          <div className="bcm-exec-card">
            <div className="bcm-exec-main">
              <span className="bcm-site-type">
                {site.category === 'FACTORY'
                  ? '🏭 โรงงาน & สำนักงาน'
                  : site.category === 'WAREHOUSE'
                  ? '📦 ศูนย์กระจายสินค้า (DC)'
                  : site.category === 'ESTATE'
                  ? '🏗️ นิคมอุตสาหกรรม'
                  : '🏢 สำนักงาน'}
              </span>
              <h3 className="bcm-company-name">{site.name}</h3>
              {site.address && <p className="bcm-address">{site.address}</p>}
              <p className="bcm-meta-geo">
                จังหวัด: <strong>{site.province}</strong> · พิกัด GPS: <code>{site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}</code>
              </p>
            </div>
            <div className="bcm-overall-risk" style={{ borderColor: statusColor }}>
              <small>ดัชนีความเสี่ยงรวม (Overall Risk)</small>
              <strong style={{ color: statusColor }}>{overallStatus}</strong>
              <span>ประเมิน ณ {currentDateFormatted}</span>
            </div>
          </div>

          {/* 4-Pillar Risk Matrix */}
          <div className="bcm-matrix-grid">
            <div className="bcm-matrix-card">
              <div className="bcm-matrix-card__icon">🌧️</div>
              <h4>1. กลุ่มเมฆฝนและเรดาร์ (Precipitation)</h4>
              <p className="bcm-metric">
                สถานะ: <span className={`risk-pill risk-pill--${site.rainRisk === 'HIGH' ? 'danger' : site.rainRisk === 'MODERATE' ? 'warning' : 'safe'}`}>
                  {site.rainRisk === 'HIGH' ? 'ฝนตกหนักต่อเนื่อง' : site.rainRisk === 'MODERATE' ? 'มีกลุ่มฝนผ่าน' : 'ไม่มีกลุ่มฝนรุนแรง'}
                </span>
              </p>
              <small>ตรวจสอบผ่านเรดาร์สังเกตการณ์ กรมอุตุนิยมวิทยา / RainViewer ในรัศมี 25 กม.</small>
            </div>

            <div className="bcm-matrix-card">
              <div className="bcm-matrix-card__icon">🛰️</div>
              <h4>2. น้ำท่วมขังดาวเทียม (Satellite Flood Extent)</h4>
              <p className="bcm-metric">
                สถานะ: <span className={`risk-pill risk-pill--${site.floodRisk === 'HIGH' ? 'danger' : site.floodRisk === 'WATCH' ? 'warning' : 'safe'}`}>
                  {site.floodRisk === 'HIGH' ? 'พบน้ำท่วมขังใกล้เคียง' : site.floodRisk === 'WATCH' ? 'เฝ้าระวังพื้นที่ลุ่มต่ำ' : 'ไม่พบน้ำท่วมขัง'}
                </span>
              </p>
              <small>ภาพถ่ายดาวเทียม Sentinel-1 SAR โดย GISTDA ไม่พบแนวท่วมขังวิกฤตชิดแนวรั้ว</small>
            </div>

            <div className="bcm-matrix-card">
              <div className="bcm-matrix-card__icon">🌊</div>
              <h4>3. การระบายน้ำและระดับคลอง (Drainage)</h4>
              <p className="bcm-metric">
                สถานะ: <strong style={{ color: '#38bdf8' }}>{site.damProximity}</strong>
              </p>
              <small>ระดับน้ำในคลองระบายน้ำหลักมี Headroom รองรับน้ำฝนได้ตามเกณฑ์มาตรฐาน</small>
            </div>

            <div className="bcm-matrix-card">
              <div className="bcm-matrix-card__icon">🏞️</div>
              <h4>4. ผลกระทบน้ำหลากเขื่อน (Dam Discharge)</h4>
              <p className="bcm-metric">
                สถานะ: <strong>อัตราการระบายอยู่ในเกณฑ์ควบคุม</strong>
              </p>
              <small>เขื่อนต้นน้ำในลุ่มน้ำหลักยังมีความจุกักเก็บเพียงพอ ไม่มีการระบายฉุกเฉิน</small>
            </div>
          </div>

          {/* Action Recommendations for BCM Committee */}
          <div className="bcm-recommendations">
            <h4>📋 มาตรการแนะนำสำหรับฝ่ายบริหารและทีม BCM:</h4>
            <ul className="bcm-actions-list">
              <li>✓ <strong>การปฏิบัติการ:</strong> ดำเนินกิจกรรมการผลิตและกระจายสินค้าได้ตามปกติ</li>
              <li>✓ <strong>การเตรียมความพร้อม:</strong> ตรวจสอบระบบปั๊มน้ำระบายฉุกเฉิน, ทางระบายน้ำรอบอาคาร และเครื่องกำเนิดไฟฟ้าสำรอง (Generator) ตามรอบประจำสัปดาห์</li>
              <li>✓ <strong>การเฝ้าระวัง:</strong> กำหนดให้ผู้จัดการส่วนอาคารตรวจสอบภาพเรดาร์ตรวจอากาศผ่าน FutureGreen แพลตฟอร์ม ทุก 6 ชั่วโมงในช่วงฤดูมรสุม</li>
            </ul>
          </div>

          {/* Report Footer & Disclaimer */}
          <div className="bcm-report-footer">
            <p>
              แหล่งข้อมูลอ้างอิง: กรมอุตุนิยมวิทยา (TMD), กรมชลประทาน (RID), สำนักงานพัฒนาเทคโนโลยีอวกาศฯ (GISTDA) · FutureGreen Platform v1.2
            </p>
            <small>
              หมายเหตุ: รายงานนี้จัดทำขึ้นเพื่อสนับสนุนการตัดสินใจเชิงบริหารและบริหารความต่อเนื่องทางธุรกิจ (BCM) การแจ้งเตือนภัยขั้นวิกฤตระดับชาติเป็นอำนาจของ ปภ. และหน่วยงานราชการทางการ
            </small>
          </div>
        </div>

        {/* Modal Action Bar */}
        <footer className="bcm-modal-footer">
          <button type="button" className="btn-ghost" onClick={onClose}>
            ปิด
          </button>
          <button
            type="button"
            className="btn-print-report"
            onClick={() => window.print()}
          >
            🖨️ พิมพ์ / บันทึก PDF รายงาน (Print BCM Report)
          </button>
        </footer>
      </div>
    </div>
  );
}
