# EV Charge Tracker - Implementation Tasks

## Progress Summary

- **Phase 1 - Setup**: ✅ Complete (4/4)
- **Phase 2 - Data Layer**: ✅ Complete (4/4)
- **Phase 3 - Context Providers & Hooks**: ✅ Complete (11/11)
- **Phase 4 - Routing & Pages**: ✅ Complete (8/8)
- **Phase 5 - UI Components**: 🚧 In Progress (1/2)
- **Phase 6 - Tech Debt / Cleanup**: ✅ Complete (6/6)
- **Phase 7 - PWA Features**: ✅ Complete (4/4)
- **Phase 8 - Business Logic & Testing**: 🚧 In Progress (3/5)
- **Phase 9 - User Preferences**: ✅ Complete (5/5)
- **Phase 10 - Data Management**: 🔲 Not Started (0/4)

**Overall Progress**: 38/57 tasks complete (67%)

### Next Up
1. Implement charts with Recharts (energy by location, timeline)
2. Test offline functionality

---

## 1. Setup Phase

1. [x] Initialize Vite React TypeScript project
   - Run `npm create vite@latest ev-charge-tracker -- --template react-ts` and set up basic project structure
2. [x] Install core dependencies
   - Install dexie, react-router-dom, recharts, date-fns, immer, lucide-react, clsx
3. [x] Set up Tailwind CSS v4
   - Install and configure @tailwindcss/vite plugin (v4 uses Vite plugin, not PostCSS init)
4. [x] Install and configure Vite PWA plugin
   - Install vite-plugin-pwa and configure in vite.config.ts for service worker generation

## 2. Data Layer

1. [x] Create TypeScript types and interfaces
   - Define Vehicle, ChargingSession, Settings, Location types in src/data/data-types.ts
2. [x] Set up Dexie database schema
   - Create src/data/db.ts with vehicles, sessions, settings, locations stores and indexes
3. [x] Create constants file
   - Define DEFAULT_LOCATIONS seed templates and DB_NAME in src/data/constants.ts
4. [x] Create utility functions
   - Add generateId() in src/utilities/dataUtils.ts; seedDefaultLocations() and loadSettings() in src/data/repositories.ts

## 3. Context Providers & Hooks

1. [x] Implement DatabaseProvider context
   - Create context to provide single Dexie db instance to entire app
2. [x] Implement AppInitializationProvider context
   - Create context to handle app initialization (settings check, location seeding, persistent storage request)
   - Provide isInitialized and error to app; uses useRef to prevent double-init in React Strict Mode
3. [x] Implement useDatabase hook
   - Create hook to access db from DatabaseContext
4. [x] Implement useAppInitialization hook
   - Create hook to access initialization state from AppInitializationContext
5. [x] Implement useSettings hook
   - Create hook for settings CRUD operations and completeOnboarding(); uses Result<T> pattern
6. [x] Implement useVehicles hook
   - Create hook for vehicle CRUD operations, including soft delete and deletion validation
7. [x] Implement useLocations hook
   - Create hook for location CRUD operations, including soft delete and deletion validation
8. [x] Implement useSessions hook
   - Create hook for session CRUD with filters (vehicleId, locationId, dateRange); compound filters done in-memory
9. [x] Implement useStats hook (moved from Phase 4, added here for completeness)
   - Create hook to compute totalKwh, totalCostCents, avgRatePerKwh, sessionCount, byLocation from sessions
   - Returns { stats, recentSessions (5 most recent), isLoading }
10. [x] Implement ThemeProvider and useTheme hook
    - Manage light/dark/system theme; persist to localStorage; apply class to document root
    - Returns { theme, resolvedTheme, updateTheme }
11. [x] Implement useImmerState hook
    - Wrapper around useState with Immer draft-based updates

## 4. Routing & Pages

1. [x] Set up React Router structure
   - Configure routes: /, /onboarding, /sessions, /sessions/add, /sessions/:id/edit, /vehicles, /vehicles/add, /vehicles/:id/edit, /settings, /settings/locations/add, /settings/locations/:id/edit, /error
   - RequireOnboarding guard redirects to /onboarding if settings.onboardingComplete is false
2. [x] Create Onboarding flow pages
   - Build 3-step onboarding: Welcome screen, Review/Edit Locations, First vehicle creation
3. [x] Build Layout
   - AppHeader with title and menu button, NavigationDrawer (mobile sidebar), MenuOverlay, ThemeSelector
   - LayoutConfigProvider and usePageTitle for per-page title management
4. [x] Build SessionsList page
   - Sessions list grouped by date with filters (vehicle, location), edit/delete actions, empty states
5. [x] Build SessionDetails component
   - Form for adding/editing sessions; cost auto-calculated; location rate auto-fills ratePerKwh on selection
6. [x] Build VehiclesList page
   - Vehicles list with add/edit/delete actions; handles deletion validation (can't delete with sessions)
7. [x] Build VehicleDetails component
   - Form for adding/editing vehicles with icon picker; soft delete pattern
8. [x] Build Settings page
   - Locations management (add/edit/delete with safety checks), storage quota display, app info
   - LocationDetails form at /settings/locations/add and /settings/locations/:id/edit
9. [x] Build Dashboard page
   - Stats cards (total kWh, average rate, session count), 5 most recent sessions, empty state handling

## 5. UI Components

1. [x] Create reusable UI components
   - Button, EmptyState, Icon, SectionHeader, FullscreenLoader components implemented
   - Input, Select, Card, Modal not yet abstracted (inline Tailwind in pages)
2. [ ] Implement charts with Recharts
   - Create energy usage by location chart and timeline chart for dashboard
   - Recharts is installed but not yet used

## 6. Tech Debt / Cleanup

1. [x] Organize the types that are sprinkled throughout the components and helpers into feature level types or global types
2. [x] Check for opportunities to use the `useImmerState` hook
3. [x] More specific error pages
4. [x] Clean up helpers by removing the useless `build*Input` helpers
5. [x] Standardize on a page max-width across all pages
6. [x] Replace `Promise.then` with `async/await`

## 7. PWA Features

1. [x] Generate PWA icons
   - Create icons in public/icons/: 192x192, 512x512, 180x180, 32x32, 16x16 (standard + maskable variants)
   - All icons (including favicon) must visually match the Lucide "zap" icon used in Settings > About
2. [x] Configure PWA manifest
   - Set up manifest with name, icons, theme_color: #14b8a6 (teal-500), display: standalone in vite.config.ts
3. [x] Implement persistent storage request
   - Add navigator.storage.persist() call on app init, show storage quota in settings
4. [x] Add service worker update notification
   - Detect new service worker and show 'Update available' UI with reload action
   - Refactored to use toast system (persistent info toast with Reload action)

## 8. Business Logic & Testing

1. [x] Implement app initialization flow
   - Create logic to check settings, seed locations if needed, redirect to onboarding if needed, create default settings on first launch
2. [x] Add vehicle deletion safety checks
   - Prevent deletion of vehicles with sessions, offer cascade delete option
3. [x] Add location deletion safety checks
   - Prevent deletion of locations with sessions
4. [ ] Test offline functionality
   - Verify all features work without network, test service worker caching
5. [x] Build and deploy to static hosting
   - Configure deployment to Cloudflare Pages with HTTPS

## 9. User Preferences

Store lightweight UI preferences in `localStorage` (consistent with the existing theme storage pattern). Preferences are non-critical and can be safely reset; no Dexie schema migration required.

**Storage key**: `USER_PREFERENCES_STORAGE_KEY = 'ev-charge-tracker-preferences'` (add to `src/constants.ts`)

**`UserPreferences` type** (new file `src/types/preference-types.ts` or inline in the hook):
```ts
export type UserPreferences = {
  lastVehicleId?: string;
  lastLocationId?: string;
  recentSessionsLimit: number; // defaults to RECENT_SESSIONS_LIMIT constant
};
```

1. [x] Add `USER_PREFERENCES_STORAGE_KEY` constant to `src/constants.ts`
   - Value: `'ev-charge-tracker-preferences'`
   - Follows the existing `THEME_STORAGE_KEY` naming pattern
2. [x] Create `useUserPreferences` hook at `src/hooks/useUserPreferences.ts`
   - Reads from `localStorage` on mount, falls back to defaults if nothing stored
   - Exposes `{ preferences, updatePreferences, resetPreferences }`
   - `updatePreferences(partial: Partial<UserPreferences>)` merges and writes back to localStorage
   - `resetPreferences()` clears the key and restores defaults
   - Default values: `{ recentSessionsLimit: RECENT_SESSIONS_LIMIT }` (no vehicle/location pre-selected)
3. [x] Persist last vehicle and location on session save
   - In `SessionDetails`, after a successful create or update, call `updatePreferences({ lastVehicleId, lastLocationId })`
   - On the "Add Session" form (not edit), pre-select `lastVehicleId` and `lastLocationId` as the initial form values if set in preferences
4. [x] Wire `recentSessionsLimit` preference into `useStats`
   - Replace hardcoded use of `RECENT_SESSIONS_LIMIT` in `buildRecentSessions` (`src/helpers/statsHelpers.ts`) with a value passed in or read from preferences
   - `useStats` hook should read `preferences.recentSessionsLimit` via `useUserPreferences` and pass it through
5. [x] Add a "Preferences" section to the Settings page
   - Display current `recentSessionsLimit` with a simple numeric input or select (e.g. 3, 5, 10, 15)
   - Show a "Reset Preferences" button that calls `resetPreferences()`
   - Do **not** expose `lastVehicleId`/`lastLocationId` as editable — those are auto-managed

## 10. Data Management

Provides export, import, and restore capabilities for all user data. The database is currently at **version 1** (see `db.version(1)` in `src/data/db.ts`). All data file operations must verify and handle version compatibility.

**Format**: JSON — human-readable, widely compatible, easy to debug, and simple to validate.

**File structure**:
```ts
export type DataExport = {
  version: number;       // Dexie db version (e.g. 1)
  exportedAt: number;    // Unix timestamp ms
  data: {
    vehicles: Vehicle[];
    sessions: ChargingSession[];
    settings: Settings[];
    locations: Location[];
  };
};
```

Add `export-types.ts` to `src/types/` for the above type.

**Version compatibility rules (v1)**:
- ✅ Same version (1 → 1): import and restore are allowed
- ❌ Mismatched version: reject with error — `"File version ${fileVersion} is incompatible with the current database version ${dbVersion}. Only same-version restores are supported."`
- 🔮 Forward-compatible restore (migration support) is planned as a follow-up phase after this one.

### Tasks

1. [ ] Create export utility at `src/utilities/exportUtils.ts`
   - Read all records from `db.vehicles`, `db.sessions`, `db.settings`, and `db.locations` using `toArray()`
   - Assemble a `DataExport` object with `version` (current Dexie db version via `db.verno`), `exportedAt` (Date.now()), and all table data
   - Serialize to JSON and trigger a browser file download
   - Filename pattern: `ev-charge-tracker-export-YYYY-MM-DD.json`
   - Handle empty tables gracefully (export as empty arrays)

2. [ ] Create import utility at `src/utilities/importUtils.ts`
   - Parse and validate the uploaded JSON file structure against `DataExport` type
   - Verify `version` in file matches current `db.verno`; reject with error message if not
   - Validate data integrity: required fields present, correct types, referential integrity (session vehicleId/locationId must exist in the file or current db)
   - **Merge strategy**: use `bulkPut` to add new records and update existing ones by ID — does not delete any current data
   - Return a result object: `{ success: boolean; imported: Record<string, number>; skipped: Record<string, number>; errors: string[] }`

3. [ ] Add "Data Management" section to the Settings page (`src/pages/Settings.tsx` or equivalent)
   - Show current database version (read from `db.verno`)
   - **Export button**: calls export utility and triggers download
   - **Import button**: opens file picker (`.json` only), runs import utility, shows result in a modal or toast
     - On success: show counts (e.g. "Imported 12 sessions, 2 vehicles")
     - On failure: show error message
   - Place section below the existing Preferences section

4. [ ] Implement "Dangerous Restore" in the Settings Data Management section
   - Add a clearly separated and visually distinct "Danger Zone" sub-section
   - **Restore from file** button: opens file picker (`.json` only)
   - Before restoring, show a confirmation modal with a strong warning:
     `"This will permanently DELETE all current data and replace it with the contents of the selected file. This cannot be undone."`
   - On confirm:
     - Parse and validate the backup file (same validation as import)
     - Check version compatibility — reject if versions don't match
     - Inside a Dexie `transaction('rw', db.tables, ...)`, clear all tables then bulk-insert all records from the file
     - On success: force a full page reload (`window.location.reload()`) to re-initialize the app
     - On error: show error toast and do not modify any data

## Post-MVP

1. [ ] Support vehicle image upload
   - Allow users to upload a custom image for their vehicle instead of the default 🚗 emoji
   - Store image reference and display in VehicleItem and other vehicle displays
2. [ ] Automatic backup functionality
   - Periodically save a full JSON backup (same `DataExport` format as Phase 10 export)
   - Store backups in IndexedDB with a configurable retention policy (e.g. last 5 backups)
   - List and manage existing backups in the Settings Data Management section
   - Quick restore from a saved backup entry (reuses the Phase 10 dangerous restore logic)
3. [ ] Sync ability using users storage accounts
   - iCloud, Drive, OneDrive, etc.