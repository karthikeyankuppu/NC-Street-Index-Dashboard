// Amenity definitions and their impact on street index categories

import type { SegmentScore, CategoryKey } from './streetData';

export interface Amenity {
  id: string;
  label: string;
  icon: string;
  description: string;
  /** Impact on each category (additive per unit, clamped to 100) */
  impact: Partial<Record<Exclude<CategoryKey, 'index'>, number>>;
}

export interface PlacedAmenity {
  uid: string;
  amenityId: string;
  latlng: [number, number];
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

/** Count amenities from placed list */
export function countAmenities(placed: PlacedAmenity[]): Record<string, number> {
  const counts: Record<string, number> = {};
  placed.forEach(p => {
    counts[p.amenityId] = (counts[p.amenityId] || 0) + 1;
  });
  return counts;
}

/** Compute a new SegmentScore with placed amenities applied (diminishing returns per duplicate) */
export function applyPlacedAmenities(base: SegmentScore, placed: PlacedAmenity[]): SegmentScore {
  const counts = countAmenities(placed);
  const cats: (Exclude<CategoryKey, 'index'>)[] = ['walkability', 'lighting', 'transport', 'visibility', 'accessibility', 'roadSafety'];

  const newScore: any = { ...base };

  cats.forEach(cat => {
    let bonus = 0;
    Object.entries(counts).forEach(([amenityId, qty]) => {
      const amenity = AMENITIES.find(a => a.id === amenityId);
      if (!amenity) return;
      const perUnit = amenity.impact[cat] ?? 0;
      // Diminishing returns: each additional unit gives 60% of previous
      for (let i = 0; i < qty; i++) {
        bonus += perUnit * Math.pow(0.6, i);
      }
    });
    newScore[cat] = Math.min(100, base[cat] + bonus);
  });

  newScore.index = cats.reduce((sum, cat) => sum + newScore[cat] * CATEGORY_WEIGHTS[cat], 0);
  return newScore as SegmentScore;
}

/** Legacy: apply by id list (toggle-based) */
export function applyAmenities(base: SegmentScore, amenityIds: string[]): SegmentScore {
  const placed = amenityIds.map(id => ({ uid: id, amenityId: id, latlng: [0, 0] as [number, number] }));
  return applyPlacedAmenities(base, placed);
}
