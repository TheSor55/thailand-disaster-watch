import { describe, expect, it } from 'vitest';
import { createMapStyle, OSM_ATTRIBUTION, PROVINCE_SOURCE_ID } from './mapStyle';

describe('MapLibre style contract', () => {
  it('declares traceable basemap and administrative sources', () => {
    const style = createMapStyle();
    expect(style.sources).toHaveProperty('osm');
    expect(style.sources).toHaveProperty(PROVINCE_SOURCE_ID);
    expect(JSON.stringify(style.sources.osm)).toContain('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
    expect(OSM_ATTRIBUTION).toContain('OpenStreetMap contributors');
    expect(style.layers.map(({ id }) => id)).toEqual(expect.arrayContaining(['province-fill', 'province-boundary', 'province-selected']));
  });
});
