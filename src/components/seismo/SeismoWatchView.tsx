/**
 * SeismoWatchView — Real-Time Seismic & Tsunami Intelligence Command View
 *
 * Integrated Earthquake & Tsunami monitoring subsystem powered by SeismoWatch (by FutureGreen)
 * Sources: TMD Seismology, USGS Global Network, EMSC WebSockets
 */

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
      {/* Top Command Toolbar */}
      <header className="seismo-toolbar">
        <div className="seismo-toolbar-left">
          {onBack && (
            <button
              type="button"
              className="btn-command-back btn-command-back--seismo"
              onClick={onBack}
              aria-label="← กลับหน้าหลัก GIS"
            >
              <span className="btn-back-icon">←</span>
              <span>กลับหน้าหลัก GIS</span>
            </button>
          )}
          <div className="seismo-title-group">
            <div className="seismo-badge-row">
              <span className="command-pill-seismo">
                <span className="seismo-live-dot" />
                <span>SEISMIC &amp; TSUNAMI WATCH</span>
              </span>
              <span className="command-pill-source">
                TMD Seismology (กรมอุตุฯ) · USGS · EMSC WebSocket
              </span>
            </div>
            <h2>🌋 SeismoWatch: แผนที่เฝ้าระวังแผ่นดินไหวและคลื่นสึนามิ</h2>
          </div>
        </div>

        <div className="seismo-actions-strip">
          <button
            type="button"
            className="btn-seismo-action btn-seismo-action--refresh"
            onClick={handleRefresh}
            title="รีเฟรชข้อมูลเซนเซอร์แผ่นดินไหวล่าสุด"
          >
            <span className="btn-action-icon">🔄</span>
            <span>รีเฟรชแผนที่สด</span>
          </button>
          <a
            href={seismoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-seismo-action btn-seismo-action--launch"
            title="เปิดระบบ SeismoWatch แบบเต็มจอในแท็บใหม่"
          >
            <span className="btn-action-icon">🌐</span>
            <span className="btn-action-text">เปิด SeismoWatch เต็มจอ</span>
            <span className="btn-action-arrow">↗</span>
          </a>
        </div>
      </header>

      {/* Full-Bleed Mission-Control Frame */}
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
      <footer className="seismo-footer-note">
        <span>
          ℹ️ ข้อมูลแผ่นดินไหวและแรงสั่นสะเทือนเชื่อมโยงแบบ Real-time จาก <strong>SeismoWatch by FutureGreen (คุณสรวิศ สุวรรณรงค์)</strong> ร่วมกับ กองเฝ้าระวังแผ่นดินไหว กรมอุตุนิยมวิทยา (TMD)
        </span>
      </footer>
    </div>
  );
}
