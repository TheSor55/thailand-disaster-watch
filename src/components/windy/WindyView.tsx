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
      ? `https://www.windy.com/?hurricanes,${lat.toFixed(4)},${lon.toFixed(4)},${zoom}`
      : activeLayer === 'cams'
      ? `https://www.windy.com/?cams,${lat.toFixed(4)},${lon.toFixed(4)},${zoom}`
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
