import { CATEGORIES } from '@/data/streetData';

const CategoryPanel = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(cat => (
        <button
          key={cat.key}
          onClick={() => onCategoryChange(cat.key)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeCategory === cat.key
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground hover:bg-muted border border-border'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryPanel;
