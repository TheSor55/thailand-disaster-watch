import { useState } from 'react';

interface SeismoWatchViewProps {
  onBack?: () => void;
}

export function SeismoWatchView({ onBack }: SeismoWatchViewProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const seismoUrl = 'https://thesor55.github.io/seismowatch/';

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="seismo-container-page" aria-label="SeismoWatch Earthquake & Seismic Monitoring">
      {/* Header and Controls */}
      <div className="seismo-toolbar">
        <div className="seismo-toolbar-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onBack && (
              <button type="button" className="btn-ghost" onClick={onBack}>
                ← กลับหน้าหลัก
              </button>
            )}
            <span className="eyebrow">SEISMIC &amp; TSUNAMI WATCH</span>
          </div>
          <h2>🌋 SeismoWatch: แผนที่เฝ้าระวังแผ่นดินไหวและคลื่นสึนามิ</h2>
          <small>
            ระบบติดตามแรงสั่นสะเทือน แผ่นดินไหวในไทยและภูมิภาคอาเซียน (TMD Seismology &amp; USGS Data)
          </small>
        </div>

        <div className="seismo-actions">
          <button
            type="button"
            className="btn-seismo-refresh"
            onClick={handleRefresh}
            title="รีเฟรชข้อมูลแผ่นดินไหวล่าสุด"
          >
            🔄 รีเฟรชแผนที่
          </button>
          <a
            href={seismoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-seismo-external"
            title="เปิดระบบ SeismoWatch ในแท็บใหม่"
          >
            🌐 เปิด SeismoWatch เต็มจอ ↗
          </a>
        </div>
      </div>

      {/* Embedded SeismoWatch Frame */}
      <div className="seismo-frame-wrap">
        <iframe
          key={iframeKey}
          src={seismoUrl}
          title="SeismoWatch Earthquake Monitoring System"
          className="seismo-iframe"
          loading="lazy"
          allow="fullscreen; geolocation"
        />
      </div>

      {/* Footer Attribution */}
      <div className="seismo-footer-note">
        <small>
          ℹ️ ข้อมูลแผ่นดินไหวและการสั่นสะเทือนเชื่อมโยงจาก <strong>SeismoWatch by FutureGreen (@TheSor55)</strong> และกองเฝ้าระวังแผ่นดินไหว กรมอุตุนิยมวิทยา (TMD Seismology)
        </small>
      </div>
    </div>
  );
}
