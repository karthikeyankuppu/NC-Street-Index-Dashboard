import { scores, getScoreColor, getScoreForCategory, getScoreLabel, getSegmentLabel, segments, type CategoryKey } from '@/data/streetData';
import { getSignageBySegment, applySignageImpact } from '@/data/signageData';
import { useMemo } from 'react';

interface SegmentTableProps {
  category: CategoryKey;
  highlightedSegment: string | null;
  onSegmentHover: (code: string | null) => void;
  showSignageImpact?: boolean;
  signageQuarter?: number;
}

const SegmentTable = ({ category, highlightedSegment, onSegmentHover, showSignageImpact, signageQuarter }: SegmentTableProps) => {
  const signageBySegment = useMemo(() => showSignageImpact ? getSignageBySegment(signageQuarter) : {}, [showSignageImpact, signageQuarter]);

  const sortedScores = useMemo(() => {
    const withGeo = scores.filter(s => {
      const norm = s.code.replace(/[-\s]/g, '').replace(/^(PR|SR|TR)0*/, '$1').toUpperCase();
      return Object.keys(segments).some(k =>
        k.replace(/[-\s]/g, '').replace(/^(PR|SR|TR)0*/, '$1').toUpperCase() === norm
      );
    });
    return [...withGeo].sort((a, b) => getScoreForCategory(b, category) - getScoreForCategory(a, category));
  }, [category]);

  return (
    <div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2 text-muted-foreground font-medium">Segment</th>
            <th className="text-right py-2 px-2 text-muted-foreground font-medium">Score</th>
            {showSignageImpact && (
              <th className="text-right py-2 px-2 text-muted-foreground font-medium">w/ Saarthi</th>
            )}
            <th className="text-right py-2 px-2 text-muted-foreground font-medium">Rating</th>
          </tr>
        </thead>
        <tbody>
          {sortedScores.map(s => {
            const value = getScoreForCategory(s, category);
            const color = getScoreColor(value);
            const isActive = highlightedSegment === s.code;
            const signs = signageBySegment[s.code];
            const projected = signs ? applySignageImpact(s, signs.length) : null;
            const projValue = projected ? getScoreForCategory(projected, category) : null;
            const delta = projValue !== null ? projValue - value : 0;

            return (
              <tr
                key={s.code}
                className={`border-b border-border/50 cursor-pointer transition-colors ${
                  isActive ? 'bg-primary/10' : 'hover:bg-muted/50'
                }`}
                onMouseEnter={() => onSegmentHover(s.code)}
                onMouseLeave={() => onSegmentHover(null)}
              >
                <td className="py-1.5 px-2 font-mono font-medium">{getSegmentLabel(s.code)}</td>
                <td className="py-1.5 px-2 text-right font-bold" style={{ color }}>
                  {value.toFixed(1)}
                </td>
                {showSignageImpact && (
                  <td className="py-1.5 px-2 text-right">
                    {projValue !== null ? (
                      <span className="flex items-center justify-end gap-1">
                        <span className="font-bold" style={{ color: getScoreColor(projValue) }}>
                          {projValue.toFixed(1)}
                        </span>
                        {delta > 0 && (
                          <span className="text-emerald-400 text-[10px]">+{delta.toFixed(1)}</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                )}
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
