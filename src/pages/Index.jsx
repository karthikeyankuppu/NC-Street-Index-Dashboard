import { useState, useCallback, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import nayichaalLogo from '@/assets/nayichaal-logo.png';
import StreetMap from '@/components/StreetMap';
import CategoryPanel from '@/components/CategoryPanel';
import ScoreLegend from '@/components/ScoreLegend';
import SegmentTable from '@/components/SegmentTable';
import StatsBar from '@/components/StatsBar';
import RadarChart from '@/components/RadarChart';
import AmenitySimulator from '@/components/AmenitySimulator';
import WeatherWidget from '@/components/WeatherWidget';

import { CATEGORIES } from '@/data/streetData';
import { getSegmentCommentary, getImprovementLevers } from '@/data/segmentCommentary';
import { QUARTERS, SIGNAGE_CATEGORIES, SIGNAGE_POINTS } from '@/data/signageData';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';
import { CalendarDays } from 'lucide-react';

const THEME_KEY = 'nc-theme';

const Index = () => {
  const [category, setCategory] = useState('index');
  const [highlighted, setHighlighted] = useState(null);
  // Per-segment amenities map: { [segmentCode]: [{ uid, amenityId }, ...] }
  const [amenitiesBySegment, setAmenitiesBySegment] = useState({});
  const [showSignage, setShowSignage] = useState(false);
  const [signageQuarter, setSignageQuarter] = useState(1);
  const [is3D, setIs3D] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [showCurrentCameras, setShowCurrentCameras] = useState(false);
  const [showNayichaalCameras, setShowNayichaalCameras] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem(THEME_KEY) || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const placedAmenities = highlighted ? (amenitiesBySegment[highlighted] || []) : [];

  const handleSegmentClick = useCallback((code) => {
    // Toggle highlight; preserve placed amenities for that segment
    setHighlighted(prev => (prev === code ? null : code));
  }, []);

  const handleTableSelect = handleSegmentClick;

  const handleIncrementAmenity = useCallback((amenityId) => {
    if (!highlighted) return;
    const uid = `${amenityId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setAmenitiesBySegment(prev => ({
      ...prev,
      [highlighted]: [...(prev[highlighted] || []), { uid, amenityId }],
    }));
  }, [highlighted]);

  const handleDecrementAmenity = useCallback((amenityId) => {
    if (!highlighted) return;
    setAmenitiesBySegment(prev => {
      const list = prev[highlighted] || [];
      const idx = [...list].reverse().findIndex(p => p.amenityId === amenityId);
      if (idx === -1) return prev;
      const realIdx = list.length - 1 - idx;
      return {
        ...prev,
        [highlighted]: list.filter((_, i) => i !== realIdx),
      };
    });
  }, [highlighted]);

  const handleClearAll = useCallback(() => {
    if (!highlighted) return;
    setAmenitiesBySegment(prev => ({ ...prev, [highlighted]: [] }));
  }, [highlighted]);

  const activeCat = CATEGORIES.find(c => c.key === category);

  return (
    <TooltipProvider delayDuration={150}>
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <img src={nayichaalLogo} alt="NayiChaal" className="h-12 w-auto" />
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                NayiChaal Street Index
              </h1>
              <p className="text-xs text-muted-foreground">
                Varanasi Street Assessment — March 2026
              </p>
            </div>
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            {/* Live Weather */}
            <WeatherWidget />

            {/* Current Infra */}
            <div className="rounded-lg border border-border bg-background/40 px-2.5 pt-1 pb-2">
              <div className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground mb-1 px-0.5">
                Current Infra
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5">
                <Switch id="cur-cam-toggle" checked={showCurrentCameras} onCheckedChange={setShowCurrentCameras} />
                <Label htmlFor="cur-cam-toggle" className="text-xs text-foreground cursor-pointer whitespace-nowrap">
                  Current Cameras
                </Label>
              </div>
            </div>

            {/* Current NayiChaal Infra */}
            <div className="rounded-lg border border-border bg-background/40 px-2.5 pt-1 pb-2">
              <div className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground mb-1 px-0.5">
                Current NayiChaal Infra
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5">
                <Switch id="nc-cam-toggle" checked={showNayichaalCameras} onCheckedChange={setShowNayichaalCameras} />
                <Label htmlFor="nc-cam-toggle" className="text-xs text-foreground cursor-pointer whitespace-nowrap">
                  NayiChaal Cameras
                </Label>
              </div>
            </div>

            {/* Future Infra */}
            <div className="rounded-lg border border-border bg-background/40 px-2.5 pt-1 pb-2">
              <div className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground mb-1 px-0.5">
                Future Infra
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Urban Simulator toggle box */}
                <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5">
                  <Switch id="sim-toggle" checked={showSimulator} onCheckedChange={setShowSimulator} />
                  <Label htmlFor="sim-toggle" className="text-xs text-foreground cursor-pointer whitespace-nowrap">
                    Urban Simulator
                  </Label>
                </div>

                {/* Wayfinding toggle box (with optional dropdown inside) */}
                <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Switch id="signage-toggle" checked={showSignage} onCheckedChange={setShowSignage} />
                        <Label htmlFor="signage-toggle" className="text-xs text-foreground cursor-pointer whitespace-nowrap">
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
                    <div className="w-64">
                      <Select value={String(signageQuarter)} onValueChange={(v) => setSignageQuarter(Number(v))}>
                        <SelectTrigger className="h-7 w-64 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {QUARTERS.map(q => (
                            <SelectItem key={q.id} value={String(q.id)} className="text-xs">
                              {q.label} • {q.months}
                              {q.festivals.length > 0 && (
                                <span className="text-muted-foreground"> — {q.festivals.join(', ')}</span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* 3D toggle box (standalone) */}
            <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5">
              <Switch
                id="3d-toggle"
                checked={is3D}
                onCheckedChange={setIs3D}
                className={is3D ? '!bg-score-excellent' : ''}
              />
              <Label
                htmlFor="3d-toggle"
                className={`text-xs cursor-pointer font-semibold ${is3D ? 'text-score-excellent' : 'text-foreground'}`}
              >
                3D
              </Label>
            </div>

            {/* Theme toggle (standalone) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5 hover:bg-background transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-secondary" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
              <span className="text-xs font-semibold text-foreground">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>
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
              highlightedSegment={highlighted || hovered}
              onSegmentClick={handleSegmentClick}
              showSignage={showSignage}
              signageQuarter={signageQuarter}
              is3D={is3D}
              criticalOnly={criticalOnly}
              showCurrentCameras={showCurrentCameras}
              showNayichaalCameras={showNayichaalCameras}
              theme={theme}
            />
          </div>
          {/* Category info overlay */}
          {!highlighted && (
            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border px-4 py-2 shadow-lg max-w-xs">
              <div className="text-sm font-semibold text-foreground">{activeCat.label}</div>
              <div className="text-xs text-muted-foreground">{activeCat.description}</div>
            </div>
          )}
          {/* Radar chart + commentary (top-left) */}
          {highlighted && (
            <div className="absolute top-4 left-4 z-[1000] w-[260px] max-h-[calc(100%-2rem)] overflow-auto space-y-2">
              <RadarChart segmentCode={highlighted} onClose={() => setHighlighted(null)} placedAmenities={placedAmenities} />
              {(() => {
                const commentary = getSegmentCommentary(highlighted);
                const levers = getImprovementLevers(highlighted);
                return (
                  <>
                    {commentary && (
                      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">
                          Insight
                        </p>
                        <p className="text-xs text-foreground leading-relaxed">
                          {commentary}
                        </p>
                      </div>
                    )}
                    {levers && (
                      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">
                          Urban Improvement Levers
                        </p>
                        <p className="text-xs text-foreground leading-relaxed font-bold">
                          {levers}
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
          {/* Urban Simulator (top-right) */}
          {highlighted && showSimulator && (
            <div className="absolute top-4 right-4 z-[1000] w-[340px] max-h-[calc(100%-2rem)]">
              <AmenitySimulator
                segmentCode={highlighted}
                placedAmenities={placedAmenities}
                onIncrement={handleIncrementAmenity}
                onDecrement={handleDecrementAmenity}
                onClearAll={handleClearAll}
                onClose={() => setShowSimulator(false)}
              />
            </div>
          )}
          {/* Score legend (bottom-left) */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg px-3 py-2">
            <ScoreLegend />
          </div>
          {/* Wayfinding legend (bottom-right to avoid overlap with left-side panels) */}
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
            <StatsBar
              category={category}
              criticalActive={criticalOnly}
              onCriticalToggle={() => setCriticalOnly(v => !v)}
            />
          </div>
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="px-4 pt-3 pb-1 shrink-0 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Segments</h2>
              {criticalOnly && (
                <button
                  onClick={() => setCriticalOnly(false)}
                  className="text-[10px] uppercase tracking-wider text-score-critical hover:underline"
                >
                  Critical only ✕
                </button>
              )}
            </div>
            <div className="flex-1 overflow-auto px-2 min-h-0">
              <SegmentTable
                category={category}
                highlightedSegment={highlighted}
                onSegmentHover={setHovered}
                onSegmentClick={handleTableSelect}
                showSignageImpact={showSignage}
                signageQuarter={signageQuarter}
                criticalOnly={criticalOnly}
                showSimulator={showSimulator}
                placedAmenities={placedAmenities}
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
