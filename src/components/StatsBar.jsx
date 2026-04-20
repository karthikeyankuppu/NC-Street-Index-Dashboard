import { useMemo } from 'react';
import { scores, getScoreForCategory, segments } from '@/data/streetData';

const StatsBar = ({ category, criticalActive, onCriticalToggle }) => {
  const stats = useMemo(() => {
    const withGeo = scores.filter(s => {
      const norm = s.code.replace(/[-\s]/g, '').replace(/^(PR|SR|TR)0*/, '$1').toUpperCase();
      return Object.keys(segments).some(k =>
        k.replace(/[-\s]/g, '').replace(/^(PR|SR|TR)0*/, '$1').toUpperCase() === norm
      );
    });
    const values = withGeo.map(s => getScoreForCategory(s, category));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const critical = values.filter(v => v <= 20).length;
    const poor = values.filter(v => v > 20 && v <= 35).length;
    return { avg, min, max, total: values.length, critical, poor };
  }, [category]);

  const items = [
    { key: 'avg', label: 'Average', value: stats.avg.toFixed(1), color: 'text-primary', clickable: false },
    { key: 'critical', label: 'Critical', value: stats.critical.toString(), color: 'text-score-critical', clickable: true },
    { key: 'total', label: 'Segments', value: stats.total.toString(), color: 'text-foreground', clickable: false },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(stat => {
        const isActive = stat.key === 'critical' && criticalActive;
        const handleClick = stat.clickable ? onCriticalToggle : undefined;
        return (
          <button
            key={stat.label}
            type="button"
            onClick={handleClick}
            disabled={!stat.clickable}
            className={`bg-card rounded-lg border p-3 text-center transition-all ${
              stat.clickable ? 'cursor-pointer hover:border-score-critical/60' : 'cursor-default'
            } ${isActive ? 'border-score-critical ring-2 ring-score-critical/40' : 'border-border'}`}
          >
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
          </button>
        );
      })}
    </div>
  );
};

export default StatsBar;
