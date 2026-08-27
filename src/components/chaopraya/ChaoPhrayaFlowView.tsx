/**
 * ChaoPhrayaFlowView — Official Chao Phraya River Basin Flow Diagram (HII / RID)
 *
 * Ultra-Modern Enterprise Decision-Support Command View for Chao Phraya River Basin.
 * Hydro-Informatics Institute (HII) & Royal Irrigation Department (RID)
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
      {/* Top Command Toolbar */}
      <header className="chaopraya-toolbar">
        <div className="chaopraya-toolbar-left">
          {onBack && (
            <button
              type="button"
              className="btn-command-back"
              onClick={onBack}
              aria-label="กลับสู่แผนที่หลัก GIS"
            >
              <span className="btn-back-icon">←</span>
              <span>กลับสู่แผนที่ GIS</span>
            </button>
          )}
          <div className="chaopraya-title-group">
            <div className="chaopraya-badge-row">
              <span className="command-pill-live">🟢 LIVE STREAMFLOW</span>
              <span className="command-pill-source">สสน. (HII) · กรมชลประทาน (RID)</span>
            </div>
            <h2>🌊 ผังน้ำลุ่มน้ำเจ้าพระยา (Chao Phraya River Basin Flow Diagram)</h2>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="chaopraya-actions-strip">
          <a
            href={HII_FLOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pro-action btn-pro-action--primary"
            title="เปิดผังการไหลน้ำเจ้าพระยาต้นฉบับ Real-Time บน tiwrm.hii.or.th"
          >
            <span className="btn-pro-icon">🌊</span>
            <span className="btn-pro-text">เปิดผังน้ำสด (HII.or.th)</span>
            <span className="btn-pro-arrow">↗</span>
          </a>

          <a
            href={THAIWATER_DAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pro-action btn-pro-action--emerald"
            title="ดูรายงานสถานการณ์น้ำในอ่างเก็บน้ำขนาดใหญ่ทั่วประเทศ"
          >
            <span className="btn-pro-icon">🏞️</span>
            <span className="btn-pro-text">รายงานเขื่อนใหญ่ (ThaiWater)</span>
            <span className="btn-pro-arrow">↗</span>
          </a>

          <a
            href={THAIWATER_RIVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pro-action btn-pro-action--cyan"
            title="โทรมาตรตรวจวัดระดับน้ำแม่น้ำสายหลักทั่วประเทศ"
          >
            <span className="btn-pro-icon">💧</span>
            <span className="btn-pro-text">ระดับน้ำแม่น้ำสายหลัก</span>
            <span className="btn-pro-arrow">↗</span>
          </a>
        </div>
      </header>

      {/* Main Hydrodynamic Dashboard Grid */}
      <div className="chaopraya-schematic-grid">
        {/* Left Column: Command & Operations Hub */}
        <div className="chaopraya-info-column">
          {/* Executive Direct Launcher Card */}
          <div className="chaopraya-hero-launcher">
            <div className="hero-top-badge">
              <span className="hero-pulse" />
              <span>HYDROLOGIC TELEMETRY GATEWAY</span>
            </div>
            <h3>ระบบติดตามผังการไหลของน้ำแบบ Real-Time</h3>
            <p>
              สถาบันสารสนเทศทรัพยากรน้ำ (สสน.) ได้วางระบบความปลอดภัยป้องกันการฝัง iframe จากภายนอก
              ท่านสามารถคลิกเปิดดู <strong>ผังการกระจายน้ำ อัตราการไหล (ลบ.ม./วินาที) และการระบายน้ำของทุกเขื่อน</strong> ณ วินาทีปัจจุบันได้โดยตรง:
            </p>
            <div className="hero-buttons">
              <a
                href={HII_FLOW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-launch btn-hero-launch--glow"
              >
                <span className="hero-btn-icon">🌊</span>
                <span className="hero-btn-title">เปิดผังน้ำลุ่มน้ำเจ้าพระยาสดเต็มจอ (HII Portal)</span>
                <span className="hero-btn-tag">RECOMMENDED ↗</span>
              </a>
              <a
                href={THAIWATER_DAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-launch btn-hero-launch--emerald"
              >
                <span className="hero-btn-icon">🏞️</span>
                <span className="hero-btn-title">ตรวจสอบปริมาณน้ำกักเก็บเขื่อนใหญ่ทั่วประเทศ (ThaiWater)</span>
                <span className="hero-btn-tag">LIVE ↗</span>
              </a>
            </div>
          </div>

          {/* Key Hydrological Gateways Breakdown */}
          <div className="chaopraya-gates-card">
            <div className="gates-card-header">
              <span className="icon">📍</span>
              <h4>เกณฑ์ควบคุมและจุดตรวจวัดยุทธศาสตร์ลุ่มน้ำเจ้าพระยา</h4>
            </div>
            <div className="gate-list">
              <div className="gate-item">
                <div className="gate-item-header">
                  <span className="gate-badge gate-badge--blue">1. แหล่งน้ำต้นน้ำ (ภาคเหนือ)</span>
                  <span className="gate-label">ปิง · วัง · ยม · น่าน</span>
                </div>
                <p>รองรับน้ำหลากจากเทือกเขาภาคเหนือและน้ำระบายจากเขื่อนภูมิพล, เขื่อนสิริกิติ์, เขื่อนกิ่วลม, และเขื่อนแควน้อยบำรุงแดน</p>
              </div>

              <div className="gate-item">
                <div className="gate-item-header">
                  <span className="gate-badge gate-badge--amber">2. สถานี C.2 ปากน้ำโพ นครสวรรค์</span>
                  <span className="gate-label">จุดรวมน้ำเหนือ</span>
                </div>
                <p>จุดรวมแม่น้ำปิง วัง ยม น่าน ก่อนเข้าสู่แม่น้ำเจ้าพระยา เกณฑ์วิกฤต: อัตราไหลเกิน 2,000 - 2,500 ลบ.ม./วินาที</p>
              </div>

              <div className="gate-item">
                <div className="gate-item-header">
                  <span className="gate-badge gate-badge--red">3. เขื่อนเจ้าพระยา (สถานี C.13 ชัยนาท)</span>
                  <span className="gate-label">หัวใจควบคุมน้ำ</span>
                </div>
                <p>บริหารตัดยอดน้ำเข้าคลองฝั่งตะวันตก (ท่าจีน/มะขามเฒ่า) และฝั่งตะวันออก (ชัยนาท-ป่าสัก) ควบคุมการปล่อยน้ำลงท้ายเขื่อน</p>
              </div>

              <div className="gate-item">
                <div className="gate-item-header">
                  <span className="gate-badge gate-badge--cyan">4. สถานี C.29A บางไทร พระนครศรีอยุธยา</span>
                  <span className="gate-label">จุดคุมน้ำก่อนเข้า กทม.</span>
                </div>
                <p>จุดตรวจวัดสุดท้ายก่อนมวลน้ำเข้าสู่ปทุมธานี นนทบุรี และกรุงเทพมหานคร เกณฑ์เฝ้าระวังสูงสุด: เกิน 2,500 - 3,000 ลบ.ม./วินาที</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Tech Visual Schematic Blueprint */}
        <div className="chaopraya-visual-column">
          <div className="schematic-card">
            <div className="schematic-header">
              <div className="schematic-title-group">
                <span className="schematic-icon">📐</span>
                <strong className="schematic-title">ผังแบบจำลองเส้นทางน้ำ &amp; ระยะเวลาเดินทาง (Water Travel Time)</strong>
              </div>
              <span className="live-pill">HYDRO-INFORMATICS MODEL</span>
            </div>

            <div className="schematic-svg-wrap">
              <svg viewBox="0 0 520 660" className="schematic-svg" aria-label="ผังโครงสร้างลุ่มน้ำเจ้าพระยา">
                <defs>
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0369a1" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#082f49" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Blueprint Background */}
                <rect width="520" height="660" fill="#070d17" rx="12" stroke="#1e293b" strokeWidth="1.5" />

                {/* Grid Lines for Command Display Aesthetic */}
                <line x1="20" y1="180" x2="500" y2="180" stroke="#1e293b" strokeDasharray="4,4" strokeWidth="1" />
                <line x1="20" y1="330" x2="500" y2="330" stroke="#1e293b" strokeDasharray="4,4" strokeWidth="1" />
                <line x1="20" y1="510" x2="500" y2="510" stroke="#1e293b" strokeDasharray="4,4" strokeWidth="1" />

                {/* Northern Tributaries: Ping, Wang, Yom, Nan */}
                {/* Ping */}
                <path d="M 70,30 L 70,140 L 170,180" stroke="url(#riverGrad)" strokeWidth="8" strokeLinecap="round" fill="none" filter="url(#glow)" />
                <rect x="35" y="20" width="70" height="26" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                <text x="70" y="37" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">แม่น้ำปิง</text>
                <rect x="35" y="70" width="70" height="20" rx="4" fill="#0369a1" />
                <text x="70" y="84" fill="#e0f2fe" fontSize="8" fontWeight="600" textAnchor="middle">เขื่อนภูมิพล</text>

                {/* Wang */}
                <path d="M 160,30 L 160,110 L 100,140" stroke="url(#riverGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                <rect x="130" y="20" width="60" height="26" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                <text x="160" y="37" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">แม่น้ำวัง</text>
                <rect x="130" y="70" width="60" height="20" rx="4" fill="#0369a1" />
                <text x="160" y="84" fill="#e0f2fe" fontSize="8" fontWeight="600" textAnchor="middle">เขื่อนกิ่วลม</text>

                {/* Yom */}
                <path d="M 310,30 L 310,140 L 250,180" stroke="url(#riverGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                <rect x="280" y="20" width="60" height="26" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                <text x="310" y="37" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">แม่น้ำยม</text>
                <rect x="280" y="70" width="60" height="20" rx="4" fill="#0369a1" />
                <text x="310" y="84" fill="#e0f2fe" fontSize="8" fontWeight="600" textAnchor="middle">บางระกำ</text>

                {/* Nan */}
                <path d="M 430,30 L 430,140 L 290,180" stroke="url(#riverGrad)" strokeWidth="8" strokeLinecap="round" fill="none" filter="url(#glow)" />
                <rect x="395" y="20" width="70" height="26" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                <text x="430" y="37" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">แม่น้ำน่าน</text>
                <rect x="395" y="70" width="70" height="20" rx="4" fill="#0369a1" />
                <text x="430" y="84" fill="#e0f2fe" fontSize="8" fontWeight="600" textAnchor="middle">เขื่อนสิริกิติ์</text>

                {/* Pak Nam Pho C.2 Junction */}
                <circle cx="220" cy="188" r="18" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" filter="url(#glow)" />
                <text x="220" y="193" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">C.2</text>
                <rect x="135" y="215" width="170" height="26" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                <text x="220" y="232" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">ปากน้ำโพ (นครสวรรค์)</text>

                {/* Upper Chao Phraya Stem */}
                <line x1="220" y1="206" x2="220" y2="330" stroke="#38bdf8" strokeWidth="14" filter="url(#glow)" />
                
                {/* Timeline Tag 1 */}
                <rect x="250" y="260" width="95" height="22" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                <text x="297" y="275" fill="#fef3c7" fontSize="9" fontWeight="bold" textAnchor="middle">⏱️ ใช้เวลา 1 วัน</text>

                {/* Chao Phraya Dam C.13 */}
                <rect x="120" y="330" width="200" height="38" rx="8" fill="#991b1b" stroke="#f87171" strokeWidth="2" filter="url(#glow)" />
                <text x="220" y="350" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">เขื่อนเจ้าพระยา (C.13 ชัยนาท)</text>
                <text x="220" y="362" fill="#fee2e2" fontSize="8" textAnchor="middle">ประตูระบายน้ำยุทธศาสตร์ภาคกลาง</text>

                {/* Western Diversion (Tha Chin River) */}
                <path d="M 120,349 L 60,365 L 60,580" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" fill="none" />
                <rect x="20" y="440" width="80" height="22" rx="4" fill="#0f172a" stroke="#0284c7" />
                <text x="60" y="455" fill="#7dd3fc" fontSize="8" fontWeight="bold" textAnchor="middle">แม่น้ำท่าจีน</text>

                {/* Eastern Diversion (Chainat-Pasak Canal) */}
                <path d="M 320,349 L 385,365 L 385,450" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" fill="none" />
                <rect x="345" y="390" width="80" height="20" rx="4" fill="#0f172a" stroke="#0284c7" />
                <text x="385" y="404" fill="#7dd3fc" fontSize="8" fontWeight="bold" textAnchor="middle">ชัยนาท-ป่าสัก</text>

                {/* Pasak River & Pasak Jolasid Dam */}
                <path d="M 465,340 L 465,450 L 330,475" stroke="#059669" strokeWidth="6" strokeLinecap="round" fill="none" />
                <rect x="420" y="330" width="90" height="24" rx="5" fill="#065f46" stroke="#34d399" strokeWidth="1.2" />
                <text x="465" y="346" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">เขื่อนป่าสักชลสิทธิ์</text>
                <text x="465" y="400" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">แม่น้ำป่าสัก</text>

                {/* Lower Chao Phraya Stem */}
                <line x1="220" y1="368" x2="220" y2="505" stroke="#38bdf8" strokeWidth="14" filter="url(#glow)" />

                {/* Timeline Tag 2 */}
                <rect x="250" y="420" width="105" height="22" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                <text x="302" y="435" fill="#fef3c7" fontSize="9" fontWeight="bold" textAnchor="middle">⏱️ ใช้เวลา 1.5 วัน</text>

                {/* Bang Sai C.29A Junction */}
                <circle cx="220" cy="505" r="18" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" filter="url(#glow)" />
                <text x="220" y="510" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">C.29A</text>
                <rect x="130" y="530" width="180" height="26" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                <text x="220" y="547" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">สถานีบางไทร (อยุธยา)</text>

                {/* Final River Reach to BKK */}
                <line x1="220" y1="523" x2="220" y2="595" stroke="#38bdf8" strokeWidth="16" filter="url(#glow)" />

                {/* Timeline Tag 3 */}
                <rect x="250" y="565" width="95" height="22" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                <text x="297" y="580" fill="#fef3c7" fontSize="9" fontWeight="bold" textAnchor="middle">⏱️ ใช้เวลา 1 วัน</text>

                {/* Bangkok & Gulf */}
                <rect x="95" y="605" width="250" height="34" rx="8" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="220" y="626" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">กรุงเทพมหานครและปริมณฑล ➔ อ่าวไทย</text>
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
