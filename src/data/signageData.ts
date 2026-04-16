// Wayfinding signage locations extracted from GeoPackage
// Categories: T1 = Directional, T2 = Informational, T3 = Regulatory

import type { SegmentScore, CategoryKey } from './streetData';

export interface SignagePoint {
  id: string;
  lng: number;
  lat: number;
  category: string;
  phase: number;
  name?: string;
}

export const SIGNAGE_CATEGORIES: Record<string, { label: string; color: string; icon: string }> = {
  T1: { label: 'Directional', color: '#3b82f6', icon: '🔵' },
  T2: { label: 'Informational', color: '#f59e0b', icon: '🟡' },
  T3: { label: 'Regulatory', color: '#ef4444', icon: '🔴' },
  INFO: { label: 'Information Board', color: '#8b5cf6', icon: '🟣' },
};

export const SIGNAGE_POINTS: SignagePoint[] = [
  // Phase 1
  { id: 'P1-1', lng: 83.00684813, lat: 25.30920818, category: 'T1', phase: 1 },
  { id: 'P1-2', lng: 83.00823108, lat: 25.30904092, category: 'T1', phase: 1 },
  { id: 'P1-3', lng: 83.00935126, lat: 25.30876536, category: 'T1', phase: 1 },
  { id: 'P1-4', lng: 83.00971861, lat: 25.30841892, category: 'T1', phase: 1 },
  { id: 'P1-5', lng: 83.00998154, lat: 25.30784474, category: 'T1', phase: 1 },
  { id: 'P1-6', lng: 83.01058183, lat: 25.30690147, category: 'T2', phase: 1 },
  { id: 'P1-7', lng: 83.00951780, lat: 25.30683601, category: 'T1', phase: 1 },
  { id: 'P1-8', lng: 83.01022306, lat: 25.30625580, category: 'T2', phase: 1 },
  { id: 'P1-9', lng: 83.00731146, lat: 25.31047492, category: 'T1', phase: 1 },
  { id: 'P1-10', lng: 83.00871155, lat: 25.31096107, category: 'T1', phase: 1 },
  { id: 'P1-11', lng: 83.01036522, lat: 25.31175403, category: 'T2', phase: 1 },
  { id: 'P1-12', lng: 83.00973554, lat: 25.31061068, category: 'T2', phase: 1 },
  // Phase 2
  { id: 'P2-1', lng: 83.00553438, lat: 25.30946080, category: 'T1', phase: 2 },
  { id: 'P2-2', lng: 83.00562898, lat: 25.30946574, category: 'T3', phase: 2 },
  { id: 'P2-3', lng: 83.00569708, lat: 25.30944177, category: 'T3', phase: 2 },
  { id: 'P2-4', lng: 83.00575703, lat: 25.30942228, category: 'T3', phase: 2 },
  { id: 'P2-5', lng: 83.00583951, lat: 25.30939812, category: 'T3', phase: 2 },
  { id: 'P2-6', lng: 83.01126551, lat: 25.30782186, category: 'T2', phase: 2 },
  { id: 'P2-7', lng: 83.01175491, lat: 25.30850750, category: 'T2', phase: 2 },
  { id: 'P2-8', lng: 83.01272966, lat: 25.30930107, category: 'T2', phase: 2 },
  { id: 'P2-9', lng: 83.01364745, lat: 25.31041916, category: 'T2', phase: 2 },
  // Phase 3
  { id: 'P3-1', lng: 83.00360161, lat: 25.31438925, category: 'T1', phase: 3 },
  { id: 'P3-2', lng: 83.00441639, lat: 25.31295491, category: 'T1', phase: 3 },
  { id: 'P3-3', lng: 83.00502547, lat: 25.31175872, category: 'T1', phase: 3 },
  { id: 'P3-4', lng: 83.00315420, lat: 25.30930187, category: 'T1', phase: 3 },
  { id: 'P3-5', lng: 83.00433917, lat: 25.30751510, category: 'T1', phase: 3 },
  { id: 'P3-6', lng: 83.00564698, lat: 25.30720033, category: 'T1', phase: 3 },
  { id: 'P3-7', lng: 83.01109416, lat: 25.31333041, category: 'T1', phase: 3 },
  { id: 'P3-8', lng: 83.01248390, lat: 25.31653795, category: 'T2', phase: 3 },
  // Information Signage
  { id: 'INFO-1', lng: 83.00380554, lat: 25.31476490, category: 'INFO', phase: 0, name: 'Benia Bagh Parking' },
  { id: 'INFO-2', lng: 83.00996791, lat: 25.30730197, category: 'INFO', phase: 0, name: 'Dashashvamedh Plaza' },
  { id: 'INFO-3', lng: 83.01276325, lat: 25.31881119, category: 'INFO', phase: 0 },
];

// Find nearest segment to a signage point
import { segments, getSegmentScore } from './streetData';

function distToSegment(lng: number, lat: number, coords: [number, number][]): number {
  let minDist = Infinity;
  for (const [cLng, cLat] of coords) {
    const d = Math.sqrt((lng - cLng) ** 2 + (lat - cLat) ** 2);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

export function findNearestSegment(lng: number, lat: number): string | null {
  let best: string | null = null;
  let bestDist = Infinity;
  for (const [code, geos] of Object.entries(segments)) {
    for (const geo of geos) {
      const d = distToSegment(lng, lat, geo.coordinates);
      if (d < bestDist) {
        bestDist = d;
        best = code;
      }
    }
  }
  // Only match within ~200m (~0.002 degrees)
  return bestDist < 0.002 ? best : null;
}

// Map signage points to their nearest segments
export function getSignageBySegment(): Record<string, SignagePoint[]> {
  const result: Record<string, SignagePoint[]> = {};
  for (const sp of SIGNAGE_POINTS) {
    const seg = findNearestSegment(sp.lng, sp.lat);
    if (seg) {
      if (!result[seg]) result[seg] = [];
      result[seg].push(sp);
    }
  }
  return result;
}

// Impact of wayfinding signage on scores
const SIGNAGE_IMPACT: Partial<Record<Exclude<CategoryKey, 'index'>, number>> = {
  walkability: 5,
  roadSafety: 4,
};

const CATEGORY_WEIGHTS: Record<Exclude<CategoryKey, 'index'>, number> = {
  walkability: 0.192,
  lighting: 0.096,
  transport: 0.192,
  visibility: 0.096,
  accessibility: 0.192,
  roadSafety: 0.231,
};

export function applySignageImpact(base: SegmentScore, signageCount: number): SegmentScore {
  if (signageCount === 0) return base;
  const cats: (Exclude<CategoryKey, 'index'>)[] = ['walkability', 'lighting', 'transport', 'visibility', 'accessibility', 'roadSafety'];
  const newScore: any = { ...base };
  
  cats.forEach(cat => {
    const perUnit = SIGNAGE_IMPACT[cat] ?? 0;
    let bonus = 0;
    for (let i = 0; i < signageCount; i++) {
      bonus += perUnit * Math.pow(0.6, i);
    }
    newScore[cat] = Math.min(100, base[cat] + bonus);
  });
  
  const indexDelta = cats.reduce((sum, cat) => (newScore[cat] - base[cat]) * CATEGORY_WEIGHTS[cat], 0);
  newScore.index = Math.min(100, base.index + indexDelta);
  return newScore as SegmentScore;
}
