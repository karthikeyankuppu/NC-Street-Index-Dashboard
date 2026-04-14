import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { segments, getSegmentScore, getScoreColor, getScoreForCategory, getScoreLabel, type CategoryKey } from '@/data/streetData';
import { AMENITIES, type PlacedAmenity } from '@/data/amenities';

interface StreetMapProps {
  category: CategoryKey;
  highlightedSegment: string | null;
  onSegmentClick: (code: string | null) => void;
  placedAmenities: PlacedAmenity[];
  activeAmenity: string | null;
  onPlaceAmenity: (latlng: [number, number]) => void;
}

const StreetMap = ({ category, highlightedSegment, onSegmentClick, placedAmenities, activeAmenity, onPlaceAmenity }: StreetMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const activeAmenityRef = useRef(activeAmenity);
  activeAmenityRef.current = activeAmenity;
  const onPlaceRef = useRef(onPlaceAmenity);
  onPlaceRef.current = onPlaceAmenity;

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [25.310, 83.008],
      zoom: 16,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;
    layersRef.current = L.layerGroup().addTo(map);
    markersRef.current = L.layerGroup().addTo(map);

    // Click handler for placing amenities
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (activeAmenityRef.current) {
        onPlaceRef.current([e.latlng.lat, e.latlng.lng]);
      }
    });

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update segment layers
  useEffect(() => {
    if (!mapRef.current || !layersRef.current) return;
    layersRef.current.clearLayers();

    Object.entries(segments).forEach(([code, geos]) => {
      const scoreData = getSegmentScore(code);
      if (!scoreData) return;

      const value = getScoreForCategory(scoreData, category);
      const color = getScoreColor(value);
      const isHighlighted = highlightedSegment === code;

      geos.forEach(geo => {
        const latlngs = geo.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
        const polyline = L.polyline(latlngs, {
          color,
          weight: isHighlighted ? 7 : 4,
          opacity: highlightedSegment && !isHighlighted ? 0.3 : 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        });

        polyline.bindPopup(`
          <div style="font-family:system-ui;min-width:180px">
            <strong style="font-size:14px">${code}</strong>
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
        `);

        polyline.on('click', () => onSegmentClick(code));
        layersRef.current!.addLayer(polyline);
      });
    });
  }, [category, highlightedSegment, onSegmentClick]);

  // Update amenity markers
  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    placedAmenities.forEach(p => {
      const def = AMENITIES.find(a => a.id === p.amenityId);
      if (!def) return;

      const icon = L.divIcon({
        html: `<div style="font-size:20px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));cursor:pointer;text-align:center;line-height:1">${def.icon}</div>`,
        className: 'amenity-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(p.latlng, { icon });
      marker.bindTooltip(`${def.icon} ${def.label}`, { direction: 'top', offset: [0, -10] });
      markersRef.current!.addLayer(marker);
    });
  }, [placedAmenities]);

  // Change cursor when placing
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.style.cursor = activeAmenity ? 'crosshair' : '';
  }, [activeAmenity]);

  return <div ref={containerRef} className="w-full h-full rounded-lg" />;
};

export default StreetMap;
