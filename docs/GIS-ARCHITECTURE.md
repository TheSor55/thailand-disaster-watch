# GIS architecture — PHASE 1

## Scope

PHASE 1 is a GIS navigation shell only. It renders a Thailand national extent and province boundaries, supports national/region/province/quick-view navigation, and exposes explicit no-data and failure states. It does not connect an external disaster, warning, CCTV, weather, river, dam, or forecast source.

## Client structure

```text
URL path
  -> domain/navigation.ts
  -> selected application region/province ISO codes
  -> ThailandMap.tsx
  -> MapLibre filters + local boundary fitBounds
```

- `src/config/regions.ts` owns the six replaceable application navigation groups and Bangkok Metropolitan Operational Quick View.
- `src/domain/navigation.ts` parses and generates deep links and breadcrumbs.
- `src/map/mapStyle.ts` owns source/layer IDs, raster attribution, and paint defaults.
- `src/map/ThailandMap.tsx` owns the MapLibre lifecycle, hover/click selection, filters, viewport fitting, controls, and source failure states.
- `src/types/gis.ts` defines the future `MapLayer` contract for GeoJSON, vector tile, raster, WMS, WMTS, TMS, STAC, and point sources. It does not activate any future source.

## Layers

1. `background`
2. `osm-basemap`
3. `province-fill`
4. `province-boundary`
5. `province-region-highlight`
6. `province-selected-fill`
7. `province-selected`

The local GeoJSON source is `thailand-provinces`. Its 77 province ISO codes are verified against the configuration in tests. Region grouping is an application navigation convenience, not an official government taxonomy or disaster jurisdiction.

## Failure behavior

- Basemap source error: show `MAP SERVICE TEMPORARILY UNAVAILABLE` while dashboard navigation stays interactive.
- Boundary fetch/source error: show `ADMINISTRATIVE BOUNDARY UNAVAILABLE` without crashing the rest of the application.
- Disaster modules: always show `No live data`, `Not connected`, or `DATA SOURCE NOT CONNECTED` in PHASE 1.

## Hosting and PWA readiness

`manifest.webmanifest` and a static-host SPA rewrite are included. This is PWA-ready structure, not an offline basemap: OpenStreetMap Standard tiles must not be bulk-downloaded or packaged offline. No service worker or offline disaster data is implemented.

## Production gate

Before production deployment, choose a basemap service or self-hosted architecture with adequate terms, capacity, monitoring, and availability. Live layers require the separate PHASE 2 audit and an `APPROVED` production license status.
