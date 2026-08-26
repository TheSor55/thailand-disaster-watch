/**
 * LocationSelector — Controlled location selector for Weather Situation.
 * Supports verified presets (Bangkok, Chiang Mai, Khon Kaen, Phuket, Hat Yai)
 * and custom coordinate entry with validation.
 */

import { useState } from 'react';
import {
  VERIFIED_LOCATION_PRESETS,
  validateCoordinates,
  type LocationPreset,
  type WeatherSituationRequest,
} from '../../services/weatherSituation';

interface LocationSelectorProps {
  location: WeatherSituationRequest;
  onLocationChange: (nextLoc: { latitude: number; longitude: number; label?: string | null }) => void;
  disabled?: boolean;
}

export function LocationSelector({
  location,
  onLocationChange,
  disabled = false,
}: LocationSelectorProps) {
  const [customLat, setCustomLat] = useState(String(location.latitude));
  const [customLon, setCustomLon] = useState(String(location.longitude));
  const [customLabel, setCustomLabel] = useState(location.label ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);

  const handleSelectPreset = (preset: LocationPreset) => {
    setCustomLat(String(preset.latitude));
    setCustomLon(String(preset.longitude));
    setCustomLabel(`${preset.nameTh} (${preset.nameEn})`);
    setValidationError(null);
    onLocationChange({
      latitude: preset.latitude,
      longitude: preset.longitude,
      label: `${preset.nameTh} (${preset.nameEn})`,
    });
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);

    const validation = validateCoordinates(lat, lon);
    if (!validation.valid) {
      setValidationError(validation.error || 'พิกัดไม่ถูกต้อง');
      return;
    }

    setValidationError(null);
    onLocationChange({
      latitude: lat,
      longitude: lon,
      label: customLabel.trim() || `พิกัด ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    });
  };

  return (
    <section className="location-selector" aria-label="เลือกพื้นที่ติดตามสภาพอากาศ (Location Selector)">
      <div className="location-selector__header">
        <span className="eyebrow">LOCATION SELECTION</span>
        <h3>เลือกพื้นที่ติดตาม</h3>
      </div>

      {/* Verified Preset Buttons */}
      <div className="location-selector__presets" role="group" aria-label="พื้นที่ตั้งค่าล่วงหน้าที่ตรวจสอบแล้ว">
        {VERIFIED_LOCATION_PRESETS.map((preset) => {
          const isSelected =
            Math.abs(location.latitude - preset.latitude) < 0.001 &&
            Math.abs(location.longitude - preset.longitude) < 0.001;

          return (
            <button
              key={preset.id}
              type="button"
              className={`location-preset-btn${isSelected ? ' location-preset-btn--active' : ''}`}
              onClick={() => handleSelectPreset(preset)}
              disabled={disabled}
              aria-pressed={isSelected}
            >
              <strong>{preset.nameTh}</strong>
              <small>{preset.nameEn}</small>
            </button>
          );
        })}
      </div>

      {/* Custom Coordinates Collapsible */}
      <div className="location-selector__custom-toggle">
        <button
          type="button"
          className="location-custom-toggle-btn"
          onClick={() => setIsCustomExpanded((prev) => !prev)}
          aria-expanded={isCustomExpanded}
        >
          {isCustomExpanded ? '▲ ซ่อนการระบุพิกัดเอง' : '▼ ระบุพิกัดละติจูด/ลองจิจูดเอง (Custom Coordinates)'}
        </button>
      </div>

      {isCustomExpanded && (
        <form className="location-custom-form" onSubmit={handleApplyCustom}>
          <div className="location-custom-fields">
            <label className="location-custom-field">
              <span>ละติจูด (Latitude)</span>
              <input
                type="number"
                step="any"
                min="-90"
                max="90"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                disabled={disabled}
                placeholder="เช่น 13.7563"
                required
              />
            </label>

            <label className="location-custom-field">
              <span>ลองจิจูด (Longitude)</span>
              <input
                type="number"
                step="any"
                min="-180"
                max="180"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                disabled={disabled}
                placeholder="เช่น 100.5018"
                required
              />
            </label>

            <label className="location-custom-field">
              <span>ชื่อเรียกพื้นที่ (ระบุหรือไม่ก็ได้)</span>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                disabled={disabled}
                placeholder="เช่น อาคารสำนักงานใหญ่"
              />
            </label>
          </div>

          {validationError && (
            <p className="location-custom-error" role="alert">
              ⚠ {validationError}
            </p>
          )}

          <button type="submit" className="location-custom-submit" disabled={disabled}>
            ใช้พิกัดนี้
          </button>
        </form>
      )}
    </section>
  );
}
