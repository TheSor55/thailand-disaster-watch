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
import { GISTDA_FLOOD_GEOJSON } from '../domain/flood';

export type BasemapMode = 'standard' | 'dark';

interface ThailandMapProps {
  basemapMode: BasemapMode;
  selectedIsoCodes: readonly string[];
  selectedProvinceIso: string | null;
  showProvinces: boolean;
  onProvinceSelect: (province: ProvinceDefinition) => void;
  showRadar?: boolean;
  radarTileUrl?: string | null;
  radarOpacity?: number;
  showFlood?: boolean;
}

interface MapErrorEvent {
  sourceId?: string;
  error?: unknown;
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
          PROVINCE BOUNDARY LAYER UNAVAILABLE
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
  showRadar = false,
  radarTileUrl = null,
  radarOpacity = 0.7,
  showFlood = false,
}: ThailandMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const [boundaryUnavailable, setBoundaryUnavailable] = useState(false);
  const [boundaryData, setBoundaryData] = useState<BoundaryFeatureCollection | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const map = new MapLibreMap({
        container: containerRef.current,
        style: createMapStyle(),
        bounds: [
          [97.3437, 5.613],
          [105.637, 20.4649],
        ],
        fitBoundsOptions: { padding: 48 },
        attributionControl: { compact: true },
        maxZoom: 18,
        minZoom: 4,
      });

      map.addControl(new NavigationControl({ visualizePitch: false }), 'top-right');
      map.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left');

      const handleSourceData = (event: MapSourceDataEvent) => {
        if (
          event.sourceId === PROVINCE_SOURCE_ID &&
          event.isSourceLoaded &&
          !boundaryData
        ) {
          const source = map.getSource(PROVINCE_SOURCE_ID);
          if (source && 'serialize' in source) {
            const rawData = (source as { serialize: () => { data?: unknown } }).serialize();
            if (rawData && typeof rawData === 'object' && 'data' in rawData) {
              const data = rawData.data;
              if (data && typeof data === 'object' && 'features' in data) {
                setBoundaryData(data as BoundaryFeatureCollection);
              }
            }
          }
        }
      };

      const handleLoad = () => {
        setMapReady(true);
        setMapUnavailable(false);
        fetch('/thailand-provinces.geojson')
          .then((res) => (res.ok ? res.json() : null))
          .then((data: BoundaryFeatureCollection | null) => {
            if (data) setBoundaryData(data);
          })
          .catch(() => {
            /* ignore fallback fetch error */
          });
      };

      const handleError = (event: MapErrorEvent) => {
        if (event.sourceId === 'osm') {
          setMapUnavailable(true);
        }
        if (event.sourceId === PROVINCE_SOURCE_ID) {
          setBoundaryUnavailable(true);
        }
      };

      const handleProvinceClick = (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (!feature) return;
        const iso = feature.properties?.shapeISO as string | undefined;
        if (!iso) return;
        const province = PROVINCE_BY_ISO.get(iso);
        if (province) {
          onProvinceSelect(province);
        }
      };

      const handleProvinceHover = (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (!feature) return;
        const iso = feature.properties?.shapeISO as string | undefined;
        if (!iso) return;
        const province = PROVINCE_BY_ISO.get(iso);
        if (!province) return;

        const region = REGION_BY_ID.get(province.regionId);
        map.getCanvas().style.cursor = 'pointer';

        if (!popupRef.current) {
          popupRef.current = new Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'map-province-tooltip',
          });
        }

        popupRef.current
          .setLngLat(event.lngLat)
          .setHTML(
            `<div class="map-tooltip">
              <strong>${province.nameTh}</strong>
              <span>${province.nameEn}</span>
              <small>${region?.nameTh ?? ''}</small>
            </div>`,
          )
          .addTo(map);
      };

      const handleProvinceLeave = () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      };

      map.on('load', handleLoad);
      map.on('error', handleError);
      map.on('sourcedata', handleSourceData);
      map.on('click', 'province-fill', handleProvinceClick);
      map.on('mousemove', 'province-fill', handleProvinceHover);
      map.on('mouseleave', 'province-fill', handleProvinceLeave);

      mapRef.current = map;
    } catch {
      queueMicrotask(() => setMapUnavailable(true));
    }

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapReady(false);
    };
  }, [onProvinceSelect, boundaryData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const isDark = basemapMode === 'dark';
    map.setPaintProperty('background', 'background-color', isDark ? '#07111f' : '#f1f5f9');
    map.setPaintProperty('osm-basemap', 'raster-opacity', isDark ? 0.72 : 0.88);
    map.setPaintProperty('osm-basemap', 'raster-saturation', isDark ? -0.62 : 0);
    map.setPaintProperty('osm-basemap', 'raster-contrast', isDark ? 0.18 : 0);
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

  // Radar raster layer handling
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const sourceId = 'radar-raster-source';
    const layerId = 'radar-raster-layer';

    if (!showRadar || !radarTileUrl) {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'none');
      }
      return;
    }

    try {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      map.addSource(sourceId, {
        type: 'raster',
        tiles: [radarTileUrl],
        tileSize: 256,
        maxzoom: 12,
        attribution: 'Weather radar data by RainViewer',
      });

      const beforeLayer = map.getLayer('province-boundary') ? 'province-boundary' : undefined;
      map.addLayer(
        {
          id: layerId,
          type: 'raster',
          source: sourceId,
          layout: { visibility: 'visible' },
          paint: {
            'raster-opacity': radarOpacity,
            'raster-fade-duration': 150,
          },
        },
        beforeLayer,
      );
    } catch {
      /* MapLibre source swap error recovery */
    }
  }, [mapReady, showRadar, radarTileUrl, radarOpacity]);

  // GISTDA Satellite Flood layer handling
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const sourceId = 'gistda-flood-source';
    const fillLayerId = 'gistda-flood-fill';
    const lineLayerId = 'gistda-flood-line';

    if (!showFlood) {
      if (map.getLayer(fillLayerId)) map.setLayoutProperty(fillLayerId, 'visibility', 'none');
      if (map.getLayer(lineLayerId)) map.setLayoutProperty(lineLayerId, 'visibility', 'none');
      return;
    }

    try {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: GISTDA_FLOOD_GEOJSON,
          attribution: 'GISTDA Satellite Flood Inundation (Sentinel-1 SAR)',
        });
      }

      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: 'fill',
          source: sourceId,
          layout: { visibility: 'visible' },
          paint: {
            'fill-color': '#06b6d4',
            'fill-opacity': 0.45,
          },
        });
      } else {
        map.setLayoutProperty(fillLayerId, 'visibility', 'visible');
      }

      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: 'line',
          source: sourceId,
          layout: { visibility: 'visible' },
          paint: {
            'line-color': '#22d3ee',
            'line-width': 2,
            'line-opacity': 0.85,
          },
        });
      } else {
        map.setLayoutProperty(lineLayerId, 'visibility', 'visible');
      }
    } catch {
      /* ignore layer add error */
    }
  }, [mapReady, showFlood]);

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
