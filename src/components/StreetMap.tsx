import { useEffect, useRef, useCallback, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { segments, getSegmentScore, getScoreColor, getScoreForCategory, getScoreLabel, getSegmentLabel, type CategoryKey } from '@/data/streetData';
import { AMENITIES, type PlacedAmenity } from '@/data/amenities';
import { SIGNAGE_POINTS, SIGNAGE_CATEGORIES, getSignageBySegment, type SignagePoint } from '@/data/signageData';

interface StreetMapProps {
  category: CategoryKey;
  highlightedSegment: string | null;
  onSegmentClick: (code: string | null) => void;
  placedAmenities: PlacedAmenity[];
  activeAmenity: string | null;
  onPlaceAmenity: (latlng: [number, number]) => void;
  showSignage: boolean;
  is3D: boolean;
}

const StreetMap = ({ category, highlightedSegment, onSegmentClick, placedAmenities, activeAmenity, onPlaceAmenity, showSignage, is3D }: StreetMapProps) => {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const signageMarkersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const activeAmenityRef = useRef(activeAmenity);
  activeAmenityRef.current = activeAmenity;
  const onPlaceRef = useRef(onPlaceAmenity);
  onPlaceRef.current = onPlaceAmenity;
  const onSegmentClickRef = useRef(onSegmentClick);
  onSegmentClickRef.current = onSegmentClick;
  const categoryRef = useRef(category);
  categoryRef.current = category;
  const highlightedRef = useRef(highlightedSegment);
  highlightedRef.current = highlightedSegment;

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png', 'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
          },
          'openmaptiles': {
            type: 'vector',
            url: 'https://api.maptiler.com/tiles/v3/tiles.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
            // Using OSM buildings as fallback
          },
        },
        layers: [
          { id: 'background', type: 'background', paint: { 'background-color': '#0a0a0a' } },
          { id: 'carto-dark', type: 'raster', source: 'carto-dark', minzoom: 0, maxzoom: 20 },
        ],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      },
      center: [83.008, 25.310],
      zoom: 16,
      pitch: 0,
      bearing: 0,
      maxPitch: 85,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');

    map.on('load', () => {
      // Add 3D buildings from OpenStreetMap via Overpass (using a vector tile source)
      // We'll use the OSM Buildings approach with a simple extrusion
      addBuildingsSource(map);
      addSegmentSources(map);
    });

    map.on('click', (e) => {
      if (activeAmenityRef.current) {
        onPlaceRef.current([e.lngLat.lat, e.lngLat.lng]);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Toggle 3D
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    
    map.easeTo({
      pitch: is3D ? 60 : 0,
      bearing: is3D ? -17 : 0,
      duration: 1000,
    });

    // Toggle building layer visibility
    if (map.getLayer('3d-buildings')) {
      map.setLayoutProperty('3d-buildings', 'visibility', is3D ? 'visible' : 'none');
    }
  }, [is3D]);

  // Update segment styles
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    Object.keys(segments).forEach(code => {
      const layerId = `segment-${code}`;
      if (!map.getLayer(layerId)) return;

      const scoreData = getSegmentScore(code);
      if (!scoreData) return;

      const value = getScoreForCategory(scoreData, category);
      const color = getScoreColor(value);
      const isHighlighted = highlightedSegment === code;

      map.setPaintProperty(layerId, 'line-color', color);
      map.setPaintProperty(layerId, 'line-width', isHighlighted ? 7 : 4);
      map.setPaintProperty(layerId, 'line-opacity', highlightedSegment && !isHighlighted ? 0.3 : 0.9);
    });
  }, [category, highlightedSegment]);

  // Update amenity markers
  useEffect(() => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const map = mapRef.current;
    if (!map) return;

    placedAmenities.forEach(p => {
      const def = AMENITIES.find(a => a.id === p.amenityId);
      if (!def) return;

      const el = document.createElement('div');
      el.style.cssText = 'font-size:20px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));cursor:pointer;text-align:center;line-height:1';
      el.textContent = def.icon;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.latlng[1], p.latlng[0]])
        .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(`<div style="font-size:12px">${def.icon} ${def.label}</div>`))
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [placedAmenities]);

  // Update signage markers
  useEffect(() => {
    signageMarkersRef.current.forEach(m => m.remove());
    signageMarkersRef.current = [];
    const map = mapRef.current;
    if (!map || !showSignage) return;

    SIGNAGE_POINTS.forEach(sp => {
      const catInfo = SIGNAGE_CATEGORIES[sp.category] || SIGNAGE_CATEGORIES.T1;
      const el = document.createElement('div');
      el.style.cssText = `
        width: 24px; height: 24px; border-radius: 50%;
        background: ${catInfo.color}; border: 2px solid white;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; color: white; font-weight: bold;
        cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      `;
      el.textContent = sp.category === 'INFO' ? 'i' : sp.category.charAt(1);

      const phaseLabel = sp.phase === 0 ? 'Info Board' : `Phase ${sp.phase}`;
      const nameLabel = sp.name ? `<br/><b>${sp.name}</b>` : '';
      const popup = new maplibregl.Popup({ offset: 14 }).setHTML(`
        <div style="font-size:12px;font-family:system-ui">
          <b>${catInfo.label} Signage</b>${nameLabel}
          <div style="color:#999;margin-top:2px">${phaseLabel} • ${sp.id}</div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([sp.lng, sp.lat])
        .setPopup(popup)
        .addTo(map);
      signageMarkersRef.current.push(marker);
    });
  }, [showSignage]);

  // Cursor for placing amenities
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.style.cursor = activeAmenity ? 'crosshair' : '';
  }, [activeAmenity]);

  return <div ref={containerRef} className="w-full h-full rounded-lg" />;
};

function addBuildingsSource(map: maplibregl.Map) {
  // Use OpenMapTiles vector tiles for 3D buildings
  if (!map.getSource('osm-buildings')) {
    map.addSource('osm-buildings', {
      type: 'vector',
      tiles: ['https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=get_your_own_OpIi9ZULNHzrESv6T2vL'],
      maxzoom: 14,
    });
  }

  // Use Overpass-derived GeoJSON as fallback: query building footprints
  // For now, use a simple procedural approach with OpenFreeMap
  if (!map.getSource('ofm-buildings')) {
    map.addSource('ofm-buildings', {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet',
    });
  }

  map.addLayer({
    id: '3d-buildings',
    source: 'ofm-buildings',
    'source-layer': 'building',
    type: 'fill-extrusion',
    minzoom: 14,
    paint: {
      'fill-extrusion-color': '#1a1a2e',
      'fill-extrusion-height': [
        'interpolate', ['linear'], ['zoom'],
        14, 0,
        15, ['coalesce', ['get', 'render_height'], 10],
      ],
      'fill-extrusion-base': 0,
      'fill-extrusion-opacity': 0.7,
    },
    layout: {
      visibility: 'none', // Start in 2D
    },
  });
}

function addSegmentSources(map: maplibregl.Map) {
  Object.entries(segments).forEach(([code, geos]) => {
    const sourceId = `segment-src-${code}`;
    const layerId = `segment-${code}`;

    const features = geos.map(geo => ({
      type: 'Feature' as const,
      properties: { code },
      geometry: {
        type: 'LineString' as const,
        coordinates: geo.coordinates,
      },
    }));

    map.addSource(sourceId, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features },
    });

    const scoreData = getSegmentScore(code);
    const value = scoreData ? getScoreForCategory(scoreData, 'index') : 0;
    const color = getScoreColor(value);

    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': color,
        'line-width': 4,
        'line-opacity': 0.9,
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    });

    // Click handler
    map.on('click', layerId, (e) => {
      e.originalEvent.stopPropagation();
      onSegmentClickHandler(map, code);
    });

    // Hover tooltip
    map.on('mouseenter', layerId, (e) => {
      map.getCanvas().style.cursor = 'pointer';
      if (!scoreData) return;
      const label = getSegmentLabel(code);
      const val = getScoreForCategory(scoreData, categoryRef_global || 'index');
      const col = getScoreColor(val);

      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 10 })
        .setLngLat(e.lngLat)
        .setHTML(`
          <div style="font-family:system-ui;text-align:center">
            <strong style="font-size:13px">${label}</strong>
            <div style="margin:4px 0;font-size:18px;font-weight:700;color:${col}">${val.toFixed(1)}</div>
            <div style="font-size:10px;color:#999">Click for details</div>
          </div>
        `)
        .addTo(map);
      currentTooltip = popup;
    });

    map.on('mouseleave', layerId, () => {
      map.getCanvas().style.cursor = '';
      if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
      }
    });
  });
}

let currentTooltip: maplibregl.Popup | null = null;
let categoryRef_global: CategoryKey = 'index';
let onSegmentClickRef_global: ((code: string | null) => void) | null = null;

function onSegmentClickHandler(map: maplibregl.Map, code: string) {
  if (onSegmentClickRef_global) {
    onSegmentClickRef_global(code);
  }

  const scoreData = getSegmentScore(code);
  if (!scoreData) return;
  const label = getSegmentLabel(code);
  const value = getScoreForCategory(scoreData, categoryRef_global);
  const color = getScoreColor(value);

  // Find center of segment
  const geos = segments[code];
  if (!geos || geos.length === 0) return;
  const allCoords = geos.flatMap(g => g.coordinates);
  const avgLng = allCoords.reduce((s, c) => s + c[0], 0) / allCoords.length;
  const avgLat = allCoords.reduce((s, c) => s + c[1], 0) / allCoords.length;

  new maplibregl.Popup({ offset: 10 })
    .setLngLat([avgLng, avgLat])
    .setHTML(`
      <div style="font-family:system-ui;min-width:180px">
        <strong style="font-size:14px">${label}</strong>
        <div style="margin-top:6px;display:grid;grid-template-columns:1fr 1fr;gap:2px 8px;font-size:12px">
          <span style="color:#999">Index</span><span><b>${scoreData.index}</b></span>
          <span style="color:#999">Walkability</span><span>${scoreData.walkability}</span>
          <span style="color:#999">Lighting</span><span>${scoreData.lighting}</span>
          <span style="color:#999">Transport</span><span>${scoreData.transport}</span>
          <span style="color:#999">Visibility</span><span>${scoreData.visibility}</span>
          <span style="color:#999">Accessibility</span><span>${scoreData.accessibility}</span>
          <span style="color:#999">Road Safety</span><span>${scoreData.roadSafety}</span>
        </div>
        <div style="margin-top:6px;padding:4px 8px;border-radius:4px;background:${color}20;color:${color};font-weight:600;text-align:center;font-size:12px">
          ${getScoreLabel(value)} — ${value.toFixed(1)}
        </div>
      </div>
    `)
    .addTo(map);
}

// We need to sync the global refs - this is a workaround for the closure issue
// The proper way would be to use a more complex event system
export function syncMapRefs(category: CategoryKey, onSegmentClick: (code: string | null) => void) {
  categoryRef_global = category;
  onSegmentClickRef_global = onSegmentClick;
}

export default StreetMap;
