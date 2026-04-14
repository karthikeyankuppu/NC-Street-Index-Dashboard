// Amenity definitions and their impact on street index categories

import type { SegmentScore, CategoryKey } from './streetData';

export interface Amenity {
  id: string;
  label: string;
  icon: string;
  description: string;
  /** Impact on each category (additive, clamped to 100) */
  impact: Partial<Record<Exclude<CategoryKey, 'index'>, number>>;
}

export const AMENITIES: Amenity[] = [
  {
    id: 'toilet',
    label: 'Public Toilet',
    icon: '🚻',
    description: 'Clean public restroom facility',
    impact: { walkability: 4, accessibility: 5, visibility: 2 },
  },
  {
    id: 'atm',
    label: 'ATM',
    icon: '🏧',
    description: 'Automated teller machine',
    impact: { walkability: 2, visibility: 3, lighting: 3 },
  },
  {
    id: 'water',
    label: 'Drinking Water',
    icon: '🚰',
    description: 'Clean drinking water point',
    impact: { walkability: 3, accessibility: 4, visibility: 1 },
  },
  {
    id: 'police',
    label: 'Police Thana',
    icon: '🚔',
    description: 'Police outpost / chowki',
    impact: { visibility: 8, roadSafety: 6, lighting: 3 },
  },
  {
    id: 'bench',
    label: 'Sitting Bench',
    icon: '🪑',
    description: 'Public seating bench',
    impact: { walkability: 3, accessibility: 5, visibility: 2 },
  },
  {
    id: 'garbage',
    label: 'Garbage Can',
    icon: '🗑️',
    description: 'Waste collection bin',
    impact: { walkability: 2, visibility: 1, accessibility: 1 },
  },
  {
    id: 'tree',
    label: 'Trees',
    icon: '🌳',
    description: 'Shade trees along the street',
    impact: { walkability: 5, visibility: 2, accessibility: 2 },
  },
  {
    id: 'streetlight',
    label: 'Street Lights',
    icon: '💡',
    description: 'Additional street lighting',
    impact: { lighting: 10, visibility: 5, roadSafety: 4 },
  },
  {
    id: 'ramp',
    label: 'Wheelchair Ramp',
    icon: '♿',
    description: 'Accessibility ramp at curbs',
    impact: { accessibility: 10, walkability: 3 },
  },
  {
    id: 'cctv',
    label: 'CCTV Camera',
    icon: '📹',
    description: 'Surveillance camera',
    impact: { visibility: 7, roadSafety: 3 },
  },
];

const CATEGORY_WEIGHTS: Record<Exclude<CategoryKey, 'index'>, number> = {
  walkability: 0.192,
  lighting: 0.096,
  transport: 0.192,
  visibility: 0.096,
  accessibility: 0.192,
  roadSafety: 0.231,
};

/** Compute a new SegmentScore with selected amenities applied */
export function applyAmenities(base: SegmentScore, amenityIds: string[]): SegmentScore {
  const selected = AMENITIES.filter(a => amenityIds.includes(a.id));

  const cats: (Exclude<CategoryKey, 'index'>)[] = ['walkability', 'lighting', 'transport', 'visibility', 'accessibility', 'roadSafety'];

  const newScore: any = { ...base };

  cats.forEach(cat => {
    let bonus = 0;
    selected.forEach(a => { bonus += a.impact[cat] ?? 0; });
    newScore[cat] = Math.min(100, base[cat] + bonus);
  });

  // Recompute index as weighted sum
  newScore.index = cats.reduce((sum, cat) => sum + newScore[cat] * CATEGORY_WEIGHTS[cat], 0);

  return newScore as SegmentScore;
}
