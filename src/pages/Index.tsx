import { useState, useCallback } from 'react';
import nayichaalLogo from '@/assets/nayichaal-logo.png';
import StreetMap from '@/components/StreetMap';
import CategoryPanel from '@/components/CategoryPanel';
import ScoreLegend from '@/components/ScoreLegend';
import SegmentTable from '@/components/SegmentTable';
import StatsBar from '@/components/StatsBar';
import RadarChart from '@/components/RadarChart';
import AmenitySimulator from '@/components/AmenitySimulator';
import { CATEGORIES, type CategoryKey } from '@/data/streetData';
import { type PlacedAmenity } from '@/data/amenities';

const Index = () => {
  const [category, setCategory] = useState<CategoryKey>('index');
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [placedAmenities, setPlacedAmenities] = useState<PlacedAmenity[]>([]);
  const [activeAmenity, setActiveAmenity] = useState<string | null>(null);

  const handleSegmentClick = useCallback((code: string | null) => {
    setHighlighted(prev => {
      const next = prev === code ? null : code;
      if (!next) {
        // Clear amenities when deselecting
        setPlacedAmenities([]);
        setActiveAmenity(null);
      }
      return next;
    });
  }, []);

  const handlePlaceAmenity = useCallback((latlng: [number, number]) => {
    if (!activeAmenity) return;
    const uid = `${activeAmenity}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setPlacedAmenities(prev => [...prev, { uid, amenityId: activeAmenity, latlng }]);
  }, [activeAmenity]);

  const handleRemoveAmenity = useCallback((uid: string) => {
    setPlacedAmenities(prev => prev.filter(p => p.uid !== uid));
  }, []);

  const handleClearAll = useCallback(() => {
    setPlacedAmenities([]);
    setActiveAmenity(null);
  }, []);

  const activeCat = CATEGORIES.find(c => c.key === category)!;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <img src={nayichaalLogo} alt="NayiChaal" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                NayiChaal Street Index
              </h1>
              <p className="text-xs text-muted-foreground">
                Varanasi Street Assessment — March 2026
              </p>
            </div>
          </div>
          <ScoreLegend />
        </div>
        <div className="mt-3">
          <CategoryPanel activeCategory={category} onCategoryChange={setCategory} />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 p-2">
            <StreetMap
              category={category}
              highlightedSegment={highlighted}
              onSegmentClick={handleSegmentClick}
              placedAmenities={placedAmenities}
              activeAmenity={activeAmenity}
              onPlaceAmenity={handlePlaceAmenity}
            />
          </div>
          {/* Category info overlay */}
          <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border px-4 py-2 shadow-lg max-w-xs">
            <div className="text-sm font-semibold text-foreground">{activeCat.label}</div>
            <div className="text-xs text-muted-foreground">{activeCat.description}</div>
          </div>
          {/* Radar chart overlay */}
          {highlighted && (
            <div className="absolute bottom-4 left-4 z-[1000]">
              <RadarChart segmentCode={highlighted} onClose={() => setHighlighted(null)} placedAmenities={placedAmenities} />
            </div>
          )}
          {/* Amenity simulator overlay */}
          {highlighted && (
            <div className="absolute top-4 right-4 z-[1000]">
              <AmenitySimulator
                segmentCode={highlighted}
                placedAmenities={placedAmenities}
                activeAmenity={activeAmenity}
                onSelectAmenity={setActiveAmenity}
                onRemoveAmenity={handleRemoveAmenity}
                onClearAll={handleClearAll}
                onClose={() => setHighlighted(null)}
              />
            </div>
          )}
        </div>

        {/* Side panel */}
        <aside className="w-80 border-l border-border bg-card overflow-hidden flex flex-col shrink-0 hidden lg:flex">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">Statistics</h2>
            <StatsBar category={category} />
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-4 pt-3 pb-1">
              <h2 className="text-sm font-semibold text-foreground">Segments</h2>
            </div>
            <div className="flex-1 overflow-auto px-2">
              <SegmentTable
                category={category}
                highlightedSegment={highlighted}
                onSegmentHover={setHighlighted}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Index;
