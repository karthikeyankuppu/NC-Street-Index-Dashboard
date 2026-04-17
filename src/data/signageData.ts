// Auto-generated from Quarter_1..4.gpkg — wayfinding masterplan signage by quarter
import type { SegmentScore, CategoryKey } from './streetData';
import { segments } from './streetData';

export interface SignagePoint { id: string; lng: number; lat: number; category: string; subcategory?: string; name?: string; quarter: number; }
export interface QuarterInfo { id: number; label: string; months: string; festivals: string[]; }

export const QUARTERS: QuarterInfo[] = [
  { id: 1, label: 'Q1', months: 'Jan – Mar', festivals: ["Mahashivratri", "Makar Sankranti"] },
  { id: 2, label: 'Q2', months: 'Apr – Jun', festivals: ["Holi", "Rangbhari Ekadashi"] },
  { id: 3, label: 'Q3', months: 'Jul – Sep', festivals: ["Shravan Mela"] },
  { id: 4, label: 'Q4', months: 'Oct – Dec', festivals: ["Dev Deepawali"] },
];

export const SIGNAGE_CATEGORIES: Record<string, { label: string; color: string; icon: string }> = {
  'Digital Display': { label: 'Digital Display', color: '#8b5cf6', icon: '📺' },
  'Directional Signage': { label: 'Directional Signage', color: '#3b82f6', icon: '🧭' },
  'Sky Balloon': { label: 'Sky Balloon', color: '#f59e0b', icon: '🎈' },
};

export const SIGNAGE_POINTS: SignagePoint[] = [
  { id: 'Q1-1', lng: 83.0057457, lat: 25.3092725, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Vandana Silk Saree - 1', quarter: 1 },
  { id: 'Q1-2', lng: 83.0094494, lat: 25.3114021, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Vandana Silk Saree - 2', quarter: 1 },
  { id: 'Q1-3', lng: 83.0069558, lat: 25.3090896, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Multilevel Parking - 3', quarter: 1 },
  { id: 'Q1-4', lng: 83.0068481, lat: 25.3092082, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-5', lng: 83.0082311, lat: 25.3090409, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-6', lng: 83.0093513, lat: 25.3087654, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-7', lng: 83.0097186, lat: 25.3084189, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-8', lng: 83.0099815, lat: 25.3078447, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-9', lng: 83.0095178, lat: 25.306836, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-10', lng: 83.0073115, lat: 25.3104749, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-11', lng: 83.0087115, lat: 25.3109611, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-12', lng: 83.0055344, lat: 25.3094608, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-13', lng: 83.0036016, lat: 25.3143892, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-14', lng: 83.0044164, lat: 25.3129549, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-15', lng: 83.0050255, lat: 25.3117587, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-16', lng: 83.0031542, lat: 25.3093019, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-17', lng: 83.0043392, lat: 25.3075151, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-18', lng: 83.005647, lat: 25.3072003, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-19', lng: 83.0110942, lat: 25.3133304, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 1 },
  { id: 'Q1-20', lng: 83.0103574, lat: 25.3117094, category: 'Sky Balloon', subcategory: '', name: '', quarter: 1 },
  { id: 'Q1-21', lng: 83.0104425, lat: 25.3069445, category: 'Sky Balloon', subcategory: '', name: '', quarter: 1 },
  { id: 'Q1-22', lng: 83.0093718, lat: 25.3088267, category: 'Sky Balloon', subcategory: '', name: '', quarter: 1 },
  { id: 'Q2-1', lng: 83.0057457, lat: 25.3092725, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Vandana Silk Saree - 1', quarter: 2 },
  { id: 'Q2-2', lng: 83.0094494, lat: 25.3114021, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Vandana Silk Saree - 2', quarter: 2 },
  { id: 'Q2-3', lng: 83.0069558, lat: 25.3090896, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Multilevel Parking - 3', quarter: 2 },
  { id: 'Q2-4', lng: 83.0068481, lat: 25.3092082, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-5', lng: 83.0082311, lat: 25.3090409, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-6', lng: 83.0093513, lat: 25.3087654, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-7', lng: 83.0097186, lat: 25.3084189, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-8', lng: 83.0099815, lat: 25.3078447, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-9', lng: 83.0095178, lat: 25.306836, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-10', lng: 83.0073115, lat: 25.3104749, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-11', lng: 83.0087115, lat: 25.3109611, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-12', lng: 83.0055344, lat: 25.3094608, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-13', lng: 83.0036016, lat: 25.3143892, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-14', lng: 83.0044164, lat: 25.3129549, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-15', lng: 83.0050255, lat: 25.3117587, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-16', lng: 83.0031542, lat: 25.3093019, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-17', lng: 83.0043392, lat: 25.3075151, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-18', lng: 83.005647, lat: 25.3072003, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-19', lng: 83.0110942, lat: 25.3133304, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 2 },
  { id: 'Q2-20', lng: 83.0103574, lat: 25.3117094, category: 'Sky Balloon', subcategory: '', name: '', quarter: 2 },
  { id: 'Q2-21', lng: 83.0104425, lat: 25.3069445, category: 'Sky Balloon', subcategory: '', name: '', quarter: 2 },
  { id: 'Q2-22', lng: 83.0093718, lat: 25.3088267, category: 'Sky Balloon', subcategory: '', name: '', quarter: 2 },
  { id: 'Q3-1', lng: 83.0057457, lat: 25.3092725, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Vandana Silk Saree - 1', quarter: 3 },
  { id: 'Q3-2', lng: 83.0094494, lat: 25.3114021, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Vandana Silk Saree - 2', quarter: 3 },
  { id: 'Q3-3', lng: 83.0069558, lat: 25.3090896, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Multilevel Parking - 3', quarter: 3 },
  { id: 'Q3-4', lng: 83.0068481, lat: 25.3092082, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-5', lng: 83.0082311, lat: 25.3090409, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-6', lng: 83.0093513, lat: 25.3087654, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-7', lng: 83.0097186, lat: 25.3084189, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-8', lng: 83.0099815, lat: 25.3078447, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-9', lng: 83.0095178, lat: 25.306836, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-10', lng: 83.0073115, lat: 25.3104749, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-11', lng: 83.0087115, lat: 25.3109611, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-12', lng: 83.0055344, lat: 25.3094608, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-13', lng: 83.0036016, lat: 25.3143892, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-14', lng: 83.0044164, lat: 25.3129549, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-15', lng: 83.0050255, lat: 25.3117587, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-16', lng: 83.0031542, lat: 25.3093019, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-17', lng: 83.0043392, lat: 25.3075151, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-18', lng: 83.005647, lat: 25.3072003, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-19', lng: 83.0110942, lat: 25.3133304, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 3 },
  { id: 'Q3-20', lng: 83.0103574, lat: 25.3117094, category: 'Sky Balloon', subcategory: '', name: '', quarter: 3 },
  { id: 'Q3-21', lng: 83.0104425, lat: 25.3069445, category: 'Sky Balloon', subcategory: '', name: '', quarter: 3 },
  { id: 'Q3-22', lng: 83.0093718, lat: 25.3088267, category: 'Sky Balloon', subcategory: '', name: '', quarter: 3 },
  { id: 'Q4-1', lng: 83.0057457, lat: 25.3092725, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Vandana Silk Saree - 1', quarter: 4 },
  { id: 'Q4-2', lng: 83.0094494, lat: 25.3114021, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Vandana Silk Saree - 2', quarter: 4 },
  { id: 'Q4-3', lng: 83.0069558, lat: 25.3090896, category: 'Digital Display', subcategory: '', name: 'Digital Screen at Multilevel Parking - 3', quarter: 4 },
  { id: 'Q4-4', lng: 83.0068481, lat: 25.3092082, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-5', lng: 83.0082311, lat: 25.3090409, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-6', lng: 83.0093513, lat: 25.3087654, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-7', lng: 83.0097186, lat: 25.3084189, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-8', lng: 83.0099815, lat: 25.3078447, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-9', lng: 83.0095178, lat: 25.306836, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-10', lng: 83.0073115, lat: 25.3104749, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-11', lng: 83.0087115, lat: 25.3109611, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-12', lng: 83.0055344, lat: 25.3094608, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-13', lng: 83.0036016, lat: 25.3143892, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-14', lng: 83.0044164, lat: 25.3129549, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-15', lng: 83.0050255, lat: 25.3117587, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-16', lng: 83.0031542, lat: 25.3093019, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-17', lng: 83.0043392, lat: 25.3075151, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-18', lng: 83.005647, lat: 25.3072003, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-19', lng: 83.0110942, lat: 25.3133304, category: 'Directional Signage', subcategory: 'T1', name: '', quarter: 4 },
  { id: 'Q4-20', lng: 83.0103574, lat: 25.3117094, category: 'Sky Balloon', subcategory: '', name: '', quarter: 4 },
  { id: 'Q4-21', lng: 83.0104425, lat: 25.3069445, category: 'Sky Balloon', subcategory: '', name: '', quarter: 4 },
  { id: 'Q4-22', lng: 83.0093718, lat: 25.3088267, category: 'Sky Balloon', subcategory: '', name: '', quarter: 4 },
];

// --- nearest-segment + impact helpers ---
function distToSegment(lng: number, lat: number, coords: [number, number][]): number {
  let m = Infinity;
  for (const [cl, ct] of coords) { const d = Math.sqrt((lng-cl)**2 + (lat-ct)**2); if (d<m) m=d; }
  return m;
}
export function findNearestSegment(lng: number, lat: number): string | null {
  let best: string | null = null; let bd = Infinity;
  for (const [code, geos] of Object.entries(segments)) {
    for (const geo of geos) { const d = distToSegment(lng, lat, geo.coordinates); if (d<bd){bd=d; best=code;} }
  }
  return bd < 0.002 ? best : null;
}
export function getSignageBySegment(quarter?: number): Record<string, SignagePoint[]> {
  const result: Record<string, SignagePoint[]> = {};
  for (const sp of SIGNAGE_POINTS) {
    if (quarter && sp.quarter !== quarter) continue;
    const seg = findNearestSegment(sp.lng, sp.lat);
    if (seg) { (result[seg] ||= []).push(sp); }
  }
  return result;
}

const SIGNAGE_IMPACT: Partial<Record<Exclude<CategoryKey,'index'>, number>> = { walkability: 5, roadSafety: 4 };
const CATEGORY_WEIGHTS: Record<Exclude<CategoryKey,'index'>, number> = { walkability:0.192, lighting:0.096, transport:0.192, visibility:0.096, accessibility:0.192, roadSafety:0.231 };
export function applySignageImpact(base: SegmentScore, count: number): SegmentScore {
  if (count===0) return base;
  const cats: (Exclude<CategoryKey,'index'>)[] = ['walkability','lighting','transport','visibility','accessibility','roadSafety'];
  const ns: any = { ...base };
  cats.forEach(c => { const per = SIGNAGE_IMPACT[c] ?? 0; let b=0; for (let i=0;i<count;i++) b += per*Math.pow(0.6,i); ns[c] = Math.min(100, base[c]+b); });
  const d = cats.reduce((s,c) => s + (ns[c]-base[c])*CATEGORY_WEIGHTS[c], 0);
  ns.index = Math.min(100, base.index + d);
  return ns as SegmentScore;
}