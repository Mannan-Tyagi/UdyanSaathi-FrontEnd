# UdyanSaathi Copilot Instructions

## Project Overview
UdyanSaathi is an environmental intelligence platform monitoring **Air Quality (AQI)**, **Weather**, and **Water Quality** across India. It features ML-powered forecasting, real-time data visualization, and ward-level policy simulation.

## Architecture

### Monorepo Structure
```
UdyanSaathi-FrontEnd/    # React + Vite + Tailwind frontend
UdyanSaathiAPI/          # Django REST API backend
```

### Frontend Stack
- **React 18** with JSX (not TypeScript)
- **Vite 5** for bundling
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **React Leaflet** for maps
- **Recharts/D3** for data visualization

### Backend Stack
- **Django REST Framework** with Azure MySQL database
- API Base URL configured in `src/components/Connectivity/storageHelper.js`

## Design System (CRITICAL)

### Custom Tailwind Colors - Always use these instead of default Tailwind colors:
```js
// Text
text-ink       // #1A202C - Headings
text-metal     // #718096 - Body text  
text-muted     // #A0AEC0 - Placeholders

// Backgrounds
bg-canvas      // #F1F5F9 - Page background
bg-surface     // #FFFFFF - Card backgrounds

// Status indicators
text-status-good      // #48BB78 - Green
text-status-moderate  // #ED8936 - Orange
text-status-critical  // #F56565 - Red
text-primary          // #4A90E2 - Blue accent

// Borders
border-mist    // #E2E8F0 - Soft borders
```

### Card Pattern
All dashboard cards follow this glassmorphism pattern:
```jsx
<div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-5">
```

### Shadows
Use `shadow-soft`, `shadow-soft-sm`, `shadow-soft-lg` instead of default shadows.

## Component Patterns

### Page Wrapper
Pages use `UnifiedPageBackground` for seamless animated grid background:
```jsx
import UnifiedPageBackground from '@/components/ui/unified-page-background';
<UnifiedPageBackground>{/* page content */}</UnifiedPageBackground>
```

### Path Alias
Import from `@/` which maps to `./src/`:
```jsx
import { cn } from '@/lib/utils';  // Tailwind class merger (clsx + tailwind-merge)
```

### API Data Fetching
Use `getBaseUrl()` from storageHelper for all API calls:
```jsx
import { getBaseUrl, getStationName } from '../Connectivity/storageHelper';
const baseurl = getBaseUrl();
const response = await fetch(`${baseurl}get-MapData/`);
```

### Component Naming
- Components in `AirQuality/` folder use `Component3`, `Component4`, etc. naming
- Prefer descriptive imports: `import Component3 from "./MostPollutedCities"`

## Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/` | AirQualityPage | Main AQI dashboard |
| `/weather` | WeatherMoniter | Weather monitoring |
| `/wards` | WardComparison | Ward-level comparison |
| `/policy-simulator` | WardPolicySimulator | Policy simulation |
| `/dispatch` | DispatchDashboard | Resource dispatch |

## Backend API Endpoints
All endpoints are GET with query params:
- `get-pollution-by-date-station/?pol_Station=<name>`
- `get-Top10Cities/?to_date=<days>` (1, 6, or 30)
- `get-MLData/?pol_Station=<name>` - 3-day ML forecast
- `get-MapData/` - All station AQI data for map
- `get-AqiCalData/?pol_Station=<name>` - Heatmap data

## Development Commands
```bash
# Frontend
cd UdyanSaathi-FrontEnd
npm run dev          # Start Vite dev server
npm run build        # Production build

# Backend
cd UdyanSaathiAPI
python manage.py runserver
```

## Key Conventions
1. **No TypeScript** - Use JSX with `/* eslint-disable react/prop-types */` when needed
2. **Animations** - Use Framer Motion's `motion.div` with `whileInView` for scroll animations
3. **Loading states** - Show skeleton loaders with `animate-pulse` class
4. **Icons** - Prefer inline SVG over icon libraries for consistency
5. **AQI Coloring** - Use `status-good/moderate/critical` or `aqi-*` colors based on value ranges:
   - 0-50: good (green)
   - 51-100: moderate (yellow)
   - 101-200: poor (orange)
   - 200+: severe/critical (red)

## File Organization
- `/src/pages/` - Route-level page components
- `/src/components/AirQuality/` - AQI dashboard components
- `/src/components/ui/` - Reusable UI primitives
- `/src/components/navbar/` - Navigation variants
- `/src/lib/utils.js` - `cn()` utility for class merging
