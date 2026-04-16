import { useMemo } from 'react';
import { getSignageBySegment, applySignageImpact, SIGNAGE_CATEGORIES } from '@/data/signageData';
import { getSegmentScore, getSegmentLabel, getScoreColor } from '@/data/streetData';

const SignageImpactPanel = () => {
  const impactData = useMemo(() => {
    const bySegment = getSignageBySegment();
    const results: { code: string; label: string; count: number; basIdx: number; newIdx: number; delta: number }[] = [];

    for (const [code, signs] of Object.entries(bySegment)) {
      const base = getSegmentScore(code);
      if (!base) continue;
      const projected = applySignageImpact(base, signs.length);
      results.push({
        code,
        label: getSegmentLabel(code),
        count: signs.length,
        basIdx: base.index,
        newIdx: projected.index,
        delta: projected.index - base.index,
      });
    }

    return results.sort((a, b) => b.delta - a.delta);
  }, []);

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-lg p-3 max-w-sm">
      <h3 className="text-xs font-semibold text-foreground mb-2">Wayfinding Signage Impact</h3>
      <div className="flex gap-3 mb-2 text-[10px]">
        {Object.entries(SIGNAGE_CATEGORIES).map(([key, cat]) => (
          <span key={key} className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
            {cat.label}
          </span>
        ))}
      </div>
      <div className="max-h-48 overflow-auto space-y-1">
        {impactData.map(d => (
          <div key={d.code} className="flex items-center justify-between text-xs gap-2 py-1 border-b border-border/50 last:border-0">
            <div className="truncate flex-1">
              <span className="text-foreground font-medium">{d.label}</span>
              <span className="text-muted-foreground ml-1">({d.count} signs)</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-muted-foreground">{d.basIdx.toFixed(1)}</span>
              <span className="text-foreground">→</span>
              <span className="font-semibold" style={{ color: getScoreColor(d.newIdx) }}>{d.newIdx.toFixed(1)}</span>
              <span className="text-emerald-400 text-[10px]">+{d.delta.toFixed(1)}</span>
            </div>
          </div>
        ))}
        {impactData.length === 0 && (
          <div className="text-muted-foreground text-xs text-center py-2">No signage near mapped segments</div>
        )}
      </div>
    </div>
  );
};

export default SignageImpactPanel;
