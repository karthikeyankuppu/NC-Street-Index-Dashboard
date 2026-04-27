

## Add Live Weather Forecasts to Dashboard

Add a live weather widget to the NayiChaal Street Index dashboard showing current conditions for Godowlia, Varanasi (the area being visualized).

### What you'll see

A compact weather card in the header (next to the theme toggle) showing:
- Current temperature (°C)
- Weather condition (e.g., "Partly cloudy") with an icon
- Humidity and wind speed
- Auto-refreshes every 10 minutes

On hover/click, it expands to show a 3-day forecast (high/low temps + condition per day).

### Layout

```text
[Logo] [Category]                    [Weather 28°C ☀️] [Current Infra] [NayiChaal] [Future Infra] [3D] [Theme]
```

The widget matches the existing bordered, semi-transparent toggle-box styling so it visually fits with the other header controls. It adapts to dark/light theme.

### Technical approach

- **Data source**: Open-Meteo API (`https://api.open-meteo.com/v1/forecast`) — free, no API key required, no signup. Coordinates hardcoded to Godowlia, Varanasi (~25.31°N, 83.01°E).
- **New component**: `src/components/WeatherWidget.jsx`
  - `useEffect` fetches current weather + 3-day daily forecast on mount and every 10 minutes.
  - Local state: `weather`, `loading`, `error`, `expanded`.
  - Maps Open-Meteo `weathercode` values to friendly labels and `lucide-react` icons (Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog).
  - Graceful fallback: if fetch fails, shows a small "Weather unavailable" state instead of breaking the header.
- **Integration**: Import and render `<WeatherWidget />` inside the header controls row in `src/pages/Index.jsx`, before the infra toggle group.
- **Styling**: Reuses the existing `rounded-lg border border-border bg-background/40` pattern so it matches the other header boxes in both dark and light themes.

### Files

- **Create** `src/components/WeatherWidget.jsx` — the widget component with fetch logic, icon mapping, and expandable forecast.
- **Edit** `src/pages/Index.jsx` — import and place the widget in the header.

No new dependencies needed (`lucide-react` is already used).

