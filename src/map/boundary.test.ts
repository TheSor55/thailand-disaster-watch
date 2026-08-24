import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PROVINCES } from '../config/regions';
import { boundsForFeatures, featuresForIsoCodes, type BoundaryFeatureCollection } from './boundary';

describe('administrative boundary utilities', () => {
  it('calculates nested polygon bounds', () => {
    const feature = { type: 'Feature', properties: { shapeName: 'X', shapeISO: 'TH-00', shapeID: 'x', shapeGroup: 'THA', shapeType: 'ADM1' }, geometry: { type: 'Polygon', coordinates: [[[99, 10], [102, 12], [100, 14]]] } } as const;
    expect(boundsForFeatures([feature])).toEqual([[99, 10], [102, 14]]);
  });

  it('contains one mapped feature for each of 77 configured provinces', async () => {
    const text = await readFile(resolve(process.cwd(), 'public/thailand-provinces.geojson'), 'utf8');
    const collection = JSON.parse(text) as BoundaryFeatureCollection;
    expect(collection.features).toHaveLength(77);
    expect(new Set(collection.features.map(({ properties }) => properties.shapeISO))).toEqual(new Set(PROVINCES.map(({ isoCode }) => isoCode)));
    expect(featuresForIsoCodes(collection, ['TH-10'])).toHaveLength(1);
  });
});
