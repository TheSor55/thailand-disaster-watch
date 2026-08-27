import { useState } from 'react';

export type WindyLayer = 'wind' | 'rain' | 'clouds' | 'temp' | 'pressure' | 'waves';

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

  const embedUrl = `https://embed.windy.com/embed2.html?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}&detailLat=${lat.toFixed(4)}&detailLon=${lon.toFixed(4)}&width=100%25&height=100%25&zoom=${zoom}&level=surface&overlay=${activeLayer}&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
  const directLinkUrl = `https://www.windy.com/?${lat.toFixed(4)},${lon.toFixed(4)},${zoom}`;

  return (
    <div className="windy-container-page" aria-label="Windy.com Meteorological Viewer">
      {/* Header and Controls */}
      <div className="windy-toolbar">
        <div className="windy-toolbar-info">
          <span className="eyebrow">WINDY.COM INTERACTIVE METEOROLOGY</span>
          <h2>🌀 การจำลองกระแสลม พายุ และฝน ({locationName})</h2>
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
            className={`btn-windy-layer ${activeLayer === 'temp' ? 'is-active' : ''}`}
            onClick={() => setActiveLayer('temp')}
          >
            🌡️ อุณหภูมิ (Temp)
          </button>
          <button
            type="button"
            className={`btn-windy-layer ${activeLayer === 'pressure' ? 'is-active' : ''}`}
            onClick={() => setActiveLayer('pressure')}
          >
            🌀 ความกดอากาศ (Pressure)
          </button>
          <a
            href={directLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-windy-external"
            title="เปิดพิกัดนี้บนเว็บไซต์ Windy.com โดยตรง"
          >
            🌐 เปิดใน Windy.com ↗
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
          ℹ️ ข้อมูลพยากรณ์บรรยากาศและการจำลองกระแสลมได้รับอนุญาตให้บริการผ่าน Interactive Widget โดย <strong>Windy.com</strong> (ECMWF Forecast Model)
        </small>
      </div>
    </div>
  );
}
