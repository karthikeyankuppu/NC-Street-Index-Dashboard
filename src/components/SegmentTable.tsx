import { scores, getScoreColor, getScoreForCategory, getScoreLabel, segments, type CategoryKey } from '@/data/streetData';
import { useMemo } from 'react';

interface SegmentTableProps {
  category: CategoryKey;
  highlightedSegment: string | null;
  onSegmentHover: (code: string | null) => void;
}

const SegmentTable = ({ category, highlightedSegment, onSegmentHover }: SegmentTableProps) => {
  const sortedScores = useMemo(() => {
    // Only show segments that have geo data
    const withGeo = scores.filter(s => {
      const norm = s.code.replace(/[-\s]/g, '').replace(/^(PR|SR|TR)0*/, '$1').toUpperCase();
      return Object.keys(segments).some(k =>
        k.replace(/[-\s]/g, '').replace(/^(PR|SR|TR)0*/, '$1').toUpperCase() === norm
      );
    });
    return [...withGeo].sort((a, b) => getScoreForCategory(b, category) - getScoreForCategory(a, category));
  }, [category]);

  return (
    <div className="overflow-auto max-h-[calc(100vh-280px)]">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2 text-muted-foreground font-medium">Segment</th>
            <th className="text-right py-2 px-2 text-muted-foreground font-medium">Score</th>
            <th className="text-right py-2 px-2 text-muted-foreground font-medium">Rating</th>
          </tr>
        </thead>
        <tbody>
          {sortedScores.map(s => {
            const value = getScoreForCategory(s, category);
            const color = getScoreColor(value);
            const isActive = highlightedSegment === s.code;
            return (
              <tr
                key={s.code}
                className={`border-b border-border/50 cursor-pointer transition-colors ${
                  isActive ? 'bg-primary/10' : 'hover:bg-muted/50'
                }`}
                onMouseEnter={() => onSegmentHover(s.code)}
                onMouseLeave={() => onSegmentHover(null)}
              >
                <td className="py-1.5 px-2 font-mono font-medium">{s.code}</td>
                <td className="py-1.5 px-2 text-right font-bold" style={{ color }}>
                  {value.toFixed(1)}
                </td>
                <td className="py-1.5 px-2 text-right">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {getScoreLabel(value)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SegmentTable;
