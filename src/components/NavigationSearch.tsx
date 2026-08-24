import { useMemo, useState } from 'react';
import {
  PROVINCES,
  REGIONS,
  type ProvinceDefinition,
  type RegionDefinition,
} from '../config/regions';

interface NavigationSearchProps {
  visibleProvinceIsoCodes?: readonly string[];
  onProvinceSelect: (province: ProvinceDefinition) => void;
  onRegionSelect: (region: RegionDefinition) => void;
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase('th-TH');
}

export function NavigationSearch({
  visibleProvinceIsoCodes = [],
  onProvinceSelect,
  onRegionSelect,
}: NavigationSearchProps) {
  const [query, setQuery] = useState('');
  const normalizedQuery = normalize(query);

  const regionMatches = useMemo(
    () =>
      normalizedQuery
        ? REGIONS.filter((region) =>
            normalize(`${region.nameTh} ${region.nameEn} ${region.shortLabel}`).includes(
              normalizedQuery,
            ),
          )
        : [],
    [normalizedQuery],
  );

  const provinceMatches = useMemo(() => {
    if (normalizedQuery) {
      return PROVINCES.filter((province) =>
        normalize(`${province.nameTh} ${province.nameEn} ${province.slug}`).includes(
          normalizedQuery,
        ),
      ).slice(0, 12);
    }
    const visible = new Set(visibleProvinceIsoCodes);
    return PROVINCES.filter((province) => visible.has(province.isoCode));
  }, [normalizedQuery, visibleProvinceIsoCodes]);

  const hasResults = regionMatches.length > 0 || provinceMatches.length > 0;

  return (
    <div className="navigation-search">
      <label htmlFor="location-search">ค้นหาจังหวัดหรือ Region</label>
      <div className="search-input-wrap">
        <span aria-hidden="true">⌕</span>
        <input
          id="location-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="เช่น เชียงใหม่, ภาคกลาง"
          autoComplete="off"
        />
      </div>
      {(normalizedQuery || visibleProvinceIsoCodes.length > 0) && (
        <div className="search-results" aria-live="polite">
          {regionMatches.map((region) => (
            <button key={region.id} type="button" onClick={() => onRegionSelect(region)}>
              <span>{region.nameTh}</span><small>{region.nameEn} region</small>
            </button>
          ))}
          {provinceMatches.map((province) => (
            <button key={province.isoCode} type="button" onClick={() => onProvinceSelect(province)}>
              <span>{province.nameTh}</span><small>{province.nameEn}</small>
            </button>
          ))}
          {!hasResults && normalizedQuery && <p>ไม่พบพื้นที่ที่ค้นหา</p>}
        </div>
      )}
    </div>
  );
}
