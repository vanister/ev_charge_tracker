## Tech Stack

Vite + React 19 + TypeScript + Dexie.js (IndexedDB) + Tailwind + vite-plugin-pwa

## Core Rules

- **Offline-first**: All data in IndexedDB, no network calls except app updates
- **Cost storage**: Integer `costCents = Math.round(energyKwh × ratePerKwh × 100)`, never recalculate
- **Vehicles**: Soft delete (`isActive`), validate no sessions before deletion
- **IDs**: UUIDs via `crypto.randomUUID()`
- **Settings**: Singleton with key `'app-settings'`

## File Structure

```
src/
  data/db.ts          # Dexie schema
  constants.ts   # LOCATION_TYPES
  types/             # TS interfaces
  hooks/             # useAppReady, useVehicles, useSessions, useSettings, useStats
  pages/             # Route components
  components/        # UI components
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
// data/db.ts - locations store
// Dynamic store, user can add/edit/delete locations
// Default locations seeded on first launch:
DEFAULT_LOCATIONS = [
  { name: 'Home', icon: '🏠', color: 'blue', defaultRate: 0.12 },
  { name: 'Work', icon: '🏢', color: 'purple', defaultRate: 0.0 },
  { name: 'Other', icon: '📍', color: 'pink', defaultRate: 0.15 },
  { name: 'DC Fast', icon: '⚡', color: 'amber', defaultRate: 0.35 }
];
```

## Routing & Navigation

```
/                      → Dashboard (redirects to /onboarding if needed)
/onboarding            → 3-step flow (Welcome → Review/Edit Locations → First Vehicle)
/sessions              → List with filters
/sessions/add          → Form (create)
/sessions/:id/edit     → Form (edit)
/vehicles              → List
/vehicles/add          → Form (create)
/vehicles/:id/edit     → Form (edit)
/settings              → Locations management, storage info
```

## Hooks Pattern

All hooks use `useLiveQuery()` and return CRUD operations:

```typescript
useVehicles(activeOnly?) → { vehicles, createVehicle, updateVehicle, deleteVehicle }
useSessions(filters?)    → { sessions, createSession, updateSession, deleteSession }
useSettings()            → { settings, updateSettings, completeOnboarding }
useLocations(activeOnly?) → { locations, createLocation, updateLocation, deleteLocation }
useStats(filters?)       → { totalKwh, totalCostCents, avgRate, byLocation, byDate }
useAppReady()            → { isLoading, needsOnboarding, settings }
```

Filters: `{ vehicleId?, locationId?, dateRange? }`

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
- Home (🏠, blue, $0.12/kWh)
- Work (🏢, purple, $0.00/kWh)
- Other (📍, pink, $0.15/kWh)
- DC Fast (⚡, amber, $0.35/kWh)

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
      theme_color: '#2563eb',
      icons: [
        /* 192, 512, 180, 32, 16 */
      ]
    }
  })
];
```

Icons: `public/icons/` → 192x192, 512x512, 180x180, 32x32, 16x16

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

Tailwind utilities. Colors: `blue-600` primary, location-specific (`blue-*`, `purple-*`, `pink-*`, `amber-*`)
