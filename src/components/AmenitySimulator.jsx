import { useMemo } from 'react';
import { getSegmentScore, getScoreColor, getScoreLabel, getSegmentLabel } from '@/data/streetData';
import { AMENITIES, applyPlacedAmenities, countAmenities } from '@/data/amenities';
import { X, TrendingUp, MousePointerClick, Trash2 } from 'lucide-react';

const AmenitySimulator = ({
  segmentCode,
  placedAmenities,
  activeAmenity,
  onSelectAmenity,
  onRemoveAmenity,
  onClearAll,
  onClose,
}) => {
  const base = getSegmentScore(segmentCode);

  const projected = useMemo(() => {
    if (!base) return null;
    return applyPlacedAmenities(base, placedAmenities);
  }, [base, placedAmenities]);

  if (!base || !projected) return null;

  const counts = countAmenities(placedAmenities);
  const totalPlaced = placedAmenities.length;

  const cats = [
    { key: 'walkability', label: 'Walkability' },
    { key: 'lighting', label: 'Lighting' },
    { key: 'transport', label: 'Transport' },
    { key: 'visibility', label: 'Visibility' },
    { key: 'accessibility', label: 'Accessibility' },
    { key: 'roadSafety', label: 'Road Safety' },
  ];

  const indexDelta = projected.index - base.index;

  return (
    <div className="bg-card border border-border rounded-xl shadow-2xl flex flex-col max-h-[80vh] w-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Urban Simulator</span>
        </div>
        <div className="flex items-center gap-1">
          {totalPlaced > 0 && (
            <button
              onClick={onClearAll}
              className="text-muted-foreground hover:text-destructive text-xs flex items-center gap-1 mr-2"
              title="Remove all"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Segment badge + index */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-foreground">{getSegmentLabel(segmentCode)}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Index</span>
            <span
              className="text-lg font-bold transition-all"
              style={{ color: getScoreColor(projected.index) }}
            >
              {projected.index.toFixed(1)}
            </span>
            {indexDelta > 0.05 && (
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

      {/* Instruction */}
      {activeAmenity && (
        <div className="px-4 py-2 bg-primary/10 border-b border-border shrink-0 flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs text-primary font-medium">
            Click on the map to place {AMENITIES.find(a => a.id === activeAmenity)?.label}
          </span>
          <button onClick={() => onSelectAmenity(null)} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
            Cancel
          </button>
        </div>
      )}

      {/* Amenity buttons */}
      <div className="px-4 py-3 overflow-auto flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">
          Click to select, then place on map
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {AMENITIES.map(a => {
            const isActive = activeAmenity === a.id;
            const count = counts[a.id] || 0;
            return (
              <button
                key={a.id}
                onClick={() => onSelectAmenity(isActive ? null : a.id)}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all text-xs relative ${
                  isActive
                    ? 'border-primary bg-primary/15 text-foreground ring-1 ring-primary'
                    : count > 0
                    ? 'border-primary/50 bg-primary/5 text-foreground'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground/50'
                }`}
              >
                <span className="text-base">{a.icon}</span>
                <span className="font-medium truncate">{a.label}</span>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Placed amenities list */}
      {totalPlaced > 0 && (
        <div className="px-4 py-2 border-t border-border shrink-0 max-h-28 overflow-auto">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">
            Placed ({totalPlaced})
          </p>
          <div className="space-y-0.5">
            {placedAmenities.map(p => {
              const def = AMENITIES.find(a => a.id === p.amenityId);
              if (!def) return null;
              return (
                <div key={p.uid} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-muted-foreground">
                    {def.icon} {def.label}
                  </span>
                  <button
                    onClick={() => onRemoveAmenity(p.uid)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Score breakdown */}
      {totalPlaced > 0 && (
        <div className="px-4 py-3 border-t border-border shrink-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">
            Score Changes
          </p>
          <div className="space-y-1.5">
            {cats.map(cat => {
              const before = base[cat.key];
              const after = projected[cat.key];
              const delta = after - before;
              if (delta < 0.05) return null;
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
