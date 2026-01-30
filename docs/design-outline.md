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
sessions: '++id, vehicleId, chargedAt, [vehicleId+chargedAt]';
settings: 'key'; // singleton: key = 'app-settings'
```

## Location Types

```typescript
// src/constants.ts
LOCATION_TYPES = {
  HOME: { key: 'HOME', label: 'Home', icon: '🏠', color: 'blue' },
  WORK: { key: 'WORK', label: 'Work', icon: '🏢', color: 'purple' },
  OTHER: { key: 'OTHER', label: 'Other', icon: '📍', color: 'pink' },
  DC: { key: 'DC', label: 'DC', icon: '⚡', color: 'amber' }
};
```

## Routing & Navigation

```
/                      → Dashboard (redirects to /onboarding if needed)
/onboarding            → 3-step flow (Welcome → Rates → First Vehicle)
/sessions              → List with filters
/sessions/add          → Form (create)
/sessions/:id/edit     → Form (edit)
/vehicles              → List
/vehicles/add          → Form (create)
/vehicles/:id/edit     → Form (edit)
/settings              → Default rates, storage info
```

## Hooks Pattern

All hooks use `useLiveQuery()` and return CRUD operations:

```typescript
useVehicles(activeOnly?) → { vehicles, createVehicle, updateVehicle, deleteVehicle }
useSessions(filters?)    → { sessions, createSession, updateSession, deleteSession }
useSettings()            → { settings, updateSettings, completeOnboarding }
useStats(filters?)       → { totalKwh, totalCostCents, avgRate, byLocation, byDate }
useAppReady()            → { isLoading, needsOnboarding, settings }
```

Filters: `{ vehicleId?, locationType?, dateRange? }`

## First Launch

1. Settings exist? If no → create defaults
2. `settings.onboardingComplete`? If false → `/onboarding`
3. Otherwise → Dashboard

**Default settings**:

```json
{
  "key": "app-settings",
  "defaultRates": { "HOME": 0.12, "WORK": 0.0, "OTHER": 0.15, "DC": 0.35 },
  "onboardingComplete": false
}
```

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

When `locationType` selected → auto-fill `ratePerKwh` from `settings.defaultRates[locationType]` (user can override)

### Vehicle Deletion

```typescript
const sessionCount = await db.sessions.where('vehicleId').equals(id).count();
if (sessionCount > 0) {
  // Error: "Cannot delete - vehicle has N sessions"
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
