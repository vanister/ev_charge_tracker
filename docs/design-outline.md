# EV Charge Tracker - Design Outline

> **Status**: MVP Complete (100%) - All phases shipped. Post-MVP work in progress: cloud sync (auth + export/import done; transport layer and sync UI remaining). See `docs/sync-system-tasks.md` for sync progress.

## Tech Stack

Vite + React 19 + TypeScript + Dexie.js (IndexedDB) + Tailwind CSS v4 + vite-plugin-pwa + Immer + React Router v7

## Core Rules

- **Offline-first**: All data in IndexedDB, no network calls except app updates
- **Cost storage**: Integer `costCents = Math.round(energyKwh × ratePerKwh × 100)`, never recalculate
- **Vehicles**: Soft delete (`isActive`), validate no sessions before deletion
- **IDs**: UUIDs via `crypto.randomUUID()`
- **Settings**: Singleton with key `'app-settings'`

## File Structure

```
src/
  data/              # db.ts, data-types.ts, constants.ts, repositories.ts
  types/             # shared-types.ts
  contexts/          # Context definitions (DatabaseContext, AppInitializationContext, ThemeContext, LayoutConfigContext)
  providers/         # Context providers (DatabaseProvider, AppInitializationProvider, ThemeProvider, LayoutConfigProvider)
  hooks/             # useDatabase, useAppInitialization, useVehicles, useSessions, useSettings,
                     # useLocations, useStats, useTheme, useImmerState, usePageTitle, useLayoutConfig
  helpers/           # sessionHelpers.ts
  utilities/         # dataUtils.ts, dateUtils.ts, formatUtils.ts, resultUtils.ts, themeUtils.ts
  components/        # Button, EmptyState, Icon, SectionHeader, FullscreenLoader, RequireOnboarding
  pages/
    layout/          # Layout, AppHeader, NavigationDrawer, ThemeSelector, MenuOverlay
    dashboard/       # Dashboard, DashboardStats, DashboardRecentSessions, DashboardStatCard
    onboarding/      # Onboarding + step components
    sessions/        # SessionsList, SessionDetails, SessionForm, SessionsFilter, SessionItem, etc.
    settings/        # Settings, LocationDetails, LocationItem, LocationForm
    vehicles/        # VehiclesList, VehicleDetails, VehicleItem, VehicleForm
    ErrorPage.tsx
```

## Dexie Schema

```typescript
// data/db.ts
vehicles: '++id, isActive, createdAt';
sessions: '++id, vehicleId, locationId, chargedAt, [vehicleId+chargedAt]';
settings: 'key'; // singleton: key = 'app-settings'
locations: '++id, isActive, createdAt';
```

## Location Types

```typescript
// data/constants.ts - DEFAULT_LOCATIONS
// Dynamic store, user can add/edit/delete locations
// Default locations seeded on first launch:
DEFAULT_LOCATIONS = [
  { name: 'Home',              icon: 'home',     color: 'teal',   defaultRate: 0.15 },
  { name: 'Work',              icon: 'building', color: 'slate',  defaultRate: 0.17 },
  { name: 'Other',             icon: 'map-pin',  color: 'purple', defaultRate: 0.11 },
  { name: 'DC Fast Charger',   icon: 'zap',      color: 'orange', defaultRate: 0.35 }
];
```

## Routing & Navigation

```
/error                           → ErrorPage (init failures)
/onboarding                      → 3-step flow (Welcome → Review Locations → First Vehicle)

Protected (RequireOnboarding guard):
/                                → Dashboard
/sessions                        → List with filters, grouped by date
/sessions/add                    → SessionDetails (create)
/sessions/:id/edit               → SessionDetails (edit)
/vehicles                        → VehiclesList
/vehicles/add                    → VehicleDetails (create)
/vehicles/:id/edit               → VehicleDetails (edit)
/settings                        → Locations management, storage info, app info
/settings/locations/add          → LocationDetails (create)
/settings/locations/:id/edit     → LocationDetails (edit)
```

## Hooks Pattern

Providers for initialization:

```typescript
DatabaseProvider → provides db instance
ThemeProvider → provides { theme, resolvedTheme, updateTheme }
AppInitializationProvider → provides { isInitialized, error }
LayoutConfigProvider → provides { title, setTitle } (inside Layout)
```

Data hooks return Promise-based CRUD operations using a **Result<T>** pattern:

```typescript
useDatabase() → { db }
useAppInitialization() → { isInitialized, error }
useVehicles() → { getVehicleList, getVehicle, createVehicle, updateVehicle, deleteVehicle }
useSessions() → { getSessionList, getSession, createSession, updateSession, deleteSession }
useSettings() → { getSettings, updateSettings, completeOnboarding }
useLocations() → { getLocationList, getLocation, createLocation, updateLocation, deleteLocation }
useStats() → { stats, recentSessions, isLoading }
useTheme() → { theme, resolvedTheme, updateTheme }
useImmerState(init) → [state, setState]  // setState accepts Immer draft updater
usePageTitle(title) → { updateTitle }
```

Session filters: `{ vehicleId?, locationId?, dateRange? }`

## First Launch

1. Settings exist? If no → create defaults
2. Locations exist? If no → seed default locations
3. `settings.onboardingComplete`? If false → `/onboarding`
4. Otherwise → Dashboard

**Default settings**:

```json
{
  "key": "app-settings",
  "onboardingComplete": false
}
```

**Default locations** (seeded on first launch):
- Home (🏠 home icon, teal, $0.15/kWh)
- Work (🏢 building icon, slate, $0.17/kWh)
- Other (📍 map-pin icon, purple, $0.11/kWh)
- DC Fast Charger (⚡ zap icon, orange, $0.35/kWh)

## PWA Config

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

plugins: [
  VitePWA({
    registerType: 'prompt',
    manifest: {
      name: 'EV Charge Tracker',
      short_name: 'Charge Tracker',
      theme_color: '#14b8a6',  // teal-500
      display: 'standalone',
      icons: [
        /* 192x192 (standard + maskable), 512x512 (standard + maskable) */
      ]
    }
  })
];
```

Icons: `public/icons/` → 192x192, 512x512 (standard + maskable) — **not yet generated**

## Business Logic

### Session Form

When location selected → auto-fill `ratePerKwh` from `location.defaultRate` (user can override)

### Vehicle Deletion

```typescript
const sessionCount = await db.sessions.where('vehicleId').equals(id).count();
if (sessionCount > 0) {
  // Error: "Cannot delete - vehicle has N sessions"
}
```

### Location Deletion

```typescript
const sessionCount = await db.sessions.where('locationId').equals(id).count();
if (sessionCount > 0) {
  // Error: "Cannot delete - location has N sessions"
}
```

### Empty States

- Dashboard: No sessions → "Log your first charge"
- Sessions: No matches → clear filters suggestion
- Vehicles: No active → "Add a vehicle"

## Testing

```bash
npm run dev       # Dev server
npm run build     # Production build
npm run preview   # Test production locally
```

Test offline: DevTools → Network → Offline mode

## Styling

Tailwind CSS v4 utilities with CSS variables defined via `@theme` in `src/index.css`. Theme colors: `teal-500` primary, location-specific (`teal-*`, `slate-*`, `purple-*`, `orange-*`). Full dark/light/system mode support via ThemeProvider. See `docs/color-palette.md` for full color reference.
