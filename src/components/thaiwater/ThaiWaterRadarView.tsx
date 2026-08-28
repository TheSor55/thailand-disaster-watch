import { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap, NavigationControl, ScaleControl } from 'maplibre-gl';
import { createMapStyle } from '../../map/mapStyle';
import { getDemoRadarFrames, type RadarFrame } from '../../services/radar';
import { MAJOR_DAMS } from '../../domain/dam';
import { MAJOR_RIVER_STATIONS } from '../../domain/river';

interface ThaiWaterRadarViewProps {
  onBack?: () => void;
}

export function ThaiWaterRadarView({ onBack }: ThaiWaterRadarViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const [frames] = useState<RadarFrame[]>(() => getDemoRadarFrames().frames);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(() => Math.max(0, getDemoRadarFrames().frames.length - 1));
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [radarOpacity, setRadarOpacity] = useState<number>(0.85);

  // Layer Toggles
  const [showRadar, setShowRadar] = useState<boolean>(true);
  const [showDams, setShowDams] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const map = new MapLibreMap({
        container: containerRef.current,
        style: createMapStyle(),
        center: [100.5018, 13.7563],
        zoom: 5.8,
        minZoom: 4.5,
        maxZoom: 13,
        attributionControl: false,
      });

      map.addControl(new NavigationControl({ showCompass: true, showZoom: true }), 'top-right');
      map.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left');

      mapRef.current = map;
    } catch {
      /* safe ignore */
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Radar Layer on Active Frame Change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || frames.length === 0) return;

    const currentFrame = frames[activeFrameIndex];
    if (!currentFrame) return;

    const sourceId = 'thaiwater-radar-source';
    const layerId = 'thaiwater-radar-layer';

    const updateLayer = () => {
      if (!showRadar) {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', 'none');
        }
        return;
      }

      try {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }

        map.addSource(sourceId, {
          type: 'raster',
          tiles: [currentFrame.tileUrl],
          tileSize: 256,
          maxzoom: 12,
          attribution: 'Weather radar telemetry data by RainViewer / ThaiWater',
        });

        map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
          layout: { visibility: 'visible' },
          paint: {
            'raster-opacity': radarOpacity,
            'raster-fade-duration': 100,
          },
        });
      } catch {
        /* safe ignore */
      }
    };

    if (map.isStyleLoaded()) {
      updateLayer();
    } else {
      map.once('load', updateLayer);
    }
  }, [frames, activeFrameIndex, showRadar, radarOpacity]);

  // Animation Interval for Radar Loop
  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    const interval = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % frames.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  const currentFrame = frames[activeFrameIndex];
  const formatTime = (iso?: string) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="thaiwater-container-page" aria-label="ThaiWater & RainViewer Realtime Radar Studio">
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
              <span className="eyebrow">HYDRO-INFORMATICS &amp; RADAR TELEMETRY</span>
              <span className="live-status-indicator">
                <span className="live-dot" />
                <span className="live-text">RADAR REFLECTANCE ACTIVE</span>
              </span>
            </div>
            <h2>🌧️ แผนที่เรดาร์ตรวจวัดกลุ่มฝนและเส้นทางพายุ (Live Radar Studio)</h2>
          </div>
        </div>

        <div className="thaiwater-toolbar-actions">
          <a
            href="https://twa.thaiwater.net/th/map/basic/overall/overall/0?ds=rr%2Csc&p=hide"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pro-action btn-pro-action--primary"
            style={{ textDecoration: 'none' }}
            title="เปิดหน้าเว็บหลักของ สสน. ในแท็บใหม่"
          >
            ↗ เปิดเว็บทางการ สสน. (ThaiWater.net) ↗
          </a>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="thaiwater-viewport" style={{ position: 'relative', flex: 1, minHeight: '520px' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '520px' }} />

        {/* Floating Left Layer Control Panel */}
        <div className="thaiwater-floating-controls">
          <span className="floating-ctrl-title">🎛️ ชั้นข้อมูล (Layers)</span>
          <label className="ctrl-checkbox-label">
            <input
              type="checkbox"
              checked={showRadar}
              onChange={(e) => setShowRadar(e.target.checked)}
            />
            <span>🌧️ เรดาร์กลุ่มฝนสด</span>
          </label>
          <label className="ctrl-checkbox-label">
            <input
              type="checkbox"
              checked={showDams}
              onChange={(e) => setShowDams(e.target.checked)}
            />
            <span>🏞️ อ่างเก็บน้ำขนาดใหญ่ ({MAJOR_DAMS.length})</span>
          </label>
          <label className="ctrl-checkbox-label">
            <input
              type="checkbox"
              checked={showRivers}
              onChange={(e) => setShowRivers(e.target.checked)}
            />
            <span>🌊 สถานีวัดน้ำท่า ({MAJOR_RIVER_STATIONS.length})</span>
          </label>

          <div className="ctrl-opacity-box">
            <small>ความเข้มเรดาร์: {Math.round(radarOpacity * 100)}%</small>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={radarOpacity}
              onChange={(e) => setRadarOpacity(parseFloat(e.target.value))}
              aria-label="ปรับความทึบแสงเรดาร์"
            />
          </div>
        </div>

        {/* Floating Bottom Timeline Player Bar */}
        <div className="thaiwater-timeline-player">
          <div className="timeline-controls">
            <button
              type="button"
              className="btn-play-pause"
              onClick={() => setIsPlaying((p) => !p)}
              title={isPlaying ? 'หยุดชั่วคราว' : 'เล่นภาพเคลื่อนไหว'}
            >
              {isPlaying ? '⏸️ พัก' : '▶️ เล่น'}
            </button>

            <span className="timeline-time-display">
              ⏰ เวลาเรดาร์: <strong>{formatTime(currentFrame?.frameTime)}</strong>
            </span>

            <input
              type="range"
              min="0"
              max={Math.max(0, frames.length - 1)}
              value={activeFrameIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setActiveFrameIndex(parseInt(e.target.value, 10));
              }}
              className="timeline-slider"
              aria-label="เลือกช่วงเวลาเรดาร์"
            />

            <span className="timeline-frame-counter">
              เฟรม {activeFrameIndex + 1}/{frames.length}
            </span>
          </div>

          {/* Rainfall Intensity Scale Legend */}
          <div className="rainfall-intensity-legend">
            <span className="legend-label">ระดับความแรงฝน (มม./ชม.):</span>
            <span className="intensity-chip intensity-chip--none">ไม่มีฝน &lt;0.3</span>
            <span className="intensity-chip intensity-chip--drizzle">ฝนปรอย 0.3</span>
            <span className="intensity-chip intensity-chip--light">ฝนเบา 1.3</span>
            <span className="intensity-chip intensity-chip--mod">ปานกลาง 3.0</span>
            <span className="intensity-chip intensity-chip--heavy">ฝนหนัก 12+</span>
          </div>
        </div>
      </div>

      {/* Bottom Data Attribution Footer */}
      <footer className="thaiwater-footer">
        <p>
          📡 เทเลเมทรีเรดาร์: <strong>RainViewer Global Weather Radar &amp; คลังข้อมูลน้ำแห่งชาติ สสน. (ThaiWater.net)</strong>
        </p>
        <small>
          ประมวลผลผ่าน WebGL Tile Engine แบบ Real-time ครอบคลุมลุ่มน้ำเจ้าพระยา ป่าสัก ท่าจีน แม่กลอง ปราจีนบุรี และทุกภูมิภาค
        </small>
      </footer>
    </div>
  );
}
