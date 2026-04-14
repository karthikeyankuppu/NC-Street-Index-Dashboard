import { useState, useMemo } from 'react';
import { getSegmentScore, getScoreColor, getScoreLabel } from '@/data/streetData';
import { AMENITIES, applyAmenities } from '@/data/amenities';
import { X, TrendingUp } from 'lucide-react';

interface Props {
  segmentCode: string;
  onClose: () => void;
}

const AmenitySimulator = ({ segmentCode, onClose }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const base = getSegmentScore(segmentCode);

  const projected = useMemo(() => {
    if (!base) return null;
    return applyAmenities(base, selected);
  }, [base, selected]);

  if (!base || !projected) return null;

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const cats: { key: keyof typeof base; label: string }[] = [
    { key: 'walkability', label: 'Walkability' },
    { key: 'lighting', label: 'Lighting' },
    { key: 'transport', label: 'Transport' },
    { key: 'visibility', label: 'Visibility' },
    { key: 'accessibility', label: 'Accessibility' },
    { key: 'roadSafety', label: 'Road Safety' },
  ];

  const indexDelta = projected.index - base.index;

  return (
    <div className="bg-card border border-border rounded-xl shadow-2xl flex flex-col max-h-[80vh] w-[360px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">What-If Simulator</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Segment badge + index */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-foreground">{segmentCode}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Index</span>
            <span
              className="text-lg font-bold transition-all"
              style={{ color: getScoreColor(projected.index) }}
            >
              {projected.index.toFixed(1)}
            </span>
            {indexDelta > 0 && (
              <span className="text-xs font-semibold text-score-excellent bg-score-excellent/10 px-1.5 py-0.5 rounded">
                +{indexDelta.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${projected.index}%`,
                backgroundColor: getScoreColor(projected.index),
              }}
            />
          </div>
          <span className="text-[10px] font-semibold" style={{ color: getScoreColor(projected.index) }}>
            {getScoreLabel(projected.index)}
          </span>
        </div>
      </div>

      {/* Amenity toggles */}
      <div className="px-4 py-3 overflow-auto flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">
          Add Amenities
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {AMENITIES.map(a => {
            const active = selected.includes(a.id);
            return (
              <button
                key={a.id}
                onClick={() => toggle(a.id)}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all text-xs ${
                  active
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground/50'
                }`}
              >
                <span className="text-base">{a.icon}</span>
                <span className="font-medium truncate">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Score breakdown */}
      {selected.length > 0 && (
        <div className="px-4 py-3 border-t border-border shrink-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">
            Score Changes
          </p>
          <div className="space-y-1.5">
            {cats.map(cat => {
              const before = base[cat.key] as number;
              const after = projected[cat.key] as number;
              const delta = after - before;
              if (delta === 0) return null;
              return (
                <div key={cat.key} className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground w-20 truncate">{cat.label}</span>
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${after}%`, backgroundColor: getScoreColor(after) }}
                    />
                  </div>
                  <span className="font-mono text-[10px] w-8 text-right" style={{ color: getScoreColor(after) }}>
                    {after.toFixed(0)}
                  </span>
                  <span className="text-score-excellent font-semibold text-[10px] w-6 text-right">
                    +{delta.toFixed(0)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AmenitySimulator;
