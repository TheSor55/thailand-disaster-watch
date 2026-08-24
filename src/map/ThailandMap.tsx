import {
  Map as MapLibreMap,
  NavigationControl,
  Popup,
  ScaleControl,
  type FilterSpecification,
  type MapLayerMouseEvent,
  type MapSourceDataEvent,
} from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { PROVINCE_BY_ISO, REGION_BY_ID, type ProvinceDefinition } from '../config/regions';
import { featuresForIsoCodes, boundsForFeatures, type BoundaryFeatureCollection } from './boundary';
import { createMapStyle, PROVINCE_SOURCE_ID } from './mapStyle';

export type BasemapMode = 'standard' | 'dark';

interface ThailandMapProps {
  basemapMode: BasemapMode;
  selectedIsoCodes: readonly string[];
  selectedProvinceIso: string | null;
  showProvinces: boolean;
  onProvinceSelect: (province: ProvinceDefinition) => void;
}

interface MapErrorEvent {
  sourceId?: string;
  error?: Error;
}

interface MapStatusMessagesProps {
  mapReady: boolean;
  mapUnavailable: boolean;
  boundaryUnavailable: boolean;
}

export function MapStatusMessages({
  mapReady,
  mapUnavailable,
  boundaryUnavailable,
}: MapStatusMessagesProps) {
  return (
    <>
      {!mapReady && <div className="map-message" role="status">กำลังเตรียมแผนที่ประเทศไทย…</div>}
      {mapUnavailable && (
        <div className="map-message map-message--error" role="alert">
          MAP SERVICE TEMPORARILY UNAVAILABLE
        </div>
      )}
      {boundaryUnavailable && (
        <div className="map-message map-message--error" role="alert">
          ADMINISTRATIVE BOUNDARY UNAVAILABLE
        </div>
      )}
    </>
  );
}

export function ThailandMap({
  basemapMode,
  selectedIsoCodes,
  selectedProvinceIso,
  showProvinces,
  onProvinceSelect,
}: ThailandMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const hoveredFeatureId = useRef<string | number | null>(null);
  const provinceSelectRef = useRef(onProvinceSelect);
  const [boundaryData, setBoundaryData] = useState<BoundaryFeatureCollection | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const [boundaryUnavailable, setBoundaryUnavailable] = useState(false);

  useEffect(() => {
    provinceSelectRef.current = onProvinceSelect;
  }, [onProvinceSelect]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/thailand-provinces.geojson', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Boundary request failed: ${response.status}`);
        return response.json() as Promise<BoundaryFeatureCollection>;
      })
      .then((collection) => setBoundaryData(collection))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setBoundaryUnavailable(true);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: createMapStyle(),
      center: [100.7, 13.4],
      zoom: 4.55,
      minZoom: 3.5,
      maxZoom: 12,
      attributionControl: {},
    });
    mapRef.current = map;
    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left');

    const popup = new Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
      className: 'province-tooltip',
    });

    map.on('load', () => setMapReady(true));

    map.on('error', (event) => {
      const mapError = event as unknown as MapErrorEvent;
      if (mapError.sourceId === 'osm') setMapUnavailable(true);
      if (mapError.sourceId === PROVINCE_SOURCE_ID) setBoundaryUnavailable(true);
    });

    map.on('sourcedata', (event: MapSourceDataEvent) => {
      if (event.sourceId === PROVINCE_SOURCE_ID && event.isSourceLoaded) {
        setBoundaryUnavailable(false);
      }
    });

    map.on('mousemove', 'province-fill', (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature || feature.id === undefined) return;

      if (hoveredFeatureId.current !== null) {
        map.setFeatureState(
          { source: PROVINCE_SOURCE_ID, id: hoveredFeatureId.current },
          { hover: false },
        );
      }

      hoveredFeatureId.current = feature.id;
      map.setFeatureState(
        { source: PROVINCE_SOURCE_ID, id: feature.id },
        { hover: true },
      );
      map.getCanvas().style.cursor = 'pointer';

      const isoCode = String(feature.properties?.shapeISO ?? '');
      const province = PROVINCE_BY_ISO.get(isoCode);
      if (!province) return;
      const regionName = REGION_BY_ID.get(province.regionId)?.nameTh ?? 'ไม่ทราบภูมิภาค';

      popup
        .setLngLat(event.lngLat)
        .setHTML(
          `<strong>จังหวัด${province.nameTh}</strong><span>${province.nameEn} · ${regionName}</span><small>Live situation: Not connected</small>`,
        )
        .addTo(map);
    });

    map.on('mouseleave', 'province-fill', () => {
      if (hoveredFeatureId.current !== null) {
        map.setFeatureState(
          { source: PROVINCE_SOURCE_ID, id: hoveredFeatureId.current },
          { hover: false },
        );
      }
      hoveredFeatureId.current = null;
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    map.on('click', 'province-fill', (event: MapLayerMouseEvent) => {
      const isoCode = String(event.features?.[0]?.properties?.shapeISO ?? '');
      const province = PROVINCE_BY_ISO.get(isoCode);
      if (province) provinceSelectRef.current(province);
    });

    return () => {
      popup.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const isDark = basemapMode === 'dark';
    map.setPaintProperty('background', 'background-color', isDark ? '#07111f' : '#dbeafe');
    map.setPaintProperty('osm-basemap', 'raster-saturation', isDark ? -0.62 : -0.15);
    map.setPaintProperty('osm-basemap', 'raster-contrast', isDark ? 0.18 : 0.05);
    map.setPaintProperty('osm-basemap', 'raster-brightness-min', isDark ? 0.12 : 0.5);
    map.setPaintProperty('osm-basemap', 'raster-brightness-max', isDark ? 0.68 : 1);
  }, [basemapMode, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    map.setLayoutProperty('province-fill', 'visibility', showProvinces ? 'visible' : 'none');
    map.setLayoutProperty('province-boundary', 'visibility', showProvinces ? 'visible' : 'none');
    map.setLayoutProperty('province-region-highlight', 'visibility', showProvinces ? 'visible' : 'none');
    map.setLayoutProperty('province-selected-fill', 'visibility', showProvinces ? 'visible' : 'none');
  }, [mapReady, showProvinces]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const regionFilter: FilterSpecification = selectedIsoCodes.length
      ? ['in', ['get', 'shapeISO'], ['literal', [...selectedIsoCodes]]]
      : ['==', ['get', 'shapeISO'], ''];
    const provinceFilter: FilterSpecification = selectedProvinceIso
      ? ['==', ['get', 'shapeISO'], selectedProvinceIso]
      : ['==', ['get', 'shapeISO'], ''];
    map.setFilter('province-region-highlight', regionFilter);
    map.setFilter('province-selected-fill', provinceFilter);
    map.setFilter('province-selected', provinceFilter);
  }, [mapReady, selectedIsoCodes, selectedProvinceIso]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !boundaryData) return;
    const features = featuresForIsoCodes(boundaryData, selectedIsoCodes);
    const bounds = boundsForFeatures(features);
    if (!bounds) return;
    map.fitBounds(bounds, {
      padding: { top: 76, right: 56, bottom: 72, left: 56 },
      duration: 650,
      maxZoom: selectedProvinceIso ? 8.4 : 6.4,
    });
  }, [boundaryData, mapReady, selectedIsoCodes, selectedProvinceIso]);

  return (
    <section className="map-shell" aria-label="แผนที่จังหวัดประเทศไทย">
      <div ref={containerRef} className="map-canvas" />
      <MapStatusMessages mapReady={mapReady} mapUnavailable={mapUnavailable} boundaryUnavailable={boundaryUnavailable} />
      <div className="map-license-note">
        Boundary: geoBoundaries THA ADM1 · 77 provinces · not an official disaster jurisdiction
      </div>
    </section>
  );
}
