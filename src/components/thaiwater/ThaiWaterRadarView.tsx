import { useState } from 'react';

export type ThaiWaterMapMode =
  | 'overall'      // เรดาร์ฝน + เส้นทางพายุ
  | 'rainfall'     // ปริมาณน้ำฝนสะสม
  | 'waterlevel'   // ระดับน้ำแม่น้ำ
  | 'dam'          // อ่างเก็บน้ำขนาดใหญ่
  | 'satellite';   // ภาพถ่ายดาวเทียม

interface ThaiWaterRadarViewProps {
  onBack?: () => void;
}

export function ThaiWaterRadarView({ onBack }: ThaiWaterRadarViewProps) {
  const [mapMode, setMapMode] = useState<ThaiWaterMapMode>('overall');
  const [key, setKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ThaiWater TWA map URLs based on active mode
  const getMapUrl = (mode: ThaiWaterMapMode): string => {
    switch (mode) {
      case 'rainfall':
        return 'https://twa.thaiwater.net/th/map/basic/overall/overall/0?ds=rf24%2Csc&p=hide';
      case 'waterlevel':
        return 'https://twa.thaiwater.net/th/map/basic/overall/overall/0?ds=wl%2Csc&p=hide';
      case 'dam':
        return 'https://twa.thaiwater.net/th/map/basic/overall/overall/0?ds=dm%2Csc&p=hide';
      case 'satellite':
        return 'https://twa.thaiwater.net/th/map/basic/overall/overall/0?ds=sat%2Csc&p=hide';
      case 'overall':
      default:
        return 'https://twa.thaiwater.net/th/map/basic/overall/overall/0?ds=rr%2Csc&p=hide';
    }
  };

  const currentUrl = getMapUrl(mapMode);

  const handleRefresh = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
  };

  const handleToggleFullscreen = () => {
    const el = document.getElementById('thaiwater-iframe-container');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="thaiwater-container-page" aria-label="ThaiWater TWA Realtime Radar & Storm Viewer">
      {/* Top Command Toolbar */}
      <div className="thaiwater-toolbar">
        <div className="thaiwater-toolbar-left">
          {onBack && (
            <button
              type="button"
              className="btn-command-back"
              onClick={onBack}
              aria-label="กลับสู่แผนที่ GIS"
            >
              <span className="btn-back-icon">←</span>
              <span>กลับสู่แผนที่ GIS</span>
            </button>
          )}
          <div className="thaiwater-title-block">
            <div className="thaiwater-badge-strip">
              <span className="eyebrow">HYDRO-INFORMATICS INSTITUTE (สสน.)</span>
              <span className="live-status-indicator">
                <span className="live-dot" />
                <span className="live-text">REALTIME RADAR &amp; STORM GIS</span>
              </span>
            </div>
            <h2>🌧️ แผนที่เรดาร์ตรวจวัดกลุ่มฝนและเส้นทางพายุ (ThaiWater TWA Studio)</h2>
          </div>
        </div>

        <div className="thaiwater-toolbar-actions">
          <button
            type="button"
            className="btn-pro-action btn-pro-action--ghost"
            onClick={handleRefresh}
            title="โหลดข้อมูลแผนที่ใหม่"
          >
            ⟳ รีเฟรช
          </button>
          <button
            type="button"
            className="btn-pro-action btn-pro-action--ghost"
            onClick={handleToggleFullscreen}
            title="ขยายแผนที่เต็มจอ"
          >
            ⛶ เต็มจอ
          </button>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pro-action btn-pro-action--primary"
            style={{ textDecoration: 'none' }}
            title="เปิดในแท็บเบราว์เซอร์ใหม่"
          >
            ↗ เปิดเว็บต้นทาง สสน.
          </a>
        </div>
      </div>

      {/* Layer Selection Chips */}
      <div className="thaiwater-layer-selector">
        <button
          type="button"
          className={`thaiwater-chip ${mapMode === 'overall' ? 'is-active' : ''}`}
          onClick={() => { setMapMode('overall'); setIsLoading(true); }}
        >
          🌧️ เรดาร์กลุ่มฝน &amp; เส้นทางพายุ (Live Radar &amp; Storm)
        </button>
        <button
          type="button"
          className={`thaiwater-chip ${mapMode === 'rainfall' ? 'is-active' : ''}`}
          onClick={() => { setMapMode('rainfall'); setIsLoading(true); }}
        >
          📊 ปริมาณน้ำฝนสะสม (24h Rainfall)
        </button>
        <button
          type="button"
          className={`thaiwater-chip ${mapMode === 'waterlevel' ? 'is-active' : ''}`}
          onClick={() => { setMapMode('waterlevel'); setIsLoading(true); }}
        >
          🌊 ระดับน้ำสถานีโทรมาตร (River Levels)
        </button>
        <button
          type="button"
          className={`thaiwater-chip ${mapMode === 'dam' ? 'is-active' : ''}`}
          onClick={() => { setMapMode('dam'); setIsLoading(true); }}
        >
          🏞️ ความจุกักเก็บอ่าง/เขื่อนใหญ่ (Dams)
        </button>
        <button
          type="button"
          className={`thaiwater-chip ${mapMode === 'satellite' ? 'is-active' : ''}`}
          onClick={() => { setMapMode('satellite'); setIsLoading(true); }}
        >
          🛰️ ภาพถ่ายดาวเทียมกลุ่มเมฆ (Satellite)
        </button>
      </div>

      {/* Iframe Viewport Container */}
      <div className="thaiwater-viewport" id="thaiwater-iframe-container">
        {isLoading && (
          <div className="thaiwater-loading-overlay">
            <div className="thaiwater-spinner" />
            <p>กำลังเชื่อมต่อคลังข้อมูลน้ำแห่งชาติ สสน. (ThaiWater TWA)...</p>
          </div>
        )}
        <iframe
          key={key}
          src={currentUrl}
          title="ThaiWater TWA Realtime Radar GIS Map"
          className="thaiwater-iframe"
          allow="geolocation; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Bottom Data Attribution Footer */}
      <footer className="thaiwater-footer">
        <p>
          📡 แหล่งข้อมูล: <strong>สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน) - สสน. (HII) · คลังข้อมูลน้ำแห่งชาติ (ThaiWater.net)</strong>
        </p>
        <small>
          รองรับการซูมสำรวจกลุ่มฝน, กราฟระดับน้ำแม่น้ำ, และการเคลื่อนที่ของพายุแบบ Real-Time 24 ชั่วโมง
        </small>
      </footer>
    </div>
  );
}
