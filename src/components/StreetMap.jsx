import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { segments, getSegmentScore, getScoreColor, getScoreForCategory, getScoreLabel, getSegmentLabel } from '@/data/streetData';
import { AMENITIES } from '@/data/amenities';
import { SIGNAGE_POINTS, SIGNAGE_CATEGORIES } from '@/data/signageData';

const StreetMap = ({ category, highlightedSegment, onSegmentClick, placedAmenities, activeAmenity, onPlaceAmenity, showSignage, signageQuarter, is3D, criticalOnly, popupSegment }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const signageMarkersRef = useRef([]);
  const tooltipRef = useRef(null);
  const readyRef = useRef(false);

  // Stable refs for callbacks used inside map events
  const stableRefs = useRef({ category, highlightedSegment, onSegmentClick, activeAmenity, onPlaceAmenity });
  stableRefs.current = { category, highlightedSegment, onSegmentClick, activeAmenity, onPlaceAmenity };

  // Buffer constant (meters)
  const BUFFER_METERS = 20;

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; OSM &copy; CARTO',
          },
        },
        layers: [
          { id: 'bg', type: 'background', paint: { 'background-color': '#0a0a0a' } },
          { id: 'carto', type: 'raster', source: 'carto-dark' },
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
      // Buildings source (OpenFreeMap)
      map.addSource('ofm', { type: 'vector', url: 'https://tiles.openfreemap.org/planet' });
      map.addLayer({
        id: '3d-buildings',
        source: 'ofm',
        'source-layer': 'building',
        type: 'fill-extrusion',
        minzoom: 14,
        paint: {
          'fill-extrusion-color': '#1a1a2e',
          'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 10],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.7,
        },
        layout: { visibility: 'none' },
      });

      // Add segment line sources + layers
      Object.entries(segments).forEach(([code, geos]) => {
        const features = geos.map(geo => ({
          type: 'Feature',
          properties: { code },
          geometry: { type: 'LineString', coordinates: geo.coordinates },
        }));

        map.addSource(`seg-${code}`, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features },
        });

        const sd = getSegmentScore(code);
        const v = sd ? getScoreForCategory(sd, 'index') : 0;

        map.addLayer({
          id: `seg-${code}`,
          type: 'line',
          source: `seg-${code}`,
          paint: { 'line-color': getScoreColor(v), 'line-width': 4, 'line-opacity': 0.9 },
          layout: { 'line-cap': 'round', 'line-join': 'round' },
        });

        map.on('click', `seg-${code}`, (e) => {
          e.originalEvent.stopPropagation();
          stableRefs.current.onSegmentClick(code);
          showSegmentPopup(map, code);
        });

        map.on('mouseenter', `seg-${code}`, (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const sd2 = getSegmentScore(code);
          if (!sd2) return;
          const cat = stableRefs.current.category;
          const val = getScoreForCategory(sd2, cat);
          const col = getScoreColor(val);
          tooltipRef.current?.remove();
          tooltipRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 10 })
            .setLngLat(e.lngLat)
            .setHTML(`<div style="font-family:system-ui;text-align:center"><strong>${getSegmentLabel(code)}</strong><div style="margin:4px 0;font-size:18px;font-weight:700;color:${col}">${val.toFixed(1)}</div><div style="font-size:10px;color:#999">Click for details</div></div>`)
            .addTo(map);
        });

        map.on('mouseleave', `seg-${code}`, () => {
          map.getCanvas().style.cursor = '';
          tooltipRef.current?.remove();
          tooltipRef.current = null;
        });
      });

      readyRef.current = true;
    });

    map.on('click', (e) => {
      if (stableRefs.current.activeAmenity) {
        const hl = stableRefs.current.highlightedSegment;
        if (!hl) return;
        const geos = segments[hl];
        if (!geos) return;
        const lng = e.lngLat.lng;
        const lat = e.lngLat.lat;
        let minD = Infinity;
        geos.forEach(g => {
          const coords = g.coordinates;
          for (let i = 0; i < coords.length - 1; i++) {
            const d = distToSegmentMeters(lat, lng, coords[i][1], coords[i][0], coords[i + 1][1], coords[i + 1][0]);
            if (d < minD) minD = d;
          }
        });
        if (minD <= BUFFER_METERS) {
          stableRefs.current.onPlaceAmenity([lat, lng]);
        }
      }
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // 3D toggle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ pitch: is3D ? 60 : 0, bearing: is3D ? -17 : 0, duration: 1000 });
    if (readyRef.current && map.getLayer('3d-buildings')) {
      map.setLayoutProperty('3d-buildings', 'visibility', is3D ? 'visible' : 'none');
    }
  }, [is3D]);

  // Update segment paint on category/highlight/criticalOnly change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;

    Object.keys(segments).forEach(code => {
      const lid = `seg-${code}`;
      if (!map.getLayer(lid)) return;
      const sd = getSegmentScore(code);
      if (!sd) return;
      const v = getScoreForCategory(sd, category);
      const col = getScoreColor(v);
      const hl = highlightedSegment === code;
      const isCritical = v <= 20;
      const dimmedByCritical = criticalOnly && !isCritical;
      const dimmedByHighlight = highlightedSegment && !hl;
      const dimmed = dimmedByCritical || dimmedByHighlight;
      map.setPaintProperty(lid, 'line-color', col);
      map.setPaintProperty(lid, 'line-width', hl ? 7 : (criticalOnly && isCritical ? 6 : 4));
      map.setPaintProperty(lid, 'line-opacity', dimmed ? 0.15 : 0.95);
    });
  }, [category, highlightedSegment, criticalOnly]);

  // External popup trigger (e.g., clicking a row in the segments table)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current || !popupSegment) return;
    const code = String(popupSegment).includes(':') ? String(popupSegment).split(':').slice(1).join(':') : popupSegment;
    showSegmentPopup(map, code);
  }, [popupSegment]);

  // Amenity markers
  useEffect(() => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const map = mapRef.current;
    if (!map) return;

    placedAmenities.forEach(p => {
      const def = AMENITIES.find(a => a.id === p.amenityId);
      if (!def) return;
      const el = document.createElement('div');
      el.style.cssText = 'font-size:20px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));cursor:pointer;text-align:center;line-height:1';
      el.textContent = def.icon;
      const m = new maplibregl.Marker({ element: el })
        .setLngLat([p.latlng[1], p.latlng[0]])
        .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(`<div style="font-size:12px">${def.icon} ${def.label}</div>`))
        .addTo(map);
      markersRef.current.push(m);
    });
  }, [placedAmenities]);

  // Signage markers
  useEffect(() => {
    signageMarkersRef.current.forEach(m => m.remove());
    signageMarkersRef.current = [];
    const map = mapRef.current;
    if (!map || !showSignage) return;

    SIGNAGE_POINTS.filter(sp => sp.quarter === signageQuarter).forEach(sp => {
      const catInfo = SIGNAGE_CATEGORIES[sp.category];
      if (!catInfo) return;
      const el = document.createElement('div');
      el.style.cssText = `width:26px;height:26px;border-radius:50%;background:${catInfo.color};border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.5)`;
      el.textContent = catInfo.icon;

      const subLabel = sp.subcategory ? ` (${sp.subcategory})` : '';
      const nameLabel = sp.name ? `<br/><b>${sp.name}</b>` : '';
      const popup = new maplibregl.Popup({ offset: 14, className: 'nc-popup' }).setHTML(
        `<div style="font-size:12px;font-family:system-ui;color:#e5e5e5"><b style="color:#fff">${catInfo.label}${subLabel}</b>${nameLabel}<div style="color:#888;margin-top:2px">Q${sp.quarter} • ${sp.id}</div></div>`
      );

      const m = new maplibregl.Marker({ element: el }).setLngLat([sp.lng, sp.lat]).setPopup(popup).addTo(map);
      signageMarkersRef.current.push(m);
    });
  }, [showSignage, signageQuarter]);

  // Cursor
  useEffect(() => {
    if (containerRef.current) containerRef.current.style.cursor = activeAmenity ? 'crosshair' : '';
  }, [activeAmenity]);

  return <div ref={containerRef} className="w-full h-full rounded-lg" />;
};

function showSegmentPopup(map, code) {
  const sd = getSegmentScore(code);
  if (!sd) return;
  const label = getSegmentLabel(code);
  const color = getScoreColor(sd.index);
  const geos = segments[code];
  if (!geos?.length) return;
  const all = geos.flatMap(g => g.coordinates);
  const cLng = all.reduce((s, c) => s + c[0], 0) / all.length;
  const cLat = all.reduce((s, c) => s + c[1], 0) / all.length;

  const rows = [
    ['🚶', 'Walkability', sd.walkability],
    ['💡', 'Lighting', sd.lighting],
    ['🚌', 'Transport', sd.transport],
    ['👁️', 'Visibility', sd.visibility],
    ['♿', 'Accessibility', sd.accessibility],
    ['🛡️', 'Road Safety', sd.roadSafety],
  ];

  const rowsHtml = rows.map(([icon, name, val]) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:3px 0;border-bottom:1px solid #2a2a3a">
      <span style="display:flex;align-items:center;gap:6px;color:#cbd5e1;font-size:11px"><span>${icon}</span>${name}</span>
      <span style="color:${getScoreColor(val)};font-weight:600;font-size:11px">${val.toFixed(1)}</span>
    </div>
  `).join('');

  new maplibregl.Popup({ offset: 10, className: 'nc-popup' }).setLngLat([cLng, cLat]).setHTML(`
    <div style="font-family:system-ui;min-width:220px;background:#1f2937;color:#e5e7eb;padding:10px 12px;border-radius:8px;border:1px solid #374151">
      <strong style="font-size:13px;color:#fff">${label}</strong>
      <div style="margin-top:6px">${rowsHtml}</div>
      <div style="margin-top:8px;padding:5px 8px;border-radius:6px;background:${color}25;color:${color};font-weight:700;text-align:center;font-size:12px">
        ${getScoreLabel(sd.index)} — ${sd.index.toFixed(1)}
      </div>
    </div>
  `).addTo(map);
}

export default StreetMap;
