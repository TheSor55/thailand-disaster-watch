export type MapLayerType =
  | 'geojson'
  | 'vector'
  | 'raster'
  | 'wms'
  | 'wmts'
  | 'tms'
  | 'stac'
  | 'points';

export type MapLayerAvailability =
  | 'available'
  | 'not-connected'
  | 'coming-later'
  | 'unavailable';

export interface MapLayer {
  id: string;
  name: string;
  category: 'base-map' | 'administrative' | 'disaster';
  source: string;
  type: MapLayerType;
  enabled: boolean;
  availability: MapLayerAvailability;
  attribution: string;
  lastUpdated: string | null;
}
