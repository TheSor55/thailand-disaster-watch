/**
 * ChaoPhrayaFlowView — Official Chao Phraya River Basin Flow Diagram (HII / RID)
 *
 * Provides real-time hydrological flow monitoring from Ping, Wang, Yom, Nan
 * down to Chao Phraya Dam, Bang Sai (Ayutthaya), Bangkok, and the Gulf of Thailand.
 *
 * Source: Hydro-Informatics Institute (HII) & Royal Irrigation Department (RID)
 */

interface ChaoPhrayaFlowViewProps {
  onBack?: () => void;
}

const HII_FLOW_URL = 'https://tiwrm.hii.or.th/DATA/REPORT/php/chart/chaopraya/small/chaopraya.php';
const THAIWATER_DAM_URL = 'https://www.thaiwater.net/water/dam';
const THAIWATER_RIVER_URL = 'https://www.thaiwater.net/water/river';

export function ChaoPhrayaFlowView({ onBack }: ChaoPhrayaFlowViewProps) {
  return (
    <div className="chaopraya-container-page" aria-label="ผังน้ำลุ่มน้ำเจ้าพระยา HII">
      {/* Top Toolbar */}
      <div className="chaopraya-toolbar">
        <div className="chaopraya-toolbar-info">
          {onBack && (
            <button type="button" className="btn-ghost" onClick={onBack} aria-label="กลับไปหน้าแผนที่ GIS">
              ← กลับไปหน้าแผนที่ GIS
            </button>
          )}
          <div>
            <h2>🌊 ผังน้ำลุ่มน้ำเจ้าพระยา (Chao Phraya River Basin Live Flow Diagram)</h2>
            <small>
              สถาบันสารสนเทศทรัพยากรน้ำ (สสน. / HII) · กรมชลประทาน (RID) · ระบบติดตามอัตราการไหลและปริมาณน้ำสด
            </small>
          </div>
        </div>

        <div className="chaopraya-actions">
          <a
            href={HII_FLOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-chaopraya-external"
            title="เปิดผังน้ำต้นฉบับสดจาก HII"
          >
            🌊 เปิดผังน้ำสดต้นฉบับบน HII.or.th ↗
          </a>
          <a
            href={THAIWATER_DAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-chaopraya-external btn-chaopraya-dam"
            title="ดูรายงานน้ำในเขื่อนใหญ่ทั่วประเทศ"
          >
            🏞️ รายงานเขื่อนใหญ่ทั่วประเทศ (ThaiWater) ↗
          </a>
          <a
            href={THAIWATER_RIVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-chaopraya-external"
            style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', borderColor: '#38bdf8' }}
            title="โทรมาตรระดับน้ำแม่น้ำสายหลักทั่วประเทศ"
          >
            💧 ระดับน้ำแม่น้ำทั่วประเทศ ↗
          </a>
        </div>
      </div>

      {/* Main Interactive Schematic Flow View */}
      <div className="chaopraya-schematic-grid">
        {/* Left Column: Direct Launcher & Telemetry Gates */}
        <div className="chaopraya-info-column">
          <div className="chaopraya-hero-launcher">
            <div className="hero-icon">🌊</div>
            <h3>ผังการไหลของน้ำลุ่มน้ำเจ้าพระยาแบบ Real-Time</h3>
            <p>
              เนื่องจากเซิร์ฟเวอร์ระบบคลังข้อมูลน้ำแห่งชาติ (HII) ป้องกันความปลอดภัยไม่ให้ฝังภายนอก (Cross-Origin Protection)
              ท่านสามารถคลิกเปิดดู <strong>ผังการไหลของน้ำแบบสด ณ ชั่วโมงปัจจุบัน</strong> จาก สสน./กรมชลประทาน ได้ทันที:
            </p>
            <div className="hero-buttons">
              <a
                href={HII_FLOW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-launch"
              >
                <span>🌊 เปิดดูผังน้ำเจ้าพระยา HII สดเต็มจอ ↗</span>
              </a>
              <a
                href={THAIWATER_DAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-launch btn-hero-secondary"
              >
                <span>🏞️ ตรวจสอบปริมาณน้ำเขื่อนใหญ่ทั่วประเทศ (ThaiWater) ↗</span>
              </a>
            </div>
          </div>

          {/* Key Hydrological Gateways Breakdown */}
          <div className="chaopraya-gates-card">
            <h4>📍 จุดควบคุมและตรวจวัดหลักในลุ่มน้ำเจ้าพระยา</h4>
            <div className="gate-list">
              <div className="gate-item">
                <span className="gate-badge">1. ต้นน้ำ 4 สาย</span>
                <strong>ปิง · วัง · ยม · น่าน</strong>
                <small>รับน้ำจากภาคเหนือและเขื่อนภูมิพล / เขื่อนสิริกิติ์ / เขื่อนกิ่วลม / เขื่อนแควน้อย</small>
              </div>
              <div className="gate-item">
                <span className="gate-badge">2. สถานี C.2 นครสวรรค์</span>
                <strong>ปากน้ำโพ (รวม ปิง-วัง-ยม-น่าน)</strong>
                <small>เกณฑ์เฝ้าระวัง: อัตราไหลเกิน 2,000 - 2,500 ลบ.ม./วินาที เริ่มมีความเสี่ยงน้ำล้นตลิ่ง</small>
              </div>
              <div className="gate-item">
                <span className="gate-badge">3. สถานี C.13 ชัยนาท</span>
                <strong>เขื่อนเจ้าพระยา</strong>
                <small>เกณฑ์ระบายท้ายเขื่อน: 700 / 1,500 / 2,000 / 2,500+ ลบ.ม./วินาที (ผันน้ำออกฝั่งตะวันตก-ตะวันออก)</small>
              </div>
              <div className="gate-item">
                <span className="gate-badge">4. สถานี C.29A พระนครศรีอยุธยา</span>
                <strong>สถานีบางไทร (จุดคุมน้ำก่อนเข้า กทม.)</strong>
                <small>เกณฑ์เฝ้าระวังสูงสุด: เกิน 2,500 - 3,000 ลบ.ม./วินาที มีผลกระทบต่อพื้นที่ลุ่มต่ำริมแม่น้ำเจ้าพระยา</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Schematic Vector Architecture */}
        <div className="chaopraya-visual-column">
          <div className="schematic-card">
            <div className="schematic-header">
              <span>📐 ผังการเดินทางของมวลน้ำ (Water Travel Time)</span>
              <span className="live-pill">HYDRO-INFORMATICS MODEL</span>
            </div>

            <div className="schematic-svg-wrap">
              <svg viewBox="0 0 500 620" className="schematic-svg" aria-label="ผังโครงสร้างลุ่มน้ำเจ้าพระยา">
                {/* Background Grid */}
                <rect width="500" height="620" fill="#08101d" rx="10" />

                {/* Northern Rivers: Ping, Wang, Yom, Nan */}
                {/* Ping */}
                <path d="M 60,30 L 60,140 L 130,170" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" fill="none" />
                <rect x="30" y="20" width="60" height="24" rx="4" fill="#0369a1" />
                <text x="60" y="36" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">แม่น้ำปิง</text>
                <text x="60" y="80" fill="#7dd3fc" fontSize="8" textAnchor="middle">เขื่อนภูมิพล</text>

                {/* Wang */}
                <path d="M 140,30 L 140,110 L 80,140" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" fill="none" />
                <rect x="115" y="20" width="50" height="24" rx="4" fill="#0369a1" />
                <text x="140" y="36" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">แม่น้ำวัง</text>
                <text x="140" y="80" fill="#7dd3fc" fontSize="8" textAnchor="middle">เขื่อนกิ่วลม</text>

                {/* Yom */}
                <path d="M 270,30 L 270,140 L 230,170" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" fill="none" />
                <rect x="245" y="20" width="50" height="24" rx="4" fill="#0369a1" />
                <text x="270" y="36" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">แม่น้ำยม</text>
                <text x="270" y="80" fill="#7dd3fc" fontSize="8" textAnchor="middle">บางระกำ</text>

                {/* Nan */}
                <path d="M 400,30 L 400,140 L 270,170" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" fill="none" />
                <rect x="375" y="20" width="50" height="24" rx="4" fill="#0369a1" />
                <text x="400" y="36" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">แม่น้ำน่าน</text>
                <text x="400" y="80" fill="#7dd3fc" fontSize="8" textAnchor="middle">เขื่อนสิริกิติ์</text>

                {/* Pak Nam Pho Junction */}
                <circle cx="200" cy="180" r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <text x="200" y="184" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">C.2</text>
                <rect x="130" y="205" width="140" height="26" rx="5" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" />
                <text x="200" y="222" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">ปากน้ำโพ (นครสวรรค์)</text>

                {/* Chao Phraya Main Stem */}
                <line x1="200" y1="196" x2="200" y2="300" stroke="#38bdf8" strokeWidth="12" />
                <text x="230" y="260" fill="#f59e0b" fontSize="8" fontWeight="bold">ระยะเวลา 1 วัน ➔</text>

                {/* Chao Phraya Dam */}
                <rect x="120" y="300" width="160" height="34" rx="6" fill="#b91c1c" stroke="#ef4444" strokeWidth="1.5" />
                <text x="200" y="318" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">เขื่อนเจ้าพระยา (C.13 ชัยนาท)</text>
                <text x="200" y="329" fill="#fecaca" fontSize="7" textAnchor="middle">ประตูระบายน้ำหลักลุ่มน้ำเจ้าพระยา</text>

                {/* Western diversion (Tha Chin, Makham Thao, Noi) */}
                <path d="M 120,317 L 60,330 L 60,540" stroke="#0369a1" strokeWidth="6" strokeLinecap="round" fill="none" />
                <text x="50" y="440" fill="#7dd3fc" fontSize="8" transform="rotate(-90 50,440)">แม่น้ำท่าจีน / คลองฝั่งตะวันตก</text>

                {/* Eastern diversion (Chainat-Pasak) */}
                <path d="M 280,317 L 350,330 L 350,420" stroke="#0369a1" strokeWidth="6" strokeLinecap="round" fill="none" />
                <text x="365" y="375" fill="#7dd3fc" fontSize="8">คลองชัยนาท-ป่าสัก</text>

                {/* Pasak River & Dam */}
                <path d="M 440,320 L 440,430 L 320,450" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" fill="none" />
                <rect x="400" y="310" width="80" height="22" rx="4" fill="#047857" />
                <text x="440" y="324" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">เขื่อนป่าสักชลสิทธิ์</text>
                <text x="440" y="375" fill="#34d399" fontSize="8" textAnchor="middle">แม่น้ำป่าสัก</text>

                {/* Lower Chao Phraya */}
                <line x1="200" y1="334" x2="200" y2="470" stroke="#38bdf8" strokeWidth="12" />
                <text x="230" y="400" fill="#f59e0b" fontSize="8" fontWeight="bold">ระยะเวลา 1.5 วัน ➔</text>

                {/* Bang Sai Ayutthaya C.29A */}
                <circle cx="200" cy="470" r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <text x="200" y="474" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">C.29A</text>
                <rect x="120" y="495" width="160" height="26" rx="5" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" />
                <text x="200" y="512" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">สถานีบางไทร (อยุธยา)</text>

                {/* Bangkok & Gulf of Thailand */}
                <line x1="200" y1="486" x2="200" y2="560" stroke="#38bdf8" strokeWidth="14" />
                <text x="230" y="540" fill="#f59e0b" fontSize="8" fontWeight="bold">ระยะเวลา 1 วัน ➔</text>
                <rect x="100" y="560" width="200" height="30" rx="6" fill="#1e3a8a" stroke="#60a5fa" />
                <text x="200" y="580" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">กรุงเทพมหานครและปริมณฑล ➔ อ่าวไทย</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <footer className="chaopraya-footer-note">
        <span>
          แหล่งข้อมูลทางการ: คลังข้อมูลน้ำแห่งชาติ สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน) ร่วมกับ กรมชลประทาน
        </span>
      </footer>
    </div>
  );
}
