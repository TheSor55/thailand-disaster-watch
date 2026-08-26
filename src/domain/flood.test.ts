import { describe, it, expect } from 'vitest';
import { GISTDA_FLOOD_GEOJSON, SATELLITE_FLOOD_SUMMARY } from './flood';

describe('GISTDA Satellite Flood Model (v1.2)', () => {
  it('contains valid GeoJSON FeatureCollection of flood polygons', () => {
    expect(GISTDA_FLOOD_GEOJSON.type).toBe('FeatureCollection');
    expect(GISTDA_FLOOD_GEOJSON.features.length).toBeGreaterThan(0);

    for (const feature of GISTDA_FLOOD_GEOJSON.features) {
      expect(feature.geometry.type).toBe('Polygon');
      expect(feature.geometry.coordinates.length).toBeGreaterThan(0);
      expect(feature.properties?.name).toBeTruthy();
      expect(feature.properties?.province).toBeTruthy();
      expect(feature.properties?.areaRai).toBeGreaterThan(0);
    }
  });

  it('contains valid GISTDA attribution and summary statistics', () => {
    expect(SATELLITE_FLOOD_SUMMARY.provider).toContain('GISTDA');
    expect(SATELLITE_FLOOD_SUMMARY.totalFloodedAreaRai).toBeGreaterThan(0);
    expect(SATELLITE_FLOOD_SUMMARY.attribution).toBeTruthy();
  });
});
