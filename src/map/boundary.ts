import type { LngLatBoundsLike } from 'maplibre-gl';

export interface BoundaryFeature {
  type: 'Feature';
  properties: {
    shapeName: string;
    shapeISO: string;
    shapeID: string;
    shapeGroup: string;
    shapeType: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: unknown;
  };
}

export interface BoundaryFeatureCollection {
  type: 'FeatureCollection';
  features: BoundaryFeature[];
}

function visitCoordinates(
  coordinates: unknown,
  visit: (longitude: number, latitude: number) => void,
) {
  if (!Array.isArray(coordinates)) return;

  if (
    coordinates.length >= 2 &&
    typeof coordinates[0] === 'number' &&
    typeof coordinates[1] === 'number'
  ) {
    visit(coordinates[0], coordinates[1]);
    return;
  }

  coordinates.forEach((item) => visitCoordinates(item, visit));
}

export function boundsForFeatures(
  features: readonly BoundaryFeature[],
): LngLatBoundsLike | null {
  let west = Number.POSITIVE_INFINITY;
  let south = Number.POSITIVE_INFINITY;
  let east = Number.NEGATIVE_INFINITY;
  let north = Number.NEGATIVE_INFINITY;

  features.forEach((feature) => {
    visitCoordinates(feature.geometry.coordinates, (longitude, latitude) => {
      west = Math.min(west, longitude);
      south = Math.min(south, latitude);
      east = Math.max(east, longitude);
      north = Math.max(north, latitude);
    });
  });

  if (![west, south, east, north].every(Number.isFinite)) return null;
  return [
    [west, south],
    [east, north],
  ];
}

export function featuresForIsoCodes(
  collection: BoundaryFeatureCollection,
  isoCodes: readonly string[],
): BoundaryFeature[] {
  if (isoCodes.length === 0) return collection.features;
  const requested = new Set(isoCodes);
  return collection.features.filter((feature) =>
    requested.has(feature.properties.shapeISO),
  );
}
