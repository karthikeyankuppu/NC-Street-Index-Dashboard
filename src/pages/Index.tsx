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
import { QUARTERS, SIGNAGE_CATEGORIES, SIGNAGE_POINTS } from '@/data/signageData';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarDays } from 'lucide-react';

const Index = () => {
  const [category, setCategory] = useState<CategoryKey>('index');
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [placedAmenities, setPlacedAmenities] = useState<PlacedAmenity[]>([]);
  const [activeAmenity, setActiveAmenity] = useState<string | null>(null);
  const [showSignage, setShowSignage] = useState(false);
  const [signageQuarter, setSignageQuarter] = useState<number>(1);
  const [is3D, setIs3D] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [criticalOnly, setCriticalOnly] = useState(false);

  const handleSegmentClick = useCallback((code: string | null) => {
    setHighlighted(prev => {
      const next = prev === code ? null : code;
      if (!next) {
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
    <TooltipProvider delayDuration={150}>
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
          <div className="flex items-center gap-4">
            {/* Toggles */}
            <div className="flex items-center gap-2">
              <Switch id="3d-toggle" checked={is3D} onCheckedChange={setIs3D} />
              <Label htmlFor="3d-toggle" className="text-xs text-muted-foreground cursor-pointer">3D</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="sim-toggle" checked={showSimulator} onCheckedChange={setShowSimulator} />
              <Label htmlFor="sim-toggle" className="text-xs text-muted-foreground cursor-pointer">
                Urban Amenity Simulation
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Switch id="signage-toggle" checked={showSignage} onCheckedChange={setShowSignage} />
                    <Label htmlFor="signage-toggle" className="text-xs text-muted-foreground cursor-pointer">
                      Wayfinding Masterplan (NayiChaal Saarthi)
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="text-xs font-semibold mb-1.5 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" /> Festivals by Quarter
                  </div>
                  <div className="space-y-1">
                    {QUARTERS.map(q => (
                      <div key={q.id} className="text-[11px]">
                        <span className="font-semibold">{q.label} ({q.months}):</span>{' '}
                        <span className="text-muted-foreground">
                          {q.festivals.length ? q.festivals.join(', ') : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
              {showSignage && (
                <Select value={String(signageQuarter)} onValueChange={(v) => setSignageQuarter(Number(v))}>
                  <SelectTrigger className="h-7 w-44 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUARTERS.map(q => (
                      <SelectItem key={q.id} value={String(q.id)} className="text-xs">
                        {q.label} • {q.months}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <ScoreLegend />
          </div>
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
              showSignage={showSignage}
              signageQuarter={signageQuarter}
              is3D={is3D}
            />
          </div>
          {/* Category info overlay */}
          {!highlighted && (
            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border px-4 py-2 shadow-lg max-w-xs">
              <div className="text-sm font-semibold text-foreground">{activeCat.label}</div>
              <div className="text-xs text-muted-foreground">{activeCat.description}</div>
            </div>
          )}
          {/* Radar chart + Simulator (radar on top) */}
          {highlighted && (
            <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3 max-h-[calc(100%-2rem)] overflow-auto">
              <RadarChart segmentCode={highlighted} onClose={() => setHighlighted(null)} placedAmenities={placedAmenities} />
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
          {/* Wayfinding legend (bottom-right) */}
          {showSignage && (
            <div className="absolute bottom-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg px-3 py-2.5 text-xs max-w-[220px]">
              <div className="font-semibold text-foreground mb-1.5">
                Wayfinding • {QUARTERS.find(q => q.id === signageQuarter)?.label}
              </div>
              <div className="space-y-1">
                {Object.entries(SIGNAGE_CATEGORIES).map(([key, info]) => {
                  const count = SIGNAGE_POINTS.filter(sp => sp.quarter === signageQuarter && sp.category === key).length;
                  if (count === 0) return null;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center justify-center rounded-full text-[10px] shrink-0"
                        style={{ background: info.color, width: 18, height: 18, border: '1.5px solid white' }}
                      >
                        {info.icon}
                      </span>
                      <span className="text-muted-foreground flex-1 truncate">{info.label}</span>
                      <span className="text-foreground font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <aside className="w-80 border-l border-border bg-card overflow-hidden flex flex-col shrink-0 hidden lg:flex">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">Statistics</h2>
            <StatsBar category={category} />
          </div>
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="px-4 pt-3 pb-1 shrink-0">
              <h2 className="text-sm font-semibold text-foreground">Segments</h2>
            </div>
            <div className="flex-1 overflow-auto px-2 min-h-0">
              <SegmentTable
                category={category}
                highlightedSegment={highlighted}
                onSegmentHover={setHighlighted}
                showSignageImpact={showSignage}
                signageQuarter={signageQuarter}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default Index;
