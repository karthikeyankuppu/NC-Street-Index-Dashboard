import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Droplets,
  Wind,
  ChevronDown,
} from 'lucide-react';

// Godowlia, Varanasi
const LAT = 25.3109;
const LON = 83.0107;
const REFRESH_MS = 10 * 60 * 1000;

// WMO weather code → label + icon
const codeMap = (code) => {
  if (code === 0) return { label: 'Clear', Icon: Sun };
  if ([1, 2].includes(code)) return { label: 'Partly cloudy', Icon: Cloud };
  if (code === 3) return { label: 'Overcast', Icon: Cloud };
  if ([45, 48].includes(code)) return { label: 'Fog', Icon: CloudFog };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', Icon: CloudDrizzle };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Rain', Icon: CloudRain };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snow', Icon: CloudSnow };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', Icon: CloudLightning };
  return { label: 'Conditions', Icon: Cloud };
};

const formatDay = (iso, idx) => {
  if (idx === 0) return 'Today';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

export default function WeatherWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const wrapRef = useRef(null);

  const fetchWeather = useCallback(async () => {
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
        `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&forecast_days=3&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('fetch failed');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError('Weather unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    const id = setInterval(fetchWeather, REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchWeather]);

  // close expanded panel on outside click
  useEffect(() => {
    if (!expanded) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setExpanded(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [expanded]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5">
        <Cloud className="w-4 h-4 text-muted-foreground animate-pulse" />
        <span className="text-xs text-muted-foreground">Loading…</span>
      </div>
    );
  }

  if (error || !data?.current) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5">
        <Cloud className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Weather unavailable</span>
      </div>
    );
  }

  const cur = data.current;
  const { label, Icon } = codeMap(cur.weather_code);
  const temp = Math.round(cur.temperature_2m);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        title={`Varanasi • ${label}`}
        className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5 hover:bg-background transition-colors"
      >
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">{temp}°C</span>
        <span className="text-xs text-muted-foreground hidden sm:inline">{label}</span>
        <ChevronDown
          className={`w-3 h-3 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="absolute right-0 top-full mt-2 z-[1100] w-64 rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Varanasi • Godowlia
              </div>
              <div className="text-xs text-foreground font-semibold">{label}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold text-foreground">{temp}°</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border pt-2">
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              <span>{Math.round(cur.relative_humidity_2m)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-3 h-3" />
              <span>{Math.round(cur.wind_speed_10m)} km/h</span>
            </div>
          </div>

          {data.daily && (
            <div className="mt-3 border-t border-border pt-2">
              <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">
                3-Day Forecast
              </div>
              <div className="space-y-1.5">
                {data.daily.time.slice(0, 3).map((iso, i) => {
                  const { label: dl, Icon: DI } = codeMap(data.daily.weather_code[i]);
                  return (
                    <div key={iso} className="flex items-center justify-between text-xs">
                      <span className="text-foreground font-medium w-12">{formatDay(iso, i)}</span>
                      <div className="flex items-center gap-1.5 flex-1">
                        <DI className="w-3.5 h-3.5 text-primary" />
                        <span className="text-muted-foreground truncate">{dl}</span>
                      </div>
                      <span className="text-foreground font-semibold tabular-nums">
                        {Math.round(data.daily.temperature_2m_max[i])}° /{' '}
                        <span className="text-muted-foreground">
                          {Math.round(data.daily.temperature_2m_min[i])}°
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
