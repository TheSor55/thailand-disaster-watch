/**
 * LocationSelector — Controlled location selector for Weather Situation.
 * Supports:
 * 1. 77-Province Dropdown & Scroll picker grouped by Region (เลื่อนเลือกจังหวัดได้ครบ 77 จังหวัด)
 * 2. Instant Search Filter (ค้นหาชื่อจังหวัด)
 * 3. Quick Popular City Presets (กรุงเทพฯ, เชียงใหม่, ขอนแก่น, ชลบุรี, ภูเก็ต, หาดใหญ่)
 * 4. Optional Custom Coordinate Entry (ซ่อนไว้เป็นตัวเลือกเสริมสำหรับผู้เชี่ยวชาญ)
 */

import { useState, useMemo } from 'react';
import {
  PROVINCES,
  REGIONS,
  type ProvinceDefinition,
} from '../../config/regions';
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
  const [selectedIso, setSelectedIso] = useState<string>(() => {
    const matched = PROVINCES.find(
      (p) =>
        Math.abs(location.latitude - p.latitude) < 0.05 &&
        Math.abs(location.longitude - p.longitude) < 0.05
    );
    return matched ? matched.isoCode : 'TH-10';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('ALL');

  const [customLat, setCustomLat] = useState(String(location.latitude));
  const [customLon, setCustomLon] = useState(String(location.longitude));
  const [customLabel, setCustomLabel] = useState(location.label ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);

  // Filtered provinces for dropdown and search
  const filteredProvinces = useMemo(() => {
    return PROVINCES.filter((p) => {
      const matchQuery =
        !searchQuery ||
        p.nameTh.includes(searchQuery) ||
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRegion =
        selectedRegionFilter === 'ALL' || p.regionId === selectedRegionFilter;
      return matchQuery && matchRegion;
    });
  }, [searchQuery, selectedRegionFilter]);

  const handleSelectProvince = (prov: ProvinceDefinition) => {
    setSelectedIso(prov.isoCode);
    setCustomLat(String(prov.latitude));
    setCustomLon(String(prov.longitude));
    setCustomLabel(`${prov.nameTh} (${prov.nameEn})`);
    setValidationError(null);
    onLocationChange({
      latitude: prov.latitude,
      longitude: prov.longitude,
      label: `${prov.nameTh} (${prov.nameEn})`,
    });
  };

  const handleSelectPreset = (preset: LocationPreset) => {
    const prov = PROVINCES.find((p) => p.nameTh === preset.nameTh || preset.nameTh.includes(p.nameTh));
    if (prov) setSelectedIso(prov.isoCode);
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
        <h3>เลือกพื้นที่ติดตามสภาพอากาศ (77 จังหวัด)</h3>
      </div>

      {/* 1. Main Province Dropdown Selector */}
      <div className="location-selector__main-picker">
        <div className="location-dropdown-wrapper">
          <label htmlFor="province-scroll-select" className="location-dropdown-label">
            <span>📍 เลื่อนเลือกจังหวัดที่ต้องการตรวจสภาพอากาศ:</span>
          </label>
          <div className="location-dropdown-row">
            <select
              id="province-scroll-select"
              className="location-province-select"
              value={selectedIso}
              onChange={(e) => {
                const prov = PROVINCES.find((p) => p.isoCode === e.target.value);
                if (prov) handleSelectProvince(prov);
              }}
              disabled={disabled}
              aria-label="เลื่อนเลือกจังหวัด"
            >
              {REGIONS.map((region) => (
                <optgroup key={region.id} label={`── ${region.nameTh} ──`}>
                  {PROVINCES.filter((p) => p.regionId === region.id).map((p) => (
                    <option key={p.isoCode} value={p.isoCode}>
                      {p.nameTh} ({p.nameEn})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Quick Search & Region Filter Chips */}
        <div className="location-search-box">
          <div className="location-search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="location-search-input"
              placeholder="พิมพ์ชื่อจังหวัดเพื่อค้นหา เช่น ชลบุรี, เชียงใหม่, อยุธยา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={disabled}
              aria-label="ค้นหาชื่อจังหวัด"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchQuery('')}
                aria-label="ล้างการค้นหา"
              >
                ✕
              </button>
            )}
          </div>

          <div className="location-region-chips">
            <button
              type="button"
              className={`region-chip ${selectedRegionFilter === 'ALL' ? 'is-active' : ''}`}
              onClick={() => setSelectedRegionFilter('ALL')}
            >
              ทั้งหมด
            </button>
            {REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`region-chip ${selectedRegionFilter === r.id ? 'is-active' : ''}`}
                onClick={() => setSelectedRegionFilter(r.id)}
              >
                {r.shortLabel}
              </button>
            ))}
          </div>

          {/* Quick province chips from filter */}
          {(searchQuery || selectedRegionFilter !== 'ALL') && (
            <div className="location-filtered-chips" role="listbox" aria-label="ผลการค้นหาจังหวัด">
              {filteredProvinces.length === 0 ? (
                <p className="no-match-text">ไม่พบจังหวัดที่ตรงกับคำค้นหา</p>
              ) : (
                filteredProvinces.map((prov) => (
                  <button
                    key={prov.isoCode}
                    type="button"
                    className={`province-chip-btn ${selectedIso === prov.isoCode ? 'is-active' : ''}`}
                    onClick={() => handleSelectProvince(prov)}
                  >
                    <strong>{prov.nameTh}</strong>
                    <small>{prov.nameEn}</small>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Verified Popular Presets */}
      <div className="location-selector__quick-presets">
        <span className="presets-label">⚡ เมืองสำคัญยอดนิยม:</span>
        <div className="location-selector__presets" role="group" aria-label="เมืองสำคัญยอดนิยม">
          {VERIFIED_LOCATION_PRESETS.map((preset) => {
            const isSelected =
              Math.abs(location.latitude - preset.latitude) < 0.01 &&
              Math.abs(location.longitude - preset.longitude) < 0.01;

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
      </div>

      {/* 4. Custom Coordinates Collapsible (Optional Expert Section) */}
      <div className="location-selector__custom-toggle">
        <button
          type="button"
          className="location-custom-toggle-btn"
          onClick={() => setIsCustomExpanded((prev) => !prev)}
          aria-expanded={isCustomExpanded}
        >
          {isCustomExpanded
            ? '▲ ซ่อนการระบุพิกัดเอง'
            : '▼ ระบุพิกัดละติจูด/ลองจิจูดเอง (สำหรับผู้เชี่ยวชาญ / พิกัดเฉพาะจุด)'}
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
                placeholder="เช่น โรงงานอมตะนคร"
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
