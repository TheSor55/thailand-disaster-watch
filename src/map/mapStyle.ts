import type { StyleSpecification } from 'maplibre-gl';

export const OSM_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>';

export const SATELLITE_ATTRIBUTION =
  'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

export const PROVINCE_SOURCE_ID = 'thailand-provinces';

export function createMapStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: OSM_ATTRIBUTION,
        maxzoom: 19,
      },
      satellite: {
        type: 'raster',
        tiles: [
          'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
        ],
        tileSize: 256,
        attribution: SATELLITE_ATTRIBUTION,
        maxzoom: 19,
      },
      [PROVINCE_SOURCE_ID]: {
        type: 'geojson',
        data: '/thailand-provinces.geojson',
        generateId: true,
        attribution:
          'geoBoundaries THA ADM1 · ODbL 1.0 · © OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': '#07111f' },
      },
      {
        id: 'osm-basemap',
        type: 'raster',
        source: 'osm',
        paint: {
          'raster-opacity': 0.72,
          'raster-saturation': -0.62,
          'raster-contrast': 0.18,
          'raster-brightness-min': 0.12,
          'raster-brightness-max': 0.68,
        },
      },
      {
        id: 'satellite-basemap',
        type: 'raster',
        source: 'satellite',
        layout: { visibility: 'none' },
        paint: {
          'raster-opacity': 0.95,
        },
      },
      {
        id: 'province-fill',
        type: 'fill',
        source: PROVINCE_SOURCE_ID,
        paint: {
          'fill-color': '#1d4ed8',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.34,
            0.1,
          ],
        },
      },
      {
        id: 'province-boundary',
        type: 'line',
        source: PROVINCE_SOURCE_ID,
        paint: {
          'line-color': '#7dd3fc',
          'line-opacity': 0.72,
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.7, 8, 1.5],
        },
      },
      {
        id: 'province-region-highlight',
        type: 'fill',
        source: PROVINCE_SOURCE_ID,
        filter: ['==', ['get', 'shapeISO'], ''],
        paint: {
          'fill-color': '#0891b2',
          'fill-opacity': 0.28,
        },
      },
      {
        id: 'province-selected-fill',
        type: 'fill',
        source: PROVINCE_SOURCE_ID,
        filter: ['==', ['get', 'shapeISO'], ''],
        paint: {
          'fill-color': '#22d3ee',
          'fill-opacity': 0.42,
        },
      },
      {
        id: 'province-selected',
        type: 'line',
        source: PROVINCE_SOURCE_ID,
        filter: ['==', ['get', 'shapeISO'], ''],
        paint: {
          'line-color': '#f8fafc',
          'line-width': 3,
        },
      },
    ],
  };
}
