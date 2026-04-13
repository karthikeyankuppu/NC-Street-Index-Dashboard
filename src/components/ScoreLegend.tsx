const LEGEND_ITEMS = [
  { label: 'Critical (0–20)', color: '#ef4444' },
  { label: 'Poor (21–35)', color: '#f97316' },
  { label: 'Fair (36–50)', color: '#eab308' },
  { label: 'Good (51–65)', color: '#22c55e' },
  { label: 'Excellent (66–100)', color: '#14b8a6' },
];

const ScoreLegend = () => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {LEGEND_ITEMS.map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div
            className="w-4 h-1 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ScoreLegend;
