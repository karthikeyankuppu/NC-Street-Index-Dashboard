// Amenity definitions and their impact on street index categories

export const AMENITY_CATEGORIES = [
  { id: 'safety', label: 'Safety & Security' },
  { id: 'mobility', label: 'Mobility & Wayfinding' },
  { id: 'comfort', label: 'Comfort & Hygiene' },
  { id: 'environment', label: 'Environment & Lighting' },
];

export const AMENITIES = [
  // Safety & Security
  {
    id: 'police',
    label: 'Help Desk',
    icon: '🛟',
    category: 'safety',
    description: 'Public help desk / assistance booth',
    impact: { visibility: 8, roadSafety: 6, lighting: 3 },
  },
  {
    id: 'cctv',
    label: 'CCTV Camera',
    icon: '📹',
    category: 'safety',
    description: 'Surveillance camera',
    impact: { visibility: 7, roadSafety: 3 },
  },

  // Mobility & Wayfinding
  {
    id: 'transport_stop',
    label: 'Public Transport Stop',
    icon: '🚌',
    category: 'mobility',
    description: 'Bus / shared mobility stop',
    impact: { transport: 12, walkability: 3, accessibility: 3 },
  },
  {
    id: 'wayfinding',
    label: 'Wayfinding Sign',
    icon: '🧭',
    category: 'mobility',
    description: 'Directional wayfinding signage',
    impact: { visibility: 5, walkability: 3, accessibility: 3 },
  },
  {
    id: 'ramp',
    label: 'Wheelchair Ramp',
    icon: '♿',
    category: 'mobility',
    description: 'Accessibility ramp at curbs',
    impact: { accessibility: 10, walkability: 3 },
  },

  // Comfort & Hygiene
  {
    id: 'toilet',
    label: 'Public Toilet',
    icon: '🚻',
    category: 'comfort',
    description: 'Clean public restroom facility',
    impact: { walkability: 4, accessibility: 5, visibility: 2 },
  },
  {
    id: 'water',
    label: 'Drinking Water',
    icon: '🚰',
    category: 'comfort',
    description: 'Clean drinking water point',
    impact: { walkability: 3, accessibility: 4, visibility: 1 },
  },
  {
    id: 'bench',
    label: 'Sitting Bench',
    icon: '🪑',
    category: 'comfort',
    description: 'Public seating bench',
    impact: { walkability: 3, accessibility: 5, visibility: 2 },
  },
  {
    id: 'garbage',
    label: 'Garbage Can',
    icon: '🗑️',
    category: 'comfort',
    description: 'Waste collection bin',
    impact: { walkability: 2, visibility: 1, accessibility: 1 },
  },
  {
    id: 'atm',
    label: 'ATM',
    icon: '🏧',
    category: 'comfort',
    description: 'Automated teller machine',
    impact: { walkability: 2, visibility: 3, lighting: 3 },
  },

  // Environment & Lighting
  {
    id: 'streetlight',
    label: 'Street Lights',
    icon: '💡',
    category: 'environment',
    description: 'Additional street lighting',
    impact: { lighting: 10, visibility: 5, roadSafety: 4 },
  },
  {
    id: 'tree',
    label: 'Trees',
    icon: '🌳',
    category: 'environment',
    description: 'Shade trees along the street',
    impact: { walkability: 5, visibility: 2, accessibility: 2 },
  },
];

const CATEGORY_WEIGHTS = {
  walkability: 0.192,
  lighting: 0.096,
  transport: 0.192,
  visibility: 0.096,
  accessibility: 0.192,
  roadSafety: 0.231,
};

/** Count amenities from placed list */
export function countAmenities(placed) {
  const counts = {};
  placed.forEach(p => {
    counts[p.amenityId] = (counts[p.amenityId] || 0) + 1;
  });
  return counts;
}

/** Compute a new SegmentScore with placed amenities applied (diminishing returns per duplicate) */
export function applyPlacedAmenities(base, placed) {
  const counts = countAmenities(placed);
  const cats = ['walkability', 'lighting', 'transport', 'visibility', 'accessibility', 'roadSafety'];

  const newScore = { ...base };

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

  // Compute index delta from category changes, preserving the original base index
  const indexDelta = cats.reduce((sum, cat) => sum + (newScore[cat] - base[cat]) * CATEGORY_WEIGHTS[cat], 0);
  newScore.index = Math.min(100, base.index + indexDelta);
  return newScore;
}

/** Legacy: apply by id list (toggle-based) */
export function applyAmenities(base, amenityIds) {
  const placed = amenityIds.map(id => ({ uid: id, amenityId: id, latlng: [0, 0] }));
  return applyPlacedAmenities(base, placed);
}
