import { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap, NavigationControl, ScaleControl, Popup } from 'maplibre-gl';
import { createMapStyle } from '../../map/mapStyle';
import { MAJOR_DAMS } from '../../domain/dam';
import { MAJOR_RIVER_STATIONS } from '../../domain/river';

interface ThaiWaterRadarViewProps {
  onBack?: () => void;
}

interface RadarFrameItem {
  time: number;
  tileUrl: string;
}

const DAM_COORDINATES: Record<string, [number, number]> = {
  'dam-bhumibol': [98.9722, 17.2435],
  'dam-sirikit': [100.5606, 17.7667],
  'dam-kwaenoi': [100.4194, 17.1856],
  'dam-kewlom': [99.6200, 18.5200],
  'dam-pasak': [101.0772, 14.8631],
  'dam-krasiao': [99.6667, 14.8333],
  'dam-khundan': [101.3200, 14.3142],
  'dam-ubolratana': [102.6247, 16.7728],
  'dam-lampao': [103.4500, 16.6000],
  'dam-srinagarind': [99.1294, 14.4069],
  'dam-vajiralongkorn': [98.5986, 14.7989],
  'dam-ratchaprapha': [98.8167, 8.9722],
  'dam-bangphra': [100.9575, 13.2125],
};

const RIVER_COORDINATES: Record<string, [number, number]> = {
  'station-c2': [100.1264, 15.6706],
  'station-c13': [100.1814, 15.1583],
  'station-c29a': [100.5233, 14.1683],
  'station-c35': [100.5617, 14.3483],
  'station-n1': [99.0033, 18.7883],
  'station-n67': [100.1283, 15.6967],
  'station-m7': [104.8583, 15.2283],
  'station-e1': [101.3717, 14.0533],
};

const STORM_TRACK_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'แนวพายุหมุนเขตร้อน แนวที่ 1' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [119.0, 14.8],
          [113.0, 13.5],
          [108.0, 12.2],
          [102.5, 10.8],
          [97.0, 9.4],
          [92.0, 8.0],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'แนวพายุหมุนเขตร้อน แนวที่ 2' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [119.0, 16.2],
          [112.5, 14.9],
          [107.0, 13.6],
          [101.5, 12.3],
          [96.0, 11.0],
          [91.0, 9.5],
        ],
      },
    },
  ],
};

export function ThaiWaterRadarView({ onBack }: ThaiWaterRadarViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);

  const [frames, setFrames] = useState<RadarFrameItem[]>([]);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [radarOpacity, setRadarOpacity] = useState<number>(0.85);

  // Layer Toggles
  const [showRadar, setShowRadar] = useState<boolean>(true);
  const [showStorms, setShowStorms] = useState<boolean>(true);
  const [showDams, setShowDams] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);

  // 1. Fetch Real-time RainViewer Live Radar Frames
  useEffect(() => {
    let isCancelled = false;
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((res) => res.json())
      .then((data) => {
        if (isCancelled || !data?.radar?.past || !data.host) return;
        const host = data.host;
        const pastList: Array<{ time: number; path: string }> = data.radar.past;
        const loadedFrames: RadarFrameItem[] = pastList.map((item) => ({
          time: item.time,
          tileUrl: `${host}${item.path}/256/{z}/{x}/{y}/2/1_1.png`,
        }));
        if (loadedFrames.length > 0) {
          setFrames(loadedFrames);
          setActiveFrameIndex(loadedFrames.length - 1);
        }
      })
      .catch(() => {
        // Safe fallback
        const nowSec = Math.floor(Date.now() / 1000);
        setFrames([
          { time: nowSec, tileUrl: `https://tilecache.rainviewer.com/v2/radar/nowcast/256/{z}/{x}/{y}/2/1_1.png` },
        ]);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Initialize MapLibre GL Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const map = new MapLibreMap({
        container: containerRef.current,
        style: createMapStyle(),
        center: [100.8, 13.8],
        zoom: 5.6,
        minZoom: 4.0,
        maxZoom: 14,
        attributionControl: false,
      });

      map.addControl(new NavigationControl({ showCompass: true, showZoom: true }), 'top-right');
      map.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left');

      map.on('load', () => {
        // Add Storm Tracks Layer
        map.addSource('storm-track-source', {
          type: 'geojson',
          data: STORM_TRACK_GEOJSON,
        });

        map.addLayer({
          id: 'storm-track-glow',
          type: 'line',
          source: 'storm-track-source',
          paint: {
            'line-color': '#0284c7',
            'line-width': 6,
            'line-opacity': 0.5,
          },
        });

        map.addLayer({
          id: 'storm-track-line',
          type: 'line',
          source: 'storm-track-source',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 2.5,
            'line-dasharray': [4, 3],
          },
        });

        // Add Dams GeoJSON
        const damsGeoJson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: MAJOR_DAMS.map((dam) => {
            const coords = DAM_COORDINATES[dam.damId] || [100.5, 13.7];
            return {
              type: 'Feature',
              properties: {
                id: dam.damId,
                name: dam.nameTh,
                province: dam.province,
                storage: dam.currentStorageMcm,
                capacity: dam.capacityMcm,
                percent: dam.storagePercent,
                inflow: dam.inflowMcm,
                outflow: dam.outflowMcm,
                status: dam.status,
                label: `🏞️ ${dam.nameTh} (${dam.storagePercent}%)`,
              },
              geometry: {
                type: 'Point',
                coordinates: coords,
              },
            };
          }),
        };

        map.addSource('dams-source', {
          type: 'geojson',
          data: damsGeoJson,
        });

        map.addLayer({
          id: 'dams-circles',
          type: 'circle',
          source: 'dams-source',
          paint: {
            'circle-radius': 8,
            'circle-color': '#0284c7',
            'circle-stroke-width': 2.5,
            'circle-stroke-color': '#ffffff',
          },
        });

        map.addLayer({
          id: 'dams-labels',
          type: 'symbol',
          source: 'dams-source',
          layout: {
            'text-field': ['get', 'label'],
            'text-size': 11,
            'text-offset': [0, 1.4],
            'text-anchor': 'top',
          },
          paint: {
            'text-color': '#f8fafc',
            'text-halo-color': '#0f172a',
            'text-halo-width': 2,
          },
        });

        // Add Rivers GeoJSON
        const riversGeoJson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: MAJOR_RIVER_STATIONS.map((st) => {
            const coords = RIVER_COORDINATES[st.stationId] || [100.5, 14.0];
            return {
              type: 'Feature',
              properties: {
                id: st.stationId,
                code: st.stationCode,
                name: st.nameTh,
                river: st.riverName,
                province: st.province,
                discharge: st.dischargeCms,
                status: st.status,
                label: `🌊 ${st.stationCode} ${st.nameTh}`,
              },
              geometry: {
                type: 'Point',
                coordinates: coords,
              },
            };
          }),
        };

        map.addSource('rivers-source', {
          type: 'geojson',
          data: riversGeoJson,
        });

        map.addLayer({
          id: 'rivers-circles',
          type: 'circle',
          source: 'rivers-source',
          paint: {
            'circle-radius': 7,
            'circle-color': '#10b981',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        });

        map.addLayer({
          id: 'rivers-labels',
          type: 'symbol',
          source: 'rivers-source',
          layout: {
            'text-field': ['get', 'label'],
            'text-size': 10.5,
            'text-offset': [0, 1.3],
            'text-anchor': 'top',
          },
          paint: {
            'text-color': '#6ee7b7',
            'text-halo-color': '#064e3b',
            'text-halo-width': 2,
          },
        });

        // Click Handler for Dams
        map.on('click', 'dams-circles', (e) => {
          if (!e.features?.[0]) return;
          const p = e.features[0].properties as { name: string; province: string; percent: number; storage: number; capacity: number; inflow: number; outflow: number };
          const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [number, number];

          popupRef.current?.remove();
          popupRef.current = new Popup({ closeButton: true, offset: 12 })
            .setLngLat(coords)
            .setHTML(`
              <div style="font-family: sans-serif; padding: 4px 6px; color: #0f172a;">
                <strong style="font-size: 14px; color: #0284c7;">🏞️ ${p.name} (จ.${p.province})</strong>
                <p style="margin: 4px 0 2px; font-size: 12px;">ปริมาตรน้ำกักเก็บ: <strong>${p.storage} / ${p.capacity} ล้าน ลบ.ม.</strong></p>
                <div style="background: #e0f2fe; border-radius: 4px; padding: 3px 6px; margin: 4px 0; font-size: 12px;">
                  ความจุ: <strong style="color: #0369a1;">${p.percent}%</strong> · น้ำไหลเข้า: ${p.inflow} · ระบาย: ${p.outflow} ลบ.ม./วัน
                </div>
              </div>
            `)
            .addTo(map);
        });

        // Click Handler for Rivers
        map.on('click', 'rivers-circles', (e) => {
          if (!e.features?.[0]) return;
          const p = e.features[0].properties as { code: string; name: string; river: string; province: string; discharge: number; status: string };
          const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [number, number];

          popupRef.current?.remove();
          popupRef.current = new Popup({ closeButton: true, offset: 12 })
            .setLngLat(coords)
            .setHTML(`
              <div style="font-family: sans-serif; padding: 4px 6px; color: #0f172a;">
                <strong style="font-size: 14px; color: #059669;">🌊 สถานี ${p.code} (${p.name})</strong>
                <p style="margin: 4px 0 2px; font-size: 12px;">แม่น้ำ: <strong>${p.river} (จ.${p.province})</strong></p>
                <div style="background: #d1fae5; border-radius: 4px; padding: 3px 6px; margin: 4px 0; font-size: 12px;">
                  อัตราการไหล: <strong style="color: #047857;">${p.discharge} ลบ.ม./วินาที</strong> (สถานะ: ${p.status})
                </div>
              </div>
            `)
            .addTo(map);
        });

        map.on('mouseenter', 'dams-circles', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'dams-circles', () => { map.getCanvas().style.cursor = ''; });
        map.on('mouseenter', 'rivers-circles', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'rivers-circles', () => { map.getCanvas().style.cursor = ''; });
      });

      mapRef.current = map;
    } catch {
      /* safe ignore */
    }

    return () => {
      if (popupRef.current) popupRef.current.remove();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 3. Update Radar Raster Layer when Frame Changes
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

        // Insert below vector markers
        const beforeLayer = map.getLayer('dams-circles') ? 'dams-circles' : undefined;

        map.addLayer(
          {
            id: layerId,
            type: 'raster',
            source: sourceId,
            layout: { visibility: 'visible' },
            paint: {
              'raster-opacity': radarOpacity,
              'raster-fade-duration': 80,
            },
          },
          beforeLayer,
        );
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

  // 4. Update Layer Visibilities
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    try {
      const stormVis = showStorms ? 'visible' : 'none';
      if (map.getLayer('storm-track-glow')) map.setLayoutProperty('storm-track-glow', 'visibility', stormVis);
      if (map.getLayer('storm-track-line')) map.setLayoutProperty('storm-track-line', 'visibility', stormVis);

      const damVis = showDams ? 'visible' : 'none';
      if (map.getLayer('dams-circles')) map.setLayoutProperty('dams-circles', 'visibility', damVis);
      if (map.getLayer('dams-labels')) map.setLayoutProperty('dams-labels', 'visibility', damVis);

      const riverVis = showRivers ? 'visible' : 'none';
      if (map.getLayer('rivers-circles')) map.setLayoutProperty('rivers-circles', 'visibility', riverVis);
      if (map.getLayer('rivers-labels')) map.setLayoutProperty('rivers-labels', 'visibility', riverVis);
    } catch {
      /* safe ignore */
    }
  }, [showStorms, showDams, showRivers]);

  // 5. Animation Interval for Radar Loop
  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    const interval = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % frames.length);
    }, 1100);

    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  const currentFrame = frames[activeFrameIndex];
  const formatTime = (epochSec?: number) => {
    if (!epochSec) return '—';
    try {
      return new Date(epochSec * 1000).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(epochSec);
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
                <span className="live-text">LIVE RADAR &amp; STORM TRACKS</span>
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
      <div className="thaiwater-viewport" style={{ position: 'relative', flex: 1, minHeight: '540px' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '540px' }} />

        {/* Floating Left Layer Control Panel */}
        <div className="thaiwater-floating-controls">
          <span className="floating-ctrl-title">🎛️ เปิด-ปิดชั้นข้อมูล (Layers)</span>
          <label className="ctrl-checkbox-label">
            <input
              type="checkbox"
              checked={showRadar}
              onChange={(e) => setShowRadar(e.target.checked)}
            />
            <span>🌧️ เรดาร์กลุ่มฝนสด ({frames.length} เฟรม)</span>
          </label>
          <label className="ctrl-checkbox-label">
            <input
              type="checkbox"
              checked={showStorms}
              onChange={(e) => setShowStorms(e.target.checked)}
            />
            <span>🌀 เส้นทางพายุหมุน (Storm Tracks)</span>
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
              ⏰ เวลาเรดาร์: <strong>{formatTime(currentFrame?.time)}</strong>
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
          📡 เทเลเมทรีเรดาร์ &amp; น้ำ: <strong>RainViewer Global Weather Radar &amp; คลังข้อมูลน้ำแห่งชาติ สสน. (ThaiWater.net)</strong>
        </p>
        <small>
          คลิกที่หมุดเขื่อน 🏞️ หรือสถานีวัดน้ำ 🌊 เพื่อดูข้อมูลความจุ ระดับน้ำ และอัตราการระบายน้ำแบบละเอียดได้ทันที
        </small>
      </footer>
    </div>
  );
}
