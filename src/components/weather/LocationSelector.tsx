/**
 * LocationSelector — Controlled location selector for Weather Situation.
 * Supports:
 * 1. 77-Province Dropdown & Scroll picker grouped by Region
 * 2. Instant Search Filter (ค้นหาชื่อจังหวัด/เขต)
 * 3. 🏢 My Sites Quick Selector (เพชรสยาม บางบอน, สาลี่ นวนคร/คลองสี่, สาลี่ บางปู, DC CJ More, DC BigC วังน้อย ฯลฯ)
 * 4. 📡 Regional Radar Selector (เรดาร์ กทม. หนองแขม, ชัยนาท, ลำพูน, พิษณุโลก, ขอนแก่น, สัตหีบ, ภูเก็ต, สุราษฎร์ฯ)
 * 5. 📍 GPS My Location (ตรวจจับพิกัดปัจจุบันของผู้ใช้)
 * 6. Custom Coordinate Entry
 */

import { useState, useMemo } from 'react';
import {
  PROVINCES,
  REGIONS,
  type ProvinceDefinition,
} from '../../config/regions';
import {
  validateCoordinates,
  type WeatherSituationRequest,
} from '../../services/weatherSituation';
import {
  REGIONAL_RADAR_STATIONS,
  type RegionalRadarStation,
} from '../../domain/regionalRadar';

interface LocationSelectorProps {
  location: WeatherSituationRequest;
  onLocationChange: (nextLoc: { latitude: number; longitude: number; label?: string | null }) => void;
  disabled?: boolean;
}

export const MY_SITES_PRESETS = [
  {
    id: 'site-petchsiam',
    nameTh: 'บริษัท เพชรสยามประเทศไทย จำกัด (บางบอน)',
    nameEn: 'Petchsiam (Thailand) Co., Ltd. (Bang Bon)',
    latitude: 13.6635,
    longitude: 100.4124,
    badge: '🏢 โรงงานเพชรสยาม',
  },
  {
    id: 'site-salee-industry',
    nameTh: 'บริษัท สาลี่อุตสาหกรรม จำกัด (มหาชน) (คลองสี่ ปทุมธานี)',
    nameEn: 'Salee Industry PCL (Khlong Si, Pathum Thani)',
    latitude: 14.0758,
    longitude: 100.6865,
    badge: '🏢 สาลี่ คลองสี่',
  },
  {
    id: 'site-salee-colour',
    nameTh: 'บริษัท สาลี่ คัลเล่อร์ จำกัด (มหาชน) (นิคมฯ บางปู)',
    nameEn: 'Salee Colour PCL (Bangpoo Industrial Estate)',
    latitude: 13.5285,
    longitude: 100.6582,
    badge: '🏢 สาลี่ บางปู',
  },
  {
    id: 'site-dc-cjmore',
    nameTh: 'ศูนย์กระจายสินค้า DC - CJ MORE (กระทุ่มแบน สมุทรสาคร)',
    nameEn: 'DC CJ More (Krathum Baen, Samut Sakhon)',
    latitude: 13.6550,
    longitude: 100.2850,
    badge: '📦 DC CJ More',
  },
  {
    id: 'site-dc-bigc',
    nameTh: 'ศูนย์กระจายสินค้า DC - BigC (วังน้อย พระนครศรีอยุธยา)',
    nameEn: 'DC Big C (Wang Noi, Ayutthaya)',
    latitude: 14.2340,
    longitude: 100.7180,
    badge: '📦 DC Big C วังน้อย',
  },
  {
    id: 'site-dc-gowow',
    nameTh: 'ศูนย์กระจายสินค้า DC - Go! WOW (บางบัวทอง นนทบุรี)',
    nameEn: 'DC Go! WOW (Bang Bua Thong, Nonthaburi)',
    latitude: 13.9210,
    longitude: 100.4120,
    badge: '📦 DC Go! WOW',
  },
] as const;

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

  const [customLat, setCustomLat] = useState(String(location.latitude));
  const [customLon, setCustomLon] = useState(String(location.longitude));
  const [customLabel, setCustomLabel] = useState(location.label ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Filtered provinces for dropdown and search
  const filteredProvinces = useMemo(() => {
    return PROVINCES.filter((p) => {
      const matchQuery =
        !searchQuery ||
        p.nameTh.includes(searchQuery) ||
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchQuery;
    });
  }, [searchQuery]);

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

  const handleSelectMySite = (site: (typeof MY_SITES_PRESETS)[number]) => {
    setCustomLat(String(site.latitude));
    setCustomLon(String(site.longitude));
    setCustomLabel(site.nameTh);
    setValidationError(null);
    onLocationChange({
      latitude: site.latitude,
      longitude: site.longitude,
      label: site.nameTh,
    });
  };

  const handleSelectRadarStation = (radar: RegionalRadarStation) => {
    const prov = PROVINCES.find((p) => p.nameTh === radar.provinceNameTh);
    if (prov) setSelectedIso(prov.isoCode);
    setCustomLat(String(radar.latitude));
    setCustomLon(String(radar.longitude));
    setCustomLabel(`${radar.nameTh} (${radar.provinceNameTh})`);
    setValidationError(null);
    onLocationChange({
      latitude: radar.latitude,
      longitude: radar.longitude,
      label: `${radar.nameTh} (${radar.provinceNameTh})`,
    });
  };

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      setValidationError('เบราว์เซอร์ไม่รองรับการระบุพิกัด GPS');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCustomLat(String(lat));
        setCustomLon(String(lon));
        setCustomLabel(`📍 พิกัดปัจจุบันของฉัน (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
        setValidationError(null);
        onLocationChange({
          latitude: lat,
          longitude: lon,
          label: `📍 พิกัดปัจจุบันของฉัน (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
        });
      },
      () => {
        setIsLocating(false);
        setValidationError('ไม่สามารถดึงตำแหน่ง GPS ได้ โปรดตรวจสอบการอนุญาต Location');
      },
      { timeout: 8000 }
    );
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
      <div className="location-selector__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <span className="eyebrow">LOCATION SELECTION & REGIONAL RADAR</span>
          <h3 style={{ margin: 0 }}>เลือกพื้นที่ติดตามสภาพอากาศ & เรดาร์ตรวจฝน</h3>
        </div>
        <button
          type="button"
          onClick={handleGetMyLocation}
          disabled={isLocating || disabled}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid #38bdf8',
            color: '#38bdf8',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <span>📍</span>
          <span>{isLocating ? 'กำลังดึงพิกัด GPS...' : 'ใช้พิกัดปัจจุบันของฉัน (GPS)'}</span>
        </button>
      </div>

      {/* 1. 🏢 My Sites Quick Presets */}
      <div style={{ marginTop: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '10px 12px' }}>
        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
          🏢 เลือกจากพื้นที่เฝ้าระวังของฉัน (My Sites & Factories):
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {MY_SITES_PRESETS.map((site) => (
            <button
              key={site.id}
              type="button"
              onClick={() => handleSelectMySite(site)}
              disabled={disabled}
              className={`preset-btn ${location.label === site.nameTh ? 'is-active' : ''}`}
              style={{
                fontSize: '0.72rem',
                padding: '4px 10px',
                background: location.label === site.nameTh ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.8)',
                border: location.label === site.nameTh ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                color: location.label === site.nameTh ? '#38bdf8' : '#e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {site.badge}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 📡 Regional Radar Network Presets */}
      <div style={{ marginTop: '8px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px 12px' }}>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
          📡 เลือกตามสถานีเรดาร์ตรวจฝนประจำภูมิภาค (Regional Weather Radars):
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {REGIONAL_RADAR_STATIONS.slice(0, 10).map((radar) => (
            <button
              key={radar.id}
              type="button"
              onClick={() => handleSelectRadarStation(radar)}
              disabled={disabled}
              className="preset-btn"
              style={{
                fontSize: '0.68rem',
                padding: '3px 8px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#cbd5e1',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              🛰️ {radar.nameTh.replace('สถานีเรดาร์ตรวจอากาศ', 'เรดาร์').replace('สถานีเรดาร์ตรวจฝน กทม.', 'เรดาร์ กทม.')}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Province Dropdown Selector */}
      <div className="location-selector__main-picker" style={{ marginTop: '10px' }}>
        <div className="location-dropdown-wrapper">
          <label htmlFor="province-scroll-select" className="location-dropdown-label">
            <span>📍 หรือเลื่อนเลือกจังหวัด (ครบ 77 จังหวัด):</span>
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
      </div>

      {/* 4. Instant Search Filter */}
      <div className="location-selector__search" style={{ marginTop: '8px' }}>
        <div className="location-search-input-wrap">
          <input
            type="text"
            className="location-search-input"
            placeholder="🔍 พิมพ์ค้นหาชื่อจังหวัด..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={disabled}
            aria-label="ค้นหาจังหวัด"
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

        {searchQuery && (
          <div className="location-search-results">
            {filteredProvinces.length === 0 ? (
              <p className="no-results-msg">ไม่พบจังหวัดที่ตรงกับ &quot;{searchQuery}&quot;</p>
            ) : (
              <div className="search-result-chips">
                {filteredProvinces.map((p) => (
                  <button
                    key={p.isoCode}
                    type="button"
                    className="search-chip"
                    onClick={() => {
                      handleSelectProvince(p);
                      setSearchQuery('');
                    }}
                    disabled={disabled}
                  >
                    📍 {p.nameTh} ({p.nameEn})
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Custom Coordinate Form (Expandable) */}
      <div className="location-selector__custom-toggle" style={{ marginTop: '8px' }}>
        <button
          type="button"
          className="btn-toggle-custom"
          onClick={() => setIsCustomExpanded(!isCustomExpanded)}
          aria-expanded={isCustomExpanded}
          style={{ fontSize: '0.72rem', color: '#94a3b8' }}
        >
          {isCustomExpanded ? '▼ ซ่อนการกรอกพิกัดละติจูด/ลองจิจูด' : '▶ ระบุพิกัดละติจูด/ลองจิจูดด้วยตนเอง'}
        </button>
      </div>

      {isCustomExpanded && (
        <form onSubmit={handleApplyCustom} className="location-custom-form" noValidate style={{ marginTop: '8px' }}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="custom-lat">ละติจูด (Latitude)</label>
              <input
                id="custom-lat"
                type="number"
                step="any"
                min="-90"
                max="90"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                disabled={disabled}
                placeholder="เช่น 13.6635"
              />
            </div>
            <div className="form-group">
              <label htmlFor="custom-lon">ลองจิจูด (Longitude)</label>
              <input
                id="custom-lon"
                type="number"
                step="any"
                min="-180"
                max="180"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                disabled={disabled}
                placeholder="เช่น 100.4124"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="custom-label">ชื่อสถานที่ / ป้ายกำกับ</label>
            <input
              id="custom-label"
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              disabled={disabled}
              placeholder="เช่น โรงงานเพชรสยาม บางบอน"
            />
          </div>

          {validationError && (
            <p className="form-error-msg" role="alert">
              ⚠️ {validationError}
            </p>
          )}

          <button type="submit" className="btn-apply-location" disabled={disabled} style={{ marginTop: '8px' }}>
            ยืนยันพิกัดที่กำหนดเอง
          </button>
        </form>
      )}
    </section>
  );
}
