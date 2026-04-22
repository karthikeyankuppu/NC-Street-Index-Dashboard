import { useMemo } from 'react';
import { scores, getScoreColor, getScoreForCategory, getScoreLabel, getSegmentLabel, segments } from '@/data/streetData';
import { getSignageBySegment, applySignageImpact } from '@/data/signageData';
import { applyPlacedAmenities } from '@/data/amenities';

const SegmentTable = ({
  category,
  highlightedSegment,
  onSegmentHover,
  onSegmentClick,
  showSignageImpact,
  signageQuarter,
  criticalOnly,
  showSimulator,
  placedAmenities = [],
}) => {
  const signageBySegment = useMemo(
    () => showSignageImpact ? getSignageBySegment(signageQuarter) : {},
    [showSignageImpact, signageQuarter]
  );

  // Only apply simulator amenities to the currently highlighted segment
  const simulatorActive = showSimulator && placedAmenities.length > 0 && highlightedSegment;

  const projectedColumnLabel = useMemo(() => {
    if (showSignageImpact && simulatorActive) return 'w/ Saarthi + Sim';
    if (showSignageImpact) return 'w/ Saarthi';
    if (simulatorActive) return 'w/ Sim';
    return null;
  }, [showSignageImpact, simulatorActive]);

  const showProjectedColumn = projectedColumnLabel !== null;

  const sortedScores = useMemo(() => {
    const withGeo = scores.filter(s => {
      const norm = s.code.replace(/[-\s]/g, '').replace(/^(PR|SR|TR)0*/, '$1').toUpperCase();
      return Object.keys(segments).some(k =>
        k.replace(/[-\s]/g, '').replace(/^(PR|SR|TR)0*/, '$1').toUpperCase() === norm
      );
    });
    const filtered = criticalOnly
      ? withGeo.filter(s => getScoreForCategory(s, category) <= 20)
      : withGeo;
    return [...filtered].sort((a, b) => getScoreForCategory(b, category) - getScoreForCategory(a, category));
  }, [category, criticalOnly]);

  return (
    <div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2 text-muted-foreground font-medium">Segment</th>
            <th className="text-right py-2 px-2 text-muted-foreground font-medium whitespace-nowrap">Current Score</th>
            {showProjectedColumn && (
              <th className="text-right py-2 px-2 text-muted-foreground font-medium whitespace-nowrap">
                {projectedColumnLabel}
              </th>
            )}
            <th className="text-right py-2 px-2 text-muted-foreground font-medium">Rating</th>
          </tr>
        </thead>
        <tbody>
          {sortedScores.map(s => {
            const value = getScoreForCategory(s, category);
            const color = getScoreColor(value);
            const isActive = highlightedSegment === s.code;

            // Build projected score: layer signage first, then simulator amenities (only on highlighted segment)
            let projected = null;
            if (showSignageImpact) {
              const signs = signageBySegment[s.code];
              if (signs) projected = applySignageImpact(s, signs.length);
            }
            if (simulatorActive && s.code === highlightedSegment) {
              projected = applyPlacedAmenities(projected || s, placedAmenities);
            }

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
                onClick={() => onSegmentClick?.(s.code)}
              >
                <td className="py-1.5 px-2 font-mono font-medium">{getSegmentLabel(s.code)}</td>
                <td className="py-1.5 px-2 text-right font-bold" style={{ color }}>
                  {value.toFixed(1)}
                </td>
                {showProjectedColumn && (
                  <td className="py-1.5 px-2 text-right">
                    {projValue !== null ? (
                      <span className="flex items-center justify-end gap-1">
                        <span className="font-bold" style={{ color: getScoreColor(projValue) }}>
                          {projValue.toFixed(1)}
                        </span>
                        {delta > 0 && (
                          <span className="text-score-good text-[10px]">+{delta.toFixed(1)}</span>
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
