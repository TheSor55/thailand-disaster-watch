import type { BasemapMode } from '../map/ThailandMap';

const futureLayers = [
  'Rain Radar',
  'Flood Forecast',
  'River',
  'Dam',
  'CCTV',
  'Warning Areas',
];

interface LayerControlProps {
  basemapMode: BasemapMode;
  showProvinces: boolean;
  onBasemapChange: (mode: BasemapMode) => void;
  onProvinceVisibilityChange: (visible: boolean) => void;
  showRadar?: boolean;
  onRadarVisibilityChange?: (visible: boolean) => void;
}

export function LayerControl({
  basemapMode,
  showProvinces,
  onBasemapChange,
  onProvinceVisibilityChange,
  showRadar = false,
  onRadarVisibilityChange,
}: LayerControlProps) {
  return (
    <div className="layer-control">
      <h3>Base map</h3>
      <div className="segmented-control" aria-label="เลือกรูปแบบแผนที่ฐาน">
        <button type="button" className={basemapMode === 'standard' ? 'is-active' : ''} onClick={() => onBasemapChange('standard')}>Standard</button>
        <button type="button" className={basemapMode === 'dark' ? 'is-active' : ''} onClick={() => onBasemapChange('dark')}>Dark</button>
        <button type="button" disabled title="Terrain will be evaluated in a later phase">Terrain</button>
      </div>

      <h3>Administrative</h3>
      <label className="layer-row">
        <span><i className="layer-swatch layer-swatch--boundary" />Province boundaries</span>
        <input type="checkbox" checked={showProvinces} onChange={(event) => onProvinceVisibilityChange(event.target.checked)} />
      </label>
      <div className="layer-row"><span><i className="layer-swatch layer-swatch--region" />Region highlight</span><span>Auto</span></div>

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

      <div className="layer-row is-disabled" aria-disabled="true">
        <span>
          Satellite / GISTDA Flood Extent
          <small>License and response schema require human verification</small>
        </span>
        <b>PENDING</b>
      </div>
      {futureLayers.map((layer) => (
        <div className="layer-row is-disabled" key={layer}><span>{layer}</span><b>PHASE 2+</b></div>
      ))}
    </div>
  );
}
