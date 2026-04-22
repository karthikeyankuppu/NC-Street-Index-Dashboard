// Generates a short qualitative comment about a segment's score
// based on its category indicators.
import { getSegmentScore, getSegmentLabel, getScoreLabel } from './streetData';

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

  // Sort indicators by score
  const sorted = [...INDICATORS]
    .map(i => ({ ...i, value: s[i.key] }))
    .sort((a, b) => a.value - b.value);

  const weakest = sorted.slice(0, 2).filter(i => i.value < 50);
  const strongest = sorted[sorted.length - 1];

  let sentence1 = `${label} scores ${s.index.toFixed(1)} (${overallLabel}).`;

  let sentence2;
  if (weakest.length >= 2) {
    sentence2 = `It is held back by ${qualify(weakest[0].value)} ${weakest[0].label} (${weakest[0].value.toFixed(0)}) and ${weakest[1].label} (${weakest[1].value.toFixed(0)}), while ${strongest.label} (${strongest.value.toFixed(0)}) is its strongest indicator.`;
  } else if (weakest.length === 1) {
    sentence2 = `Its weakest indicator is ${weakest[0].label} (${weakest[0].value.toFixed(0)}), but ${strongest.label} (${strongest.value.toFixed(0)}) performs ${qualify(strongest.value)}.`;
  } else {
    sentence2 = `All indicators perform reasonably, led by ${strongest.label} (${strongest.value.toFixed(0)}).`;
  }

  return `${sentence1} ${sentence2}`;
}
