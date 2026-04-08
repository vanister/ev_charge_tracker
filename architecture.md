# Architecture

Living document of shared contracts, patterns, and structure for the EV Charge Tracker codebase. Agents and contributors use this to understand what exists and how to integrate with it.

Last updated: 2026-04-08

---

## Provider Hierarchy

Providers wrap the app in a specific order. New providers must slot into this hierarchy correctly.

```
ErrorBoundary
  └─ DatabaseProvider          ← Dexie db instance
       └─ ThemeProvider        ← light/dark/system theme
            └─ AppInitializationProvider  ← seeds defaults, loads config
                 └─ RouterProvider
                      └─ App
                           └─ ToastProvider  ← toast notifications
                                └─ Outlet (routes)
```

`LayoutConfigProvider` is rendered inside `Layout.tsx` (wraps the main content area with tab bar/header state).

---

## Data Layer

### Database (Dexie v4, IndexedDB)

All data is local. No backend API. The single database instance is provided via `DatabaseProvider` and consumed exclusively through hooks (never import `db` directly in components).

**Tables and indexes:**

| Table                | Primary Key | Indexes                                |
|----------------------|-------------|----------------------------------------|
| `vehicles`           | `id`        | `isActive`, `createdAt`                |
| `sessions`           | `id`        | `vehicleId`, `locationId`, `chargedAt`, `[vehicleId+chargedAt]` |
| `locations`          | `id`        | `isActive`, `createdAt`, `order`       |
| `settings`           | `key`       | —                                      |
| `systemConfig`       | `key`       | —                                      |
| `maintenanceRecords` | `id`        | `vehicleId`, `servicedAt`, `[vehicleId+servicedAt]` |

### Entity Schemas (Zod, defined in `src/data/schemas.ts`)

Types are inferred from Zod schemas in `src/data/data-types.ts`:

```ts
type Vehicle = {
  id: string;
  name?: string;
  make: string;
  model: string;
  year: number;        // integer
  trim?: string;
  batteryCapacity?: number;
  range?: number;
  notes?: string;
  icon: string;        // emoji or custom string, NOT constrained to IconName
  createdAt: number;   // epoch ms
  isActive: ActiveState;
};

type Location = {
  id: string;
  name: string;
  icon: IconName;
  color: string;       // hex value
  defaultRate: number;
  createdAt: number;
  isActive: ActiveState;
  order?: number;
};

type ChargingSession = {
  id: string;
  vehicleId: string;
  locationId: string;
  energyKwh: number;
  ratePerKwh: number;
  costCents: number;   // auto-calculated: Math.round(energyKwh * ratePerKwh * 100)
  chargedAt: number;   // epoch ms
  notes?: string;
};

type Settings = {
  key: 'app-settings';
  onboardingComplete: boolean;
  backupReminderInterval: BackupReminderInterval;
  lastBackupAt?: number;
  backupReminderDismissedAt?: number;
};

type MaintenanceRecord = {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  description: string;
  costCents?: number;
  mileage?: number;
  serviceProvider?: string;
  servicedAt: number;
  nextDueDate?: number;
  nextDueMileage?: number;
  notes?: string;
  createdAt: number;
};

type ActiveState = 0 | 1;  // soft delete pattern
```

### ID Generation

All entity IDs use `crypto.randomUUID()` via the `generateId()` utility in `src/utilities/dataUtils.ts`.

---

## Hook Contracts

All data hooks follow the same pattern: call `useDatabase()` internally, return an object of `useCallback`-wrapped async functions that return `Promise<Result<T>>`.

### useVehicles

```ts
function useVehicles(): {
  getVehicleList(activeOnly?: boolean): Promise<Result<Vehicle[]>>;
  getVehicle(id: string): Promise<Result<Vehicle | undefined>>;
  createVehicle(input: CreateVehicleInput): Promise<Result<Vehicle>>;
  updateVehicle(id: string, input: UpdateVehicleInput): Promise<Result<Vehicle>>;
  deleteVehicle(id: string): Promise<Result<void>>;
}
// CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'isActive'>
// UpdateVehicleInput = Partial<Omit<Vehicle, 'id' | 'createdAt'>>
// Input types defined in src/pages/vehicles/vehicle-types.ts
```

### useSessions

```ts
function useSessions(): {
  getSessionList(filters?: SessionFilters): Promise<Result<ChargingSession[]>>;
  getSession(id: string): Promise<Result<ChargingSession | undefined>>;
  createSession(input: CreateSessionInput): Promise<Result<ChargingSession>>;
  updateSession(id: string, input: UpdateSessionInput): Promise<Result<ChargingSession>>;
  deleteSession(id: string): Promise<Result<void>>;
  hasAnySessions(): Promise<Result<boolean>>;
}
// SessionFilters = { vehicleId?: string; locationId?: string; dateRange?: { start: number; end: number } }
// CreateSessionInput = Omit<ChargingSession, 'id' | 'costCents'>  (cost auto-calculated)
// UpdateSessionInput = Partial<Omit<ChargingSession, 'id'>>
// Input types defined locally in the hook file
```

### useLocations

```ts
function useLocations(): {
  getLocationList(all?: boolean): Promise<Result<Location[]>>;
  getLocation(id: string): Promise<Result<Location | undefined>>;
  createLocation(loc: NewLocation): Promise<Result<Location>>;
  updateLocation(id: string, loc: UpdateLocation): Promise<Result<Location>>;
  deleteLocation(id: string): Promise<Result<void>>;
}
// NewLocation = Omit<Location, 'id' | 'createdAt' | 'isActive'>
// UpdateLocation = Partial<Omit<Location, 'id' | 'createdAt'>>
// Input types defined in src/pages/settings/locationHelpers.ts
```

### useMaintenanceRecords

```ts
function useMaintenanceRecords(): {
  getMaintenanceRecordList(vehicleId?: string): Promise<Result<MaintenanceRecord[]>>;
  getMaintenanceRecord(id: string): Promise<Result<MaintenanceRecord | undefined>>;
  createMaintenanceRecord(input: CreateMaintenanceRecordInput): Promise<Result<MaintenanceRecord>>;
  updateMaintenanceRecord(id: string, input: UpdateMaintenanceRecordInput): Promise<Result<MaintenanceRecord>>;
  deleteMaintenanceRecord(id: string): Promise<Result<void>>;
}
// CreateMaintenanceRecordInput = Omit<MaintenanceRecord, 'id' | 'createdAt'>
// UpdateMaintenanceRecordInput = Partial<Omit<MaintenanceRecord, 'id' | 'createdAt'>>
// Input types defined locally in the hook file
```

### useSettings

```ts
function useSettings(): {
  getSettings(): Promise<Result<Settings | undefined>>;
  updateSettings(updates: Partial<Omit<Settings, 'key'>>): Promise<Result<boolean>>;
  completeOnboarding(): Promise<void>;
}
```

### useUserPreferences

```ts
function useUserPreferences(storage?: Storage): {
  preferences: UserPreferences;
  updatePreferences(partial: Partial<UserPreferences>): void;
  resetPreferences(): void;
}
```

`UserPreferences` is stored in `localStorage` (not IndexedDB):

```ts
type UserPreferences = {
  lastVehicleId?: string;
  lastLocationId?: string;
  recentSessionsLimit: number;
  sessionsFilterTimeRange?: string;
  sessionsFilterVehicleId?: string;
  sessionsFilterLocationId?: string;
  sessionsFilterIsOpen?: boolean;
  dashboardFilterTimeRange?: string;
  dashboardFilterVehicleId?: string;
  dashboardFilterLocationId?: string;
  dashboardFilterIsOpen?: boolean;
};
```

### UI Hooks

```ts
function useDatabase(): { db: EvChargTrackerDb };
function useAppInitialization(): { isInitialized: boolean; error: string | null };
function useTheme(): { theme: ThemeMode; resolvedTheme: 'light' | 'dark'; updateTheme(theme: ThemeMode): Promise<void> };
function useLayoutConfig(): { title: string; setTitle(title: string): void; hideTabBar: boolean; setHideTabBar(value: boolean): void };
function useToast(): { toasts: Toast[]; showToast(options: ShowToastOptions): string; dismissToast(id: string): void };
function usePageConfig(title: string, hideTabBar?: boolean): { updateTitle(title: string): void };
function useImmerState<T>(initialValue: T | (() => T)): readonly [T, (updater: T | ((draft: T) => void)) => void];
function useNavigationGuard(options: { enabled: boolean; message?: string | (() => string) }): void;
function useBackupReminder(dontShow?: boolean): { needsReminder: boolean; dismissReminder(): Promise<void> };
function useAppUpdateAvailable(dontToast?: boolean): { needsUpdate: boolean; applyUpdate(): void };
function useScrollToHash(): void;
function useNotificationPermission(): { permission: NotificationPermission; requestPermission(): Promise<void> };
function useOAuth(): { saveTokens, getTokens, getProviderConfig, exchangeAndSave };
```

---

## Result Pattern

All fallible operations return `Result<T>` instead of throwing. Constructors in `src/utilities/resultUtils.ts`:

```ts
type Success<T> = { readonly success: true; readonly data: T };
type Failure = { readonly success: false; readonly error: string };
type Result<T> = Success<T> | Failure;

function success(): Success<void>;
function success<T>(data: T): Success<T>;
function failure(error: string): Failure;
```

Usage: check `result.success` before accessing `result.data`. Hook CRUD methods wrap Dexie calls in try/catch and return `failure(message)` on error.

---

## Routing Structure

React Router v7 with this route tree:

```
/error                                → ErrorPage
/onboarding                           → Onboarding (3-step wizard)
/auth/callback                        → OAuthCallback

[RequireOnboarding guard]
  [Layout shell — header + tab bar]
    /                                 → Dashboard
    /sessions                         → SessionsList
    /sessions/add                     → SessionDetails (create mode)
    /sessions/:id/edit                → SessionDetails (edit mode)
    /vehicles                         → VehiclesList
    /vehicles/add                     → VehicleDetails (create mode)
    /vehicles/:id/edit                → VehicleDetails (edit mode)
    /vehicles/:vehicleId/maintenance  → MaintenanceList
    /vehicles/:vehicleId/maintenance/add        → MaintenanceDetails (create)
    /vehicles/:vehicleId/maintenance/:id/edit   → MaintenanceDetails (edit)
    /settings                         → Settings
    /settings/locations/:id/edit      → LocationDetails
    /settings/gas-comparison/edit     → GasComparisonDetails
    *                                 → NotFoundPage
```

**Pattern:** Detail pages handle both create and edit. Presence of `:id` param determines the mode.

---

## Shared Components (`src/components/`)

Reusable UI building blocks. Key contracts:

| Component            | Key Props                                                    |
|----------------------|--------------------------------------------------------------|
| `Button`             | `variant: 'primary' \| 'secondary'`, `fullWidth?`, `type?`  |
| `FormInput`          | `id`, `label`, `required?` + native input attrs              |
| `FormSelect`         | `id`, `label`, `options?: SelectOption[]` or `children`       |
| `FormTextarea`       | `id`, `label`, `required?` + native textarea attrs           |
| `Icon`               | `name: IconName`, `size?: 'sm' \| 'md' \| 'lg'`, `color?`  |
| `IconGrid`           | `selectedIcon?`, `onIconSelect`                               |
| `Section`            | `title`, `children`, `action?`, `noCard?`, `id?`            |
| `SectionHeader`      | `title?`, `action?`                                           |
| `EmptyState`         | `icon?`, `title`, `message`, `actionLabel?`, `onAction?`     |
| `Toast`              | `Toast & { onDismiss }`                                       |
| `ToastContainer`     | (none — portal-rendered)                                      |
| `ButtonRow`          | `options`, `value`, `onChange`                                 |
| `ItemListButton`     | `label`, `onClick`, `variant?`                                |
| `FormFooter`         | `children` (fixed bottom container for form actions)          |
| `FileSelect`         | `accept?`, `onChange` (forwardRef)                            |
| `SessionsFilter`     | vehicles, locations, selected IDs, time range, callbacks      |
| `ExportBackupButton` | `onSuccess?`, `onError?`, `label?`, `disabled?`              |
| `RestoreBackupButton`| `onSuccess`, `onError?`, `label?`, `skipConfirm?`            |
| `FullscreenLoader`   | `header?`, `description?`                                     |
| `GenericError`       | (none — ErrorBoundary fallback)                               |
| `RequireOnboarding`  | (none — route guard, renders Outlet)                          |

---

## Helpers & Utilities

### Helpers (domain logic, `src/helpers/`)

```ts
// sessionHelpers.ts
createVehicleMap(vehicles: Vehicle[]): Map<string, Vehicle>
createLocationMap(locations: Location[]): Map<string, Location>
getVehicleDisplayName(vehicle: Vehicle): string
groupSessionsByDate(sessions, vehicleMap, locationMap): SessionsByDate

// statsHelpers.ts
computeStats(sessions: ChargingSession[], locationMap: Map<string, Location>): SessionStats
buildRecentSessions(sessions, vehicleMap, locationMap, limit?): SessionWithMetadata[]

// chartHelpers.ts
buildChartData(sessions, locations, numDays?): ChartData
buildMonthlyChartData(sessions, locations, numMonths): ChartData
getChartNumDays(timeRange: TimeFilterValue): number
getChartNumMonths(timeRange: TimeFilterValue, sessions): number

// gasComparisonHelpers.ts
computeGasComparison(sessions, settings, vehicles): GasComparisonResult

// preferenceHelpers.ts
readPreferences(storage?): UserPreferences
writePreferences(prefs, storage?): void
clearPreferences(storage?): void
```

### Utilities (pure functions, `src/utilities/`)

```ts
// resultUtils.ts — Result<T> constructors (see Result Pattern section)
// dataUtils.ts — generateId(generator?: Crypto): string
// dateUtils.ts — date-fns wrappers: formatDate, formatDateTime, isSameDay, startOfDay, subDays, getDateRangeForTimeFilter, etc.
// formatUtils.ts — formatCost, formatEnergy, formatRate, formatBytes, formatBackupReminderInterval
// backupUtils.ts — exportBackup, readBackupFile, restoreBackup, isBackupOverdue
// themeUtils.ts — getSystemTheme, getStoredTheme, applyTheme
// notificationUtils.ts — browser notification API helpers
// authUtils.ts — OAuth helpers: buildAuthorizationUrl, parseAuthCallback, exchangeCodeForTokens, state/verifier storage
// syncUtils.ts — buildSyncFile, parseSyncFile, exportSyncFile, importSyncFile
// pkceUtils.ts — generatePkcePair
```

---

## File Organization Conventions

```
src/
├── components/       ← shared, reusable UI components
├── contexts/         ← React.createContext definitions only
├── providers/        ← context provider components
├── hooks/            ← custom hooks (data access + UI behavior)
├── data/             ← Dexie db, schemas, constants, data-types
├── types/            ← shared types used across features
├── helpers/          ← domain logic (session grouping, stats, charts)
├── utilities/        ← pure utility functions (dates, formatting, results)
├── pages/
│   ├── layout/       ← app shell (header, bottom tab bar)
│   ├── dashboard/    ← stats, charts, recent sessions, gas comparison, maintenance summary
│   ├── sessions/     ← session list, details/form, date grouping
│   ├── vehicles/     ← vehicle list, details/form
│   │   └── maintenance/  ← maintenance records (nested under vehicles)
│   ├── settings/     ← settings, locations, backup, theme, gas comparison, notifications
│   ├── onboarding/   ← 3-step wizard
│   └── auth/         ← OAuth callback (infrastructure only)
├── App.tsx           ← root component (init check + ToastProvider)
├── main.tsx          ← entry point (provider hierarchy)
├── router.tsx        ← route definitions
├── constants.ts      ← app-wide constants
└── index.css         ← global styles + Tailwind
```

**Rules:**
- Types stay close to their feature; move to `src/types/` only when shared across features
- No barrel/index files
- One component per file
- Feature-specific types live in `<feature>-types.ts` files alongside the feature

---

## Key Patterns for New Features

1. **Data hook:** Create in `src/hooks/use<Entity>.ts`, follow the CRUD pattern from existing hooks. Define input types locally unless shared.
2. **Page pair:** List page + Details page (handles create/edit via route param presence).
3. **Route:** Add to `router.tsx` inside the Layout children array.
4. **Types:** Feature-specific types in a `<feature>-types.ts` file next to the feature components.
5. **Soft delete:** Use `isActive: ActiveState` (0/1) — filter with `.where('isActive').equals(1)`.
6. **Forms:** Use `useImmerState` for form state. `FormInput`/`FormSelect`/`FormTextarea` for fields. `FormFooter` for action buttons. `useNavigationGuard` for unsaved changes.
7. **Page setup:** Call `usePageConfig(title)` at the top of each page component.
8. **Cost fields:** Store as `costCents` (integer). Display with `formatCost()`.
9. **Date fields:** Store as epoch ms (`number`). Display with `formatDate()` / `formatDateTime()`.
10. **Toasts:** Use `useToast().showToast({ message, variant })` for user feedback after mutations.
