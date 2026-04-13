import { useMemo } from 'react';
import { getSegmentScore, getScoreColor, type SegmentScore } from '@/data/streetData';

interface RadarChartProps {
  segmentCode: string;
  onClose: () => void;
}

const CATEGORIES = [
  { key: 'walkability' as const, label: 'Walk' },
  { key: 'lighting' as const, label: 'Light' },
  { key: 'transport' as const, label: 'Transit' },
  { key: 'visibility' as const, label: 'Visible' },
  { key: 'accessibility' as const, label: 'Access' },
  { key: 'roadSafety' as const, label: 'Safety' },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const RadarChart = ({ segmentCode, onClose }: RadarChartProps) => {
  const score = getSegmentScore(segmentCode);
  if (!score) return null;

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 85;
  const levels = 5;
  const n = CATEGORIES.length;
  const angleStep = 360 / n;

  const values: number[] = CATEGORIES.map(c => score[c.key]);

  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    for (let lvl = 1; lvl <= levels; lvl++) {
      const r = (maxR / levels) * lvl;
      const pts = Array.from({ length: n }, (_, i) => {
        const p = polarToCartesian(cx, cy, r, i * angleStep);
        return `${p.x},${p.y}`;
      }).join(' ');
      lines.push(
        <polygon key={`grid-${lvl}`} points={pts} fill="none" stroke="hsl(220 20% 25%)" strokeWidth="0.5" />
      );
    }
    // Axes
    for (let i = 0; i < n; i++) {
      const p = polarToCartesian(cx, cy, maxR, i * angleStep);
      lines.push(
        <line key={`axis-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="hsl(220 20% 25%)" strokeWidth="0.5" />
      );
    }
    return lines;
  }, []);

  // Data polygon
  const dataPoints = values.map((v, i) => {
    const r = (v / 100) * maxR;
    return polarToCartesian(cx, cy, r, i * angleStep);
  });
  const dataPoly = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  const indexColor = getScoreColor(score.index);

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-bold text-foreground font-mono">{segmentCode}</span>
          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${indexColor}20`, color: indexColor }}>
            Index: {score.index.toFixed(1)}
          </span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
      </div>
      <svg width={size} height={size} className="mx-auto">
        {gridLines}
        <polygon points={dataPoly} fill={`${indexColor}30`} stroke={indexColor} strokeWidth="2" />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={indexColor} />
        ))}
        {CATEGORIES.map((cat, i) => {
          const p = polarToCartesian(cx, cy, maxR + 16, i * angleStep);
          return (
            <text
              key={cat.key}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-muted-foreground"
              fontSize="9"
              fontWeight="600"
            >
              {cat.label}
            </text>
          );
        })}
      </svg>
      <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-2 text-[10px]">
        {CATEGORIES.map(cat => {
          const v = score[cat.key];
          return (
            <div key={cat.key} className="flex justify-between">
              <span className="text-muted-foreground">{cat.label}</span>
              <span className="font-bold" style={{ color: getScoreColor(v) }}>{v.toFixed(1)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RadarChart;
