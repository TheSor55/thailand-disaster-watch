import { useState } from 'react';

export type WindyLayer =
  | 'wind'
  | 'rain'
  | 'clouds'
  | 'hurricanes'
  | 'cams'
  | 'temp'
  | 'pressure'
  | 'waves';

interface WindyViewProps {
  lat?: number;
  lon?: number;
  zoom?: number;
  locationName?: string;
}

export function WindyView({
  lat = 13.7563,
  lon = 100.5018,
  zoom = 7,
  locationName = 'กรุงเทพมหานคร และประเทศไทย',
}: WindyViewProps) {
  const [activeLayer, setActiveLayer] = useState<WindyLayer>('wind');

  // Windy embed overlay query string
  const embedOverlay = activeLayer === 'cams' ? 'wind' : activeLayer;
  const embedUrl = `https://embed.windy.com/embed2.html?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}&detailLat=${lat.toFixed(4)}&detailLon=${lon.toFixed(4)}&width=100%25&height=100%25&zoom=${zoom}&level=surface&overlay=${embedOverlay}&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;

  // Dynamic direct link with target mode/layer
  const directLinkUrl =
    activeLayer === 'hurricanes'
      ? 'https://www.windy.com/th/-%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B9%80%E0%B8%AE%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A3%E0%B8%B4%E0%B9%80%E0%B8%84%E0%B8%99/hurricanes'
      : activeLayer === 'cams'
      ? `https://www.windy.com/?cams,${lat.toFixed(4)},${lon.toFixed(4)},8`
      : `https://www.windy.com/?${activeLayer},${lat.toFixed(4)},${lon.toFixed(4)},${zoom}`;

  return (
    <div className="windy-container-page" aria-label="Windy.com Meteorological Viewer">
      {/* Header and Controls */}
      <div className="windy-toolbar">
        <div className="windy-toolbar-info">
          <span className="eyebrow">WINDY.COM METEOROLOGICAL &amp; DISASTER TRACKER</span>
          <h2>🌀 การจำลองกระแสลม พายุ และกล้องเว็บแคม ({locationName})</h2>
          <small>พิกัด: {lat.toFixed(4)}, {lon.toFixed(4)} · โมเดล ECMWF / GFS Global</small>
        </div>

        <div className="windy-layer-buttons">
          <button
            type="button"
            className={`btn-windy-layer ${activeLayer === 'wind' ? 'is-active' : ''}`}
            onClick={() => setActiveLayer('wind')}
          >
            💨 กระแสลม (Wind)
          </button>
          <button
            type="button"
            className={`btn-windy-layer ${activeLayer === 'rain' ? 'is-active' : ''}`}
            onClick={() => setActiveLayer('rain')}
          >
            🌧️ เรดาร์ &amp; ฝน (Rain)
          </button>
          <button
            type="button"
            className={`btn-windy-layer ${activeLayer === 'clouds' ? 'is-active' : ''}`}
            onClick={() => setActiveLayer('clouds')}
          >
            ☁️ เมฆ &amp; ดาวเทียม (Clouds)
          </button>
          <button
            type="button"
            className={`btn-windy-layer ${activeLayer === 'hurricanes' ? 'is-active' : ''}`}
            onClick={() => setActiveLayer('hurricanes')}
            style={activeLayer === 'hurricanes' ? { borderColor: '#ef4444', color: '#f87171' } : {}}
          >
            🌪️ ติดตามพายุ (Storm Tracker)
          </button>
          <button
            type="button"
            className={`btn-windy-layer ${activeLayer === 'cams' ? 'is-active' : ''}`}
            onClick={() => setActiveLayer('cams')}
            style={activeLayer === 'cams' ? { borderColor: '#facc15', color: '#fde047' } : {}}
          >
            📹 กล้องเว็บแคม (Live Cams)
          </button>
          <button
            type="button"
            className={`btn-windy-layer ${activeLayer === 'pressure' ? 'is-active' : ''}`}
            onClick={() => setActiveLayer('pressure')}
          >
            🌀 ความกดอากาศ (Pressure)
          </button>
          <button
            type="button"
            className={`btn-windy-layer ${activeLayer === 'temp' ? 'is-active' : ''}`}
            onClick={() => setActiveLayer('temp')}
          >
            🌡️ อุณหภูมิ (Temp)
          </button>
          <a
            href={directLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-windy-external"
            title={`เปิดพิกัดนี้บนเว็บไซต์ Windy.com ในโหมด ${activeLayer}`}
          >
            🌐 เปิดใน Windy.com ({activeLayer.toUpperCase()}) ↗
          </a>
        </div>
      </div>

      {/* Helper Banner when in Live Cams mode */}
      {activeLayer === 'cams' && (
        <div style={{ background: 'rgba(234, 179, 8, 0.15)', border: '1px solid #eab308', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <strong style={{ color: '#fde047' }}>📹 กล้องเว็บแคมสด (Webcams กว่า 100+ จุดทั่วไทย):</strong>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#e2e8f0' }}>
              เนื่องจากวิดเจ็ตฝัง (Embed Iframe) ไม่รองรับการแสดงหมุดภาพกล้องสด สามารถคลิกปุ่มสีเหลืองเพื่อเปิดดูหมุดกล้องและ Time-lapse ความละเอียดสูงบน Windy.com ได้ทันที
            </p>
          </div>
          <a
            href={`https://www.windy.com/?cams,${lat.toFixed(4)},${lon.toFixed(4)},8`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: '8px 16px', background: '#eab308', color: '#000', fontWeight: 'bold', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            📹 เปิดดูหมุดกล้อง Webcams บน Windy.com ↗
          </a>
        </div>
      )}

      {/* Helper Banner when in Storm Tracker mode */}
      {activeLayer === 'hurricanes' && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <strong style={{ color: '#fca5a5' }}>🌪️ ระบบติดตามพายุ (Tropical Cyclone &amp; Storm Tracker):</strong>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#e2e8f0' }}>
              ดูรายชื่อพายุทุกลูกในทะเลจีนใต้และแปซิฟิก พร้อมศูนย์กลางตาพายุ และวิถีการเคลื่อนตัวล่วงหน้า 5 วัน (ฟรี)
            </p>
          </div>
          <a
            href="https://www.windy.com/th/-%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B9%80%E0%B8%AE%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A3%E0%B8%B4%E0%B9%80%E0%B8%84%E0%B8%99/hurricanes"
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', fontWeight: 'bold', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            🌪️ เปิดระบบติดตามพายุเต็มจอ (ฟรี) ↗
          </a>
        </div>
      )}

      {/* Embedded Interactive Frame */}
      <div className="windy-frame-wrap">
        <iframe
          src={embedUrl}
          title="Windy.com Interactive Meteorological Map"
          className="windy-iframe"
          loading="lazy"
          allow="fullscreen"
        />
      </div>

      {/* Attribution & Legal disclaimer */}
      <div className="windy-footer-note">
        <small>
          ℹ️ ข้อมูลพยากรณ์บรรยากาศ เส้นทางพายุ และภาพเว็บแคมได้รับอนุญาตให้บริการผ่าน Interactive Widget โดย <strong>Windy.com</strong> (ECMWF &amp; Tropical Cyclone Intelligence)
        </small>
      </div>
    </div>
  );
}
