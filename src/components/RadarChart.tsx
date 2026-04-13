import { useMemo } from 'react';
import { getSegmentScore, getScoreColor } from '@/data/streetData';

interface RadarChartProps {
  segmentCode: string;
  onClose: () => void;
}

const CATS = [
  { key: 'walkability' as const, label: 'Walk' },
  { key: 'lighting' as const, label: 'Light' },
  { key: 'transport' as const, label: 'Transit' },
  { key: 'visibility' as const, label: 'Visible' },
  { key: 'accessibility' as const, label: 'Access' },
  { key: 'roadSafety' as const, label: 'Safety' },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const RadarChart = ({ segmentCode, onClose }: RadarChartProps) => {
  const score = getSegmentScore(segmentCode);
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 85;
  const n = CATS.length;
  const step = 360 / n;

  const grid = useMemo(() => {
    const els: JSX.Element[] = [];
    for (let lvl = 1; lvl <= 5; lvl++) {
      const r = (maxR / 5) * lvl;
      const pts = Array.from({ length: n }, (_, i) => {
        const p = polar(cx, cy, r, i * step);
        return `${p.x},${p.y}`;
      }).join(' ');
      els.push(<polygon key={`g${lvl}`} points={pts} fill="none" stroke="hsl(220 20% 25%)" strokeWidth="0.5" />);
    }
    for (let i = 0; i < n; i++) {
      const p = polar(cx, cy, maxR, i * step);
      els.push(<line key={`a${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="hsl(220 20% 25%)" strokeWidth="0.5" />);
    }
    return els;
  }, []);

  if (!score) return null;

  const pts = CATS.map((c, i) => {
    const r = (score[c.key] / 100) * maxR;
    return polar(cx, cy, r, i * step);
  });
  const polyStr = pts.map(p => `${p.x},${p.y}`).join(' ');
  const color = getScoreColor(score.index);

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-bold text-foreground font-mono">{segmentCode}</span>
          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
            Index: {score.index.toFixed(1)}
          </span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
      </div>
      <svg width={size} height={size} className="mx-auto">
        {grid}
        <polygon points={polyStr} fill={`${color}30`} stroke={color} strokeWidth="2" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
        ))}
        {CATS.map((cat, i) => {
          const p = polar(cx, cy, maxR + 16, i * step);
          return (
            <text key={cat.key} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground" fontSize="9" fontWeight="600">
              {cat.label}
            </text>
          );
        })}
      </svg>
      <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-2 text-[10px]">
        {CATS.map(cat => {
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
