import { useMemo } from 'react';
import { scores, getScoreForCategory, segments, type CategoryKey } from '@/data/streetData';

interface StatsBarProps {
  category: CategoryKey;
}

const StatsBar = ({ category }: StatsBarProps) => {
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

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Average', value: stats.avg.toFixed(1), color: 'text-primary' },
        { label: 'Critical', value: stats.critical.toString(), color: 'text-score-critical' },
        { label: 'Segments', value: stats.total.toString(), color: 'text-foreground' },
      ].map(stat => (
        <div key={stat.label} className="bg-card rounded-lg border border-border p-3 text-center">
          <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
