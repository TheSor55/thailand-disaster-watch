import type { BasemapMode } from '../map/ThailandMap';

interface LayerControlProps {
  basemapMode: BasemapMode;
  showProvinces: boolean;
  onBasemapChange: (mode: BasemapMode) => void;
  onProvinceVisibilityChange: (visible: boolean) => void;
  showRadar?: boolean;
  onRadarVisibilityChange?: (visible: boolean) => void;
  showFlood?: boolean;
  onFloodVisibilityChange?: (visible: boolean) => void;
}

export function LayerControl({
  basemapMode,
  showProvinces,
  onBasemapChange,
  onProvinceVisibilityChange,
  showRadar = false,
  onRadarVisibilityChange,
  showFlood = false,
  onFloodVisibilityChange,
}: LayerControlProps) {
  return (
    <div className="layer-control">
      <h3>Base map</h3>
      <div className="segmented-control" aria-label="เลือกรูปแบบแผนที่ฐาน">
        <button
          type="button"
          className={basemapMode === 'standard' ? 'is-active' : ''}
          onClick={() => onBasemapChange('standard')}
        >
          Standard
        </button>
        <button
          type="button"
          className={basemapMode === 'dark' ? 'is-active' : ''}
          onClick={() => onBasemapChange('dark')}
        >
          Dark
        </button>
        <button
          type="button"
          className={basemapMode === 'satellite' ? 'is-active' : ''}
          onClick={() => onBasemapChange('satellite')}
        >
          🛰️ ดาวเทียม
        </button>
      </div>

      <h3>Administrative</h3>
      <label className="layer-row">
        <span>
          <i className="layer-swatch layer-swatch--boundary" />
          ขอบเขตจังหวัด (Province boundaries)
        </span>
        <input
          type="checkbox"
          checked={showProvinces}
          onChange={(event) => onProvinceVisibilityChange(event.target.checked)}
        />
      </label>

      {/* Disaster & Weather Observations — Unused/Redundant Layer Block (Hidden as requested) */}
      <div className="disaster-observations-section" style={{ display: 'none' }} aria-hidden="true">
        <h3>Disaster &amp; Weather Observations</h3>
        <label className="layer-row">
          <span>
            <i className="layer-swatch layer-swatch--radar" />
            🌤 เรดาร์ตรวจอากาศ (Radar Observation)
            <small>RainViewer · OBSERVED_REMOTE_SENSING · Controlled Preview</small>
          </span>
          <input
            type="checkbox"
            checked={showRadar}
            onChange={(event) => onRadarVisibilityChange?.(event.target.checked)}
            aria-label="เปิด/ปิด เลเยอร์เรดาร์ตรวจอากาศ"
          />
        </label>

        {/* GISTDA Satellite Flood Layer */}
        <label className="layer-row">
          <span>
            <i className="layer-swatch layer-swatch--flood" />
            🛰️ ภาพถ่ายดาวเทียมน้ำท่วมขัง (GISTDA Flood Inundation)
            <small>GISTDA Sentinel-1 SAR · OBSERVED · Controlled Pilot</small>
          </span>
          <input
            type="checkbox"
            checked={showFlood}
            onChange={(event) => onFloodVisibilityChange?.(event.target.checked)}
            aria-label="เปิด/ปิด เลเยอร์ภาพถ่ายดาวเทียมน้ำท่วมขัง"
          />
        </label>
      </div>
    </div>
  );
}
