# EV Charge Tracker - Design Outline

> Living overview of the app's design. For detailed contracts and hook APIs, see [architecture.md](../architecture.md). For technical details, see [technical-design.md](./technical-design.md).

## Tech Stack

Vite + React 19 + TypeScript + Dexie.js (IndexedDB) + Zod + Tailwind CSS v4 + vite-plugin-pwa + Immer + React Router v7

Deployed to Cloudflare Workers via Wrangler.

## Core Rules

- **Offline-first**: All data in IndexedDB, no network calls except app updates
- **Cost storage**: Integer `costCents = Math.round(energyKwh * ratePerKwh * 100)`, never recalculate
- **Vehicles/Locations**: Soft delete (`isActive`), validate no sessions before deletion
- **IDs**: UUIDs via `crypto.randomUUID()`
- **Settings**: Singleton with key `'app-settings'`
- **Result pattern**: Fallible operations return `Result<T>` instead of throwing

## File Structure

```
src/
  data/              # db.ts, schemas.ts, data-types.ts, constants.ts, repositories.ts
  types/             # shared-types.ts, preference-types.ts, auth-types.ts, toast-types.ts
  contexts/          # DatabaseContext, AppInitializationContext, ThemeContext, LayoutConfigContext, ToastContext
  providers/         # DatabaseProvider, AppInitializationProvider, ThemeProvider, LayoutConfigProvider, ToastProvider
  hooks/             # useDatabase, useVehicles, useSessions, useLocations, useMaintenanceRecords,
                     # useSettings, useUserPreferences, useBackup, useBackupReminder, useTheme,
                     # useImmerState, usePageConfig, useLayoutConfig, useToast, useNavigationGuard,
                     # useAppInitialization, useAppUpdateAvailable, useScrollToHash, useOAuth,
                     # useNotificationPermission, useServiceWorkerUpdate, useServiceWorkerMessages
  helpers/           # sessionHelpers, statsHelpers, chartHelpers, preferenceHelpers, gasComparisonHelpers
  utilities/         # dataUtils, dateUtils, formatUtils, resultUtils, themeUtils,
                     # backupUtils, authUtils, pkceUtils, syncUtils, notificationUtils
  components/        # Button, EmptyState, Icon, IconGrid, Section, SectionHeader, FormInput,
                     # FormSelect, FormTextarea, FormFooter, FileSelect, ButtonRow, ItemListButton,
                     # Toast, ToastContainer, FullscreenLoader, GenericError, RequireOnboarding,
                     # ExportBackupButton, RestoreBackupButton, SessionsFilter
  pages/
    layout/          # Layout, AppHeader, BottomTabBar
    dashboard/       # Dashboard, ChargeStats, ChargeSessionsCharts, ChartTooltip,
                     # DashboardRecentSessions, DashboardStatCard, GasComparison, MaintenanceSummary
    onboarding/      # Onboarding + step components (Welcome, Locations, Vehicle)
    sessions/        # SessionsList, SessionDetails, SessionForm, SessionItem, SessionDateGroup, etc.
    settings/        # Settings, LocationsSection, LocationDetails, LocationForm, LocationItem,
                     # ThemeSectionBody, BackupRestoreSectionBody, StorageSectionBody,
                     # SessionSectionBody, UpdateSectionBody, AboutSectionBody,
                     # GasComparisonSectionBody, GasComparisonDetails, NotificationPermissionRow
    vehicles/        # VehiclesList, VehicleDetails, VehicleForm, VehicleItem
      maintenance/   # MaintenanceList, MaintenanceDetails, MaintenanceForm, MaintenanceItem, etc.
    auth/            # OAuthCallback
    ErrorPage.tsx
    NotFoundPage.tsx
```

## Dexie Schema (v4)

```typescript
// v1
vehicles: '++id, isActive, createdAt'
sessions: '++id, vehicleId, locationId, chargedAt, [vehicleId+chargedAt]'
settings: 'key'
locations: '++id, isActive, createdAt, order'

// v2
systemConfig: 'key'

// v3-v4
maintenanceRecords: '++id, vehicleId, servicedAt, [vehicleId+servicedAt]'
```

## Default Locations

```typescript
DEFAULT_LOCATIONS = [
  { name: 'Home',            icon: 'home',     color: 'teal',   defaultRate: 0.15 },
  { name: 'Work',            icon: 'building', color: 'slate',  defaultRate: 0.17 },
  { name: 'Other',           icon: 'map-pin',  color: 'purple', defaultRate: 0.11 },
  { name: 'DC Fast Charger', icon: 'zap',      color: 'orange', defaultRate: 0.35 }
]
// Seeded on first launch, user can add/edit/delete
// Deletion prevented if sessions reference the location
```

## Routing & Navigation

```
/error                                        ErrorPage (init failures)
/onboarding                                   3-step wizard (Welcome, Locations, Vehicle)
/auth/callback                                OAuthCallback

Protected (RequireOnboarding guard):
  /                                           Dashboard
  /sessions                                   SessionsList (filterable, date-grouped)
  /sessions/add                               SessionDetails (create)
  /sessions/:id/edit                          SessionDetails (edit)
  /vehicles                                   VehiclesList
  /vehicles/add                               VehicleDetails (create)
  /vehicles/:id/edit                          VehicleDetails (edit)
  /vehicles/:vehicleId/maintenance            MaintenanceList
  /vehicles/:vehicleId/maintenance/add        MaintenanceDetails (create)
  /vehicles/:vehicleId/maintenance/:id/edit   MaintenanceDetails (edit)
  /settings                                   Settings
  /settings/locations/:id/edit                LocationDetails
  /settings/gas-comparison/edit               GasComparisonDetails
  *                                           NotFoundPage
```

## Provider Hierarchy

```
ErrorBoundary
  DatabaseProvider          <- Dexie db instance
    ThemeProvider            <- light/dark/system theme
      AppInitializationProvider  <- seeds defaults, loads config
        RouterProvider
          App
            ToastProvider    <- toast notifications
              Layout
                LayoutConfigProvider  <- page title, tab bar visibility
                  Outlet (routes)
```

## First Launch

1. Settings exist? If no -> create defaults
2. Locations exist? If no -> seed default locations
3. `settings.onboardingComplete`? If false -> `/onboarding`
4. Otherwise -> Dashboard

## Business Logic

- **Session form**: Location selection auto-fills `ratePerKwh` from `location.defaultRate` (user can override)
- **Vehicle deletion**: Blocked if vehicle has sessions
- **Location deletion**: Blocked if location has sessions
- **Cost calculation**: `costCents = Math.round(energyKwh * ratePerKwh * 100)` -- stored permanently, never recalculated
- **Gas comparison**: Compares EV charging costs to equivalent gas costs using EPA MPGe formula
- **Maintenance tracking**: Per-vehicle records with type, cost, mileage, and next-due tracking

## Styling

Tailwind CSS v4 with CSS variables defined via `@theme` in `src/index.css`. Full dark/light/system mode support via ThemeProvider. See [color-palette.md](./color-palette.md) for full color reference.

## In-Progress (Infrastructure Only)

- **OAuth/Sync**: Backend scaffolding exists (token storage, sync file format, PKCE utilities) but no user-facing UI is wired up yet. See `src/utilities/authUtils.ts`, `src/utilities/syncUtils.ts`, and `src/hooks/useOAuth.ts`.
