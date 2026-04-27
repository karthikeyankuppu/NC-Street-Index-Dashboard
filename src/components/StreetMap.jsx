import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { segments, getSegmentScore, getScoreColor, getScoreForCategory, getScoreLabel, getSegmentLabel } from '@/data/streetData';
import { SIGNAGE_POINTS, SIGNAGE_CATEGORIES } from '@/data/signageData';
import { CURRENT_CAMERAS, NAYICHAAL_CAMERAS } from '@/data/cameraData';

const StreetMap = ({ category, highlightedSegment, onSegmentClick, showSignage, signageQuarter, is3D, criticalOnly, showCurrentCameras, showNayichaalCameras, theme = 'dark' }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const signageMarkersRef = useRef([]);
  const currentCamMarkersRef = useRef([]);
  const nayichaalCamMarkersRef = useRef([]);
  const tooltipRef = useRef(null);
  const segmentPopupRef = useRef(null);
  const readyRef = useRef(false);

  // Stable refs for callbacks used inside map events
  const stableRefs = useRef({ category, highlightedSegment, onSegmentClick });
  stableRefs.current = { category, highlightedSegment, onSegmentClick };

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const isDark = theme === 'dark';
    const tileVariant = isDark ? 'dark_all' : 'light_all';
    const bgColor = isDark ? '#0a0a0a' : '#e9eef2';

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          'carto-base': {
            type: 'raster',
            tiles: [
              `https://a.basemaps.cartocdn.com/${tileVariant}/{z}/{x}/{y}@2x.png`,
              `https://b.basemaps.cartocdn.com/${tileVariant}/{z}/{x}/{y}@2x.png`,
            ],
            tileSize: 256,
            attribution: '&copy; OSM &copy; CARTO',
          },
        },
        layers: [
          { id: 'bg', type: 'background', paint: { 'background-color': bgColor } },
          { id: 'carto', type: 'raster', source: 'carto-base' },
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
            .setHTML(`<div style="font-family:system-ui;text-align:center;background:#1f2937;color:#e5e7eb;padding:8px 12px;border-radius:8px;border:1px solid #374151;box-shadow:0 4px 14px rgba(0,0,0,.4)"><strong style="color:#fff">${getSegmentLabel(code)}</strong><div style="margin:4px 0;font-size:18px;font-weight:700;color:${col}">${val.toFixed(1)}</div><div style="font-size:10px;color:#cbd5e1">Click for details</div></div>`)
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

    // (Amenity placement on map removed — counts managed in simulator panel)

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

  // Theme: swap base raster tiles + background + 3D building color when theme changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const isDark = theme === 'dark';
    const tileVariant = isDark ? 'dark_all' : 'light_all';
    const bgColor = isDark ? '#0a0a0a' : '#e9eef2';
    const buildingColor = isDark ? '#1a1a2e' : '#c8d0db';

    const src = map.getSource('carto-base');
    if (src && typeof src.setTiles === 'function') {
      src.setTiles([
        `https://a.basemaps.cartocdn.com/${tileVariant}/{z}/{x}/{y}@2x.png`,
        `https://b.basemaps.cartocdn.com/${tileVariant}/{z}/{x}/{y}@2x.png`,
      ]);
    }
    if (map.getLayer('bg')) {
      map.setPaintProperty('bg', 'background-color', bgColor);
    }
    if (map.getLayer('3d-buildings')) {
      map.setPaintProperty('3d-buildings', 'fill-extrusion-color', buildingColor);
    }
  }, [theme]);

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

  // (Removed segment breakdown popup — info now shown below the radar chart)

  // (Buffer overlay and amenity map markers removed — amenities are counted in the simulator panel)

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
        `<div style="font-size:12px;font-family:system-ui;color:#e5e7eb;background:#1f2937;padding:10px 12px;border-radius:8px;border:1px solid #374151;box-shadow:0 4px 14px rgba(0,0,0,.4)"><b style="color:#fff">${catInfo.label}${subLabel}</b>${nameLabel}<div style="color:#cbd5e1;margin-top:2px">Q${sp.quarter} • ${sp.id}</div></div>`
      );

      const m = new maplibregl.Marker({ element: el }).setLngLat([sp.lng, sp.lat]).setPopup(popup).addTo(map);
      signageMarkersRef.current.push(m);
    });
  }, [showSignage, signageQuarter]);

  // (Cursor crosshair removed — no on-map placement)

  // Camera icon SVG (lucide camera) — fill via currentColor on the wrapper
  const cameraIconSvg = (color) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="background:${color};border:2px solid white;border-radius:6px;padding:2px;box-shadow:0 1px 4px rgba(0,0,0,.6)">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>`;

  // Existing Infra cameras (Camera_locs_godowlia)
  useEffect(() => {
    currentCamMarkersRef.current.forEach(m => m.remove());
    currentCamMarkersRef.current = [];
    const map = mapRef.current;
    if (!map || !showCurrentCameras) return;

    CURRENT_CAMERAS.forEach(cam => {
      const el = document.createElement('div');
      el.style.cssText = 'cursor:pointer;display:flex;align-items:center;justify-content:center';
      el.innerHTML = cameraIconSvg('#f59e0b');
      const popup = new maplibregl.Popup({ offset: 10, className: 'nc-popup' }).setHTML(
        `<div style="font-size:12px;font-family:system-ui;color:#e5e7eb;background:#1f2937;padding:10px 12px;border-radius:8px;border:1px solid #374151;box-shadow:0 4px 14px rgba(0,0,0,.4);min-width:160px"><b style="color:#fff">Existing Camera</b><br/>Pole ${cam.poleId} — ${cam.name || ''}<div style="color:#cbd5e1;margin-top:2px">${cam.cameras ?? '?'} cams • ${cam.status || ''}</div></div>`
      );
      const m = new maplibregl.Marker({ element: el }).setLngLat([cam.lng, cam.lat]).setPopup(popup).addTo(map);
      currentCamMarkersRef.current.push(m);
    });
  }, [showCurrentCameras]);

  // NayiChaal Infra cameras
  useEffect(() => {
    nayichaalCamMarkersRef.current.forEach(m => m.remove());
    nayichaalCamMarkersRef.current = [];
    const map = mapRef.current;
    if (!map || !showNayichaalCameras) return;

    NAYICHAAL_CAMERAS.forEach(cam => {
      const el = document.createElement('div');
      el.style.cssText = 'cursor:pointer;display:flex;align-items:center;justify-content:center';
      el.innerHTML = cameraIconSvg('#06b6d4');
      const popup = new maplibregl.Popup({ offset: 10, className: 'nc-popup' }).setHTML(
        `<div style="font-size:12px;font-family:system-ui;color:#e5e7eb;background:#1f2937;padding:10px 12px;border-radius:8px;border:1px solid #374151;box-shadow:0 4px 14px rgba(0,0,0,.4);min-width:160px"><b style="color:#fff">NayiChaal Camera</b><br/>${cam.name || ''} — ${cam.location || ''}<div style="color:#cbd5e1;margin-top:2px">${cam.type || ''} • ${cam.status || ''}</div></div>`
      );
      const m = new maplibregl.Marker({ element: el }).setLngLat([cam.lng, cam.lat]).setPopup(popup).addTo(map);
      nayichaalCamMarkersRef.current.push(m);
    });
  }, [showNayichaalCameras]);

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

  return new maplibregl.Popup({ offset: 10, className: 'nc-popup' }).setLngLat([cLng, cLat]).setHTML(`
    <div style="font-family:system-ui;min-width:220px;background:#1f2937;color:#e5e7eb;padding:10px 12px;border-radius:8px;border:1px solid #374151">
      <strong style="font-size:13px;color:#fff">${label}</strong>
      <div style="margin-top:6px">${rowsHtml}</div>
      <div style="margin-top:8px;padding:5px 8px;border-radius:6px;background:${color}25;color:${color};font-weight:700;text-align:center;font-size:12px">
        ${getScoreLabel(sd.index)} — ${sd.index.toFixed(1)}
      </div>
    </div>
  `).addTo(map);
}

// Distance from point (lat,lng) to a line segment between two lat/lng points, in meters
function distToSegmentMeters(lat, lng, lat1, lng1, lat2, lng2) {
  const toXY = (la, ln) => {
    const x = ln * 111320 * Math.cos((lat1 * Math.PI) / 180);
    const y = la * 110540;
    return [x, y];
  };
  const [px, py] = toXY(lat, lng);
  const [x1, y1] = toXY(lat1, lng1);
  const [x2, y2] = toXY(lat2, lng2);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

// Build a polygon buffer (in lng/lat) around a polyline given as [[lng,lat], ...]
function bufferPolyline(coords, meters) {
  if (!coords || coords.length < 2) return [];
  const lat0 = coords[0][1];
  const mPerDegLat = 110540;
  const mPerDegLng = 111320 * Math.cos((lat0 * Math.PI) / 180);
  const dLat = meters / mPerDegLat;
  const dLng = meters / mPerDegLng;

  const left = [];
  const right = [];
  for (let i = 0; i < coords.length; i++) {
    const [lng, lat] = coords[i];
    let nx, ny;
    if (i === 0) {
      const [lng2, lat2] = coords[i + 1];
      nx = lng2 - lng;
      ny = lat2 - lat;
    } else if (i === coords.length - 1) {
      const [lng1, lat1] = coords[i - 1];
      nx = lng - lng1;
      ny = lat - lat1;
    } else {
      const [lng1, lat1] = coords[i - 1];
      const [lng2, lat2] = coords[i + 1];
      nx = lng2 - lng1;
      ny = lat2 - lat1;
    }
    // perpendicular in scaled space
    const px = -ny * mPerDegLat;
    const py = nx * mPerDegLng;
    const len = Math.hypot(px, py) || 1;
    const ux = px / len;
    const uy = py / len;
    left.push([lng + ux * dLng, lat + uy * dLat]);
    right.push([lng - ux * dLng, lat - uy * dLat]);
  }
  // close polygon: left forward + right reversed
  return [...left, ...right.reverse(), left[0]];
}

export default StreetMap;
