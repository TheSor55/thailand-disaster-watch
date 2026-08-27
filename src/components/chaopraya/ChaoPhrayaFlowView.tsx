/**
 * ChaoPhrayaFlowView — Official Chao Phraya River Basin Flow Diagram (HII / RID)
 *
 * Provides real-time hydrological flow monitoring from Ping, Wang, Yom, Nan
 * down to Chao Phraya Dam, Bang Sai (Ayutthaya), Bangkok, and the Gulf of Thailand.
 *
 * Source: Hydro-Informatics Institute (HII) & Royal Irrigation Department (RID)
 */

import { useState } from 'react';

interface ChaoPhrayaFlowViewProps {
  onBack?: () => void;
}

const HII_FLOW_URL = 'https://tiwrm.hii.or.th/DATA/REPORT/php/chart/chaopraya/small/chaopraya.php';
const HII_DAM_REPORT_URL = 'https://tiwrm.hii.or.th/DATA/REPORT/php/rid_bigdam.php';

export function ChaoPhrayaFlowView({ onBack }: ChaoPhrayaFlowViewProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

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
              สถาบันสารสนเทศทรัพยากรน้ำ (สสน. / HII) · กรมชลประทาน (RID) · ข้อมูลอัตราการไหลและปริมาณน้ำสด
            </small>
          </div>
        </div>

        <div className="chaopraya-actions">
          <button
            type="button"
            className="btn-chaopraya-refresh"
            onClick={handleRefresh}
            title="รีเฟรชผังน้ำสด"
          >
            🔄 รีเฟรชผังน้ำ
          </button>
          <a
            href={HII_FLOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-chaopraya-external"
            title="เปิดผังน้ำต้นฉบับเต็มจอจาก HII"
          >
            ↗ เปิดผังน้ำต้นฉบับบน HII.or.th
          </a>
          <a
            href={HII_DAM_REPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-chaopraya-external btn-chaopraya-dam"
            title="ดูรายงานน้ำในเขื่อนใหญ่ทั่วประเทศ"
          >
            🏞️ รายงานเขื่อนใหญ่ทั่วประเทศ (RID) ↗
          </a>
        </div>
      </div>

      {/* Interactive Helper Card */}
      <div className="chaopraya-guide-card">
        <div className="guide-item">
          <strong>💧 ต้นน้ำ (ปิง, วัง, ยม, น่าน):</strong>
          <span>ติดตามปริมาณน้ำเหนือและอัตราการระบายจากเขื่อนภูมิพลและเขื่อนสิริกิติ์</span>
        </div>
        <div className="guide-item">
          <strong>🏞️ จุดรวมน้ำ (ปากน้ำโพ นครสวรรค์ C.2):</strong>
          <span>จุดเฝ้าระวังอัตราน้ำหลากก่อนไหลลงสู่เขื่อนเจ้าพระยา</span>
        </div>
        <div className="guide-item">
          <strong>🛡️ เขื่อนเจ้าพระยา (C.13 ชัยนาท):</strong>
          <span>เกณฑ์ควบคุมการระบายน้ำลงสู่ท้ายเขื่อน (สิงห์บุรี, อ่างทอง, อยุธยา, ปทุมธานี, นนทบุรี, กทม.)</span>
        </div>
        <div className="guide-item">
          <strong>🌊 จุดวัดบางไทร (อยุธยา C.29A):</strong>
          <span>เกณฑ์ชี้วัดปริมาณน้ำไหลผ่านเข้าสู่พื้นที่กรุงเทพมหานครและปริมณฑล</span>
        </div>
      </div>

      {/* Frame Wrap */}
      <div className="chaopraya-frame-wrap">
        {isLoading && (
          <div className="chaopraya-loading" role="status">
            <span>กำลังโหลดผังน้ำเรียลไทม์จากสถาบันสารสนเทศทรัพยากรน้ำ (HII)…</span>
          </div>
        )}
        <iframe
          key={iframeKey}
          src={HII_FLOW_URL}
          title="ผังน้ำลุ่มน้ำเจ้าพระยา HII"
          className="chaopraya-iframe"
          onLoad={() => setIsLoading(false)}
          allow="cross-origin-isolated"
        />
      </div>

      <footer className="chaopraya-footer-note">
        <span>
          แหล่งข้อมูลทางการ: คลังข้อมูลน้ำแห่งชาติ สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน) ร่วมกับ กรมชลประทาน
        </span>
      </footer>
    </div>
  );
}
