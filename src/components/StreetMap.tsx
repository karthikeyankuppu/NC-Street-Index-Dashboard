import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { segments, getSegmentScore, getScoreColor, getScoreForCategory, getScoreLabel, type CategoryKey } from '@/data/streetData';

interface StreetMapProps {
  category: CategoryKey;
  highlightedSegment: string | null;
  onSegmentClick: (code: string | null) => void;
}

const StreetMap = ({ category, highlightedSegment, onSegmentClick }: StreetMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);

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

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update layers when category or highlight changes
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

  return <div ref={containerRef} className="w-full h-full rounded-lg" />;
};

export default StreetMap;
