// Generates a short qualitative comment about a segment's score
// based on its category indicators (no numeric values, just words).
import { getSegmentScore, getSegmentLabel, getScoreLabel } from './streetData';
import { AMENITIES } from './amenities';

const INDICATORS = [
  { key: 'walkability', label: 'walkability' },
  { key: 'lighting', label: 'lighting' },
  { key: 'transport', label: 'public transport access' },
  { key: 'visibility', label: 'visibility' },
  { key: 'accessibility', label: 'universal accessibility' },
  { key: 'roadSafety', label: 'road safety' },
];

function qualify(v) {
  if (v >= 75) return 'excellent';
  if (v >= 50) return 'good';
  if (v >= 35) return 'moderate';
  if (v >= 20) return 'poor';
  return 'critical';
}

export function getSegmentCommentary(code) {
  const s = getSegmentScore(code);
  if (!s) return null;
  const label = getSegmentLabel(code);
  const overallLabel = getScoreLabel(s.index).toLowerCase();

  const sorted = [...INDICATORS]
    .map(i => ({ ...i, value: s[i.key], q: qualify(s[i.key]) }))
    .sort((a, b) => a.value - b.value);

  const weakest = sorted.slice(0, 2).filter(i => i.value < 50);
  const strongest = sorted[sorted.length - 1];

  const sentence1 = `${label} performs ${overallLabel} overall.`;

  let sentence2;
  if (weakest.length >= 2) {
    sentence2 = `It is held back by ${weakest[0].q} ${weakest[0].label} and ${weakest[1].q} ${weakest[1].label}, while ${strongest.label} remains its strongest aspect.`;
  } else if (weakest.length === 1) {
    sentence2 = `Its weakest aspect is ${weakest[0].label}, but ${strongest.label} performs ${strongest.q}.`;
  } else {
    sentence2 = `All indicators perform reasonably, led by ${strongest.label}.`;
  }

  return `${sentence1} ${sentence2}`;
}

/** Suggest top amenities to add to improve the weakest indicators. */
export function getImprovementLevers(code) {
  const s = getSegmentScore(code);
  if (!s) return [];

  // Identify weakest indicators (below 60), sorted ascending
  const weak = INDICATORS
    .map(i => ({ key: i.key, label: i.label, value: s[i.key] }))
    .filter(i => i.value < 60)
    .sort((a, b) => a.value - b.value);

  if (weak.length === 0) return [];

  // Score each amenity by how much it helps the weakest categories (gap-weighted)
  const scored = AMENITIES.map(a => {
    let benefit = 0;
    weak.forEach((w, idx) => {
      const impact = a.impact[w.key] ?? 0;
      const gap = 100 - w.value;
      // Weight earlier (weaker) indicators more
      const weight = 1 / (idx + 1);
      benefit += impact * gap * weight;
    });
    return { amenity: a, benefit };
  })
    .filter(x => x.benefit > 0)
    .sort((a, b) => b.benefit - a.benefit)
    .slice(0, 4)
    .map(x => x.amenity);

  return scored;
}
