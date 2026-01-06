# SkyCast - Beautiful Weather App

A modern, responsive weather application built with React featuring a stunning **Neumorphic (Soft UI)** design. Get real-time weather updates, hourly forecasts, and weekly predictions.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?style=flat&logo=vite)
![CSS](https://img.shields.io/badge/CSS-Custom-1572B6?style=flat&logo=css3)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel)

---

## Project Overview

| Field | Details |
|-------|---------|
| **Project Name** | SkyCast |
| **Developer** | Mahima KG |
| **Library** | React 18 |
| **Build Tool** | Vite 6 |
| **IDE Used** | Visual Studio Code |
| **Deployment** | Vercel |
| **Design Style** | Neumorphism (Soft UI) |

---

## Features

### Core Features
- **Real-time Weather Data** - Current temperature, feels like, wind speed, humidity
- **6-Day Weekly Forecast** - Daily temperature and conditions
- **6-Hour Hourly Forecast** - Hour-by-hour predictions
- **20+ Weather Conditions** - Comprehensive WMO weather code mapping

### Location Features
- **Auto-detect Location** - Uses browser Geolocation API
- **Manual Location Search** - Search any city worldwide
- **Reverse Geocoding** - Converts coordinates to city names
- **Current Location Refresh** - Re-fetch your location anytime

### User Experience
- **Location Permission Handling** - Graceful permission flow with retry (max 3 attempts)
- **"Skip & Search Manually"** - Option to bypass location permission
- **Loading States** - Animated spinners with minimum display time
- **Auto-capitalize Search** - Automatic capitalization while typing
- **Live Clock** - Real-time clock with dynamic greetings

### About/Credits Modal
- **Floating Lightbulb Button** - Bottom-right corner
- **Glow Animation** - Lightbulb turns yellow on hover
- **Project Credits** - Developer info, APIs used, inspiration

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | UI library |
| React DOM | ^18.3.1 | DOM renderer |

### Build & Development
| Tool | Version | Purpose |
|------|---------|---------|
| Vite | ^6.0.5 | Build tool & dev server |
| ESLint | ^9.17.0 | Code linting |
| eslint-plugin-react | ^7.37.2 | React linting rules |
| eslint-plugin-react-hooks | ^5.0.0 | Hooks linting |

### APIs Used (Free, No API Key Required)
| API | Endpoint | Purpose |
|-----|----------|---------|
| Open-Meteo Weather | `api.open-meteo.com/v1/forecast` | Weather data |
| Open-Meteo Geocoding | `geocoding-api.open-meteo.com/v1/search` | Location search |
| BigDataCloud | `api.bigdatacloud.net/data/reverse-geocode-client` | Reverse geocoding |

### Styling
| Resource | Details |
|----------|---------|
| CSS | 100% Custom (1,078 lines) |
| Design | Neumorphic/Soft UI |
| Font | [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts) |
| Icons | Custom SVG components |

---

## Design

### UI Inspiration
Design inspired by [Weather Web App on Dribbble](https://dribbble.com/shots/15524720-Weather-web-app)

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#e4e4e4` | Main background |
| Shadow Dark | `#c2c2c2` | Neumorphic shadow |
| Shadow Light | `#ffffff` | Neumorphic highlight |
| Text Primary | `#5a5a5a` | Headings |
| Text Secondary | `#7a7a7a` | Labels |
| Lightbulb Glow | `#f5c842` | Hover effect |

### Responsive Design
- **Desktop** (> 768px) - Side-by-side panels
- **Tablet** (≤ 768px) - Stacked layout
- **Mobile** (≤ 480px) - Compact spacing

---

## Project Structure

```
SkyCast-React/
├── public/
│   └── favicon.ico
├── src/
│   ├── App.jsx          # Main component (706 lines)
│   ├── App.css          # All styles (1,078 lines)
│   └── main.jsx         # Entry point
├── index.html           # HTML with meta tags
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SkyCast-React

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Components

| Component | Purpose |
|-----------|---------|
| `App` | Main application with all state management |
| `LocationModal` | Permission request modal |
| `CreditsModal` | About/credits popup |
| `LoadingState` | Loading spinner view |
| `FetchingLocationModal` | Location fetch progress |
| `SearchingModal` | Search progress modal |
| `ErrorState` | Error display with retry |

### SVG Icon Components
- `SearchIcon` - Magnifier
- `WindIcon` - Wind indicator
- `HumidityIcon` - Water droplet
- `LocationIcon` - Map pin
- `ArrowIcon` - Submit arrow
- `CurrentLocationIcon` - GPS crosshair
- `LightbulbIcon` - Info button
- `CloseIcon` - X close
- `ExternalLinkIcon` - External link

---

## State Management

Using React's `useState` hook with 13 state variables:

```javascript
weatherData          // Weather information object
loading              // Initial loading state
searchLoading        // Search in progress
error                // Error message
showPermissionModal  // Location permission modal
permissionAttempts   // Retry counter (max 3)
showFetchingModal    // Fetching location modal
showSearchingModal   // Search progress modal
searchingLocation    // Location being searched
showCreditsModal     // Credits modal visibility
location             // Current location name
searchOpen           // Search input visibility
searchQuery          // Search input value
currentTime          // Live clock
```

---

## Weather Conditions Mapping

The app maps WMO weather codes to readable conditions:

| Code | Condition |
|------|-----------|
| 0 | Clear |
| 1-3 | Mainly Clear, Partly Cloudy, Overcast |
| 45-48 | Foggy |
| 51-57 | Drizzle (Light to Freezing) |
| 61-67 | Rain (Light to Freezing) |
| 71-77 | Snow (Light to Heavy) |
| 80-86 | Showers (Light to Heavy) |
| 95-99 | Thunderstorm |

---

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Configure:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Node Version:** 18.x

---

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Location permission blocking | Retry counter (max 3) + skip option |
| Fast API responses | Promise.all with 3s minimum display |
| No reverse geocoding in Open-Meteo | Integrated BigDataCloud API |
| WMO numeric codes | Created 20+ condition mappings |
| Icon library size | Custom inline SVG components |

---

## Future Improvements

### Features
- [ ] Weather condition icons (visual)
- [ ] Temperature unit toggle (°C/°F)
- [ ] Dark mode theme
- [ ] Save favorite locations
- [ ] Weather alerts
- [ ] Air quality index
- [ ] Sunrise/sunset times

### Technical
- [ ] TypeScript migration
- [ ] Component splitting
- [ ] PWA support
- [ ] API caching
- [ ] Unit tests
- [ ] Error boundaries

---

## Credits

| Item | Source |
|------|--------|
| **Developer** | Mahima KG |
| **Project** | SkyCast |
| **Library** | React 18 |
| **Build Tool** | Vite 6 |
| **Weather API** | [Open-Meteo](https://open-meteo.com/) (Free) |
| **Geocoding** | Open-Meteo + [BigDataCloud](https://www.bigdatacloud.com/) |
| **UI Inspiration** | [Dribbble](https://dribbble.com/shots/15524720-Weather-web-app) |
| **Font** | [Poppins - Google Fonts](https://fonts.google.com/specimen/Poppins) |
| **CSS** | Custom Neumorphic CSS |
| **IDE** | Visual Studio Code |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## License

This project is for educational purposes.

---

## Statistics

| Metric | Value |
|--------|-------|
| Total Lines of Code | ~1,800 |
| React Components | 11 |
| State Variables | 13 |
| CSS Classes | 100+ |
| API Integrations | 3 |
| SVG Icons | 9 |
| Weather Conditions | 20+ |

---

<p align="center">
  Made with React by <strong>Mahima KG</strong>
</p>
