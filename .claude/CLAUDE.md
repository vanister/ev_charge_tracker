# EV Charge Tracker - AI Coding Agent Instructions

A Vite + TypeScript + React 19 PWA for tracking EV charging sessions. Mobile-focused, fully offline with all data persisted in IndexedDB via Dexie.js. Deployed to Cloudflare via Wrangler.

**For project context and design rationale, see [design-outline.md](./docs/design-outline.md)**
**For full technical architecture, see [technical-design.md](./docs/technical-design.md)**
**For outstanding tasks, see [tasks.md](./docs/tasks.md)**

---

## Universal Rules

- Guard clauses, early returns, avoid deep nesting
- No inline returns in `if` statements
- Comment the why not the how, except for `// todo comments`
- No documentation such as JSDocs or XML Comments unless explicitly asked to provide
- Simple, concise, single-purpose code
- Single responsibility components, helpers and utilities
- Follow KISS principle
- Follow DRY principle
- Test-minded, but don't write tests unless asked to do so
- Leverage dependency injection and inversion of control when possible
- Keep exceptions truly exceptional, return `Result<T>` objects instead of throwing

---

## Project Rules

- Arrow functions for component event handlers, callbacks, and internal functions
- Named functions only for standalone helpers and utilities in separate utility files
- Arrow functions require parens, destructure objects
- Components: `export function Component(props: ComponentProps) {...}`
- Break down complex components into smaller ones, but avoid over-abstraction
- Keep logic in helpers/hooks, not in Components
- Named exports only — no default exports
- Use `type` for typing (not `interface`)
- Single component per file
- Single-purpose components encapsulating Tailwind CSS
- No index barrel files
- Dates handled with `date-fns`
- Import ordering: external deps → project deps
- Keep types close to where they're used; move to a feature or shared location only if used outside of its originating Component, helper, or utility
- No primitive constructors for coercion: use `+value` not `Number(value)`, `!!value` not `Boolean(value)`, `` `${value}` `` not `String(value)`
- Run `npm run build` to verify no build errors after major changes
- `React.FormEvent` is marked deprecated — use `React.SubmitEvent<T>` for form submit handlers
- Use the `clsx` package for dynamic CSS class name creation
- Keep CONSTANTS that are not component specific in a root constants.ts file

---

## Task-Specific Rules

- Only complete one task at a time before asking for next unless instructed otherwise
- When completing a task, mark it done in [tasks.md](./docs/tasks.md)

---

## Technology Stack

| Layer           | Library / Tool        | Version                             |
| --------------- | --------------------- | ----------------------------------- |
| Build           | Vite                  | ^7                                  |
| UI framework    | React                 | ^19                                 |
| Language        | TypeScript            | ~5.9                                |
| Routing         | React Router          | ^7                                  |
| Database        | Dexie.js (IndexedDB)  | ^4                                  |
| Styling         | Tailwind CSS v4       | ^4 (via `@tailwindcss/vite` plugin) |
| Icons           | Lucide React          | ^0.563                              |
| Charts          | Recharts              | ^3 (installed, not fully used yet)  |
| Dates           | date-fns              | ^4                                  |
| Immutable state | Immer                 | ^11                                 |
| Classnames      | clsx                  | ^2                                  |
| Error boundary  | react-error-boundary  | ^6                                  |
| PWA             | vite-plugin-pwa       | ^1                                  |
| Deployment      | Cloudflare / Wrangler | ^4                                  |

---

## Directory Structure

```
src/
  App.tsx                    # Route definitions, initialization guard
  main.tsx                   # App entry point, provider tree
  index.css                  # Tailwind base styles
  constants.ts               # App-level constants
  vite-env.d.ts

  components/                # Shared UI primitives
    Button.tsx
    EmptyState.tsx
    FileSelect.tsx
    FormFooter.tsx
    FormInput.tsx
    FormSelect.tsx
    FormTextarea.tsx
    FullscreenLoader.tsx
    GenericError.tsx
    Icon.tsx                 # Wraps Lucide icons by IconName
    IconGrid.tsx
    ItemListButton.tsx
    RequireOnboarding.tsx    # Route guard — redirects to /onboarding if needed
    RestoreBackupButton.tsx
    SectionHeader.tsx
    Toast.tsx / ToastContainer.tsx

  contexts/                  # React context definitions (no logic)
    AppInitializationContext.ts
    DatabaseContext.ts
    LayoutConfigContext.ts
    ThemeContext.ts
    ToastContext.ts

  providers/                 # Context providers (hold state/logic)
    AppInitializationProvider.tsx
    DatabaseProvider.tsx
    LayoutConfigProvider.tsx
    ThemeProvider.tsx
    ToastProvider.tsx

  hooks/                     # Custom hooks (all data access lives here)
    useAppInitialization.ts
    useAppUpdateAvailable.ts
    useBackup.ts
    useDatabase.ts
    useImmerState.ts         # Immer-backed useState wrapper
    useLayoutConfig.ts
    useLocations.ts
    usePageTitle.ts
    useServiceWorkerUpdate.ts
    useSessions.ts
    useSettings.ts
    useStats.ts
    useTheme.ts
    useToast.ts
    useUserPreferences.ts
    useVehicles.ts

  data/                      # Database layer
    db.ts                    # Dexie instance (version 1 schema)
    data-types.ts            # Entity types: Vehicle, Location, ChargingSession, Settings
    constants.ts             # DB name, default locations, settings key
    repositories.ts          # Standalone DB functions (seedDefaultLocations, loadSettings)

  helpers/                   # Pure business-logic helpers
    preferenceHelpers.ts
    sessionHelpers.ts        # Session metadata, grouping, display helpers
    statsHelpers.ts

  utilities/                 # Pure utility functions
    backupUtils.ts           # exportBackup, readBackupFile, restoreBackup
    dataUtils.ts             # generateId()
    dateUtils.ts
    formatUtils.ts
    resultUtils.ts           # Result<T>, success(), failure(), isSuccess(), isFailure()
    themeUtils.ts

  types/                     # Shared types used across multiple features
    preference-types.ts      # UserPreferences
    shared-types.ts          # ThemeMode, TimeFilterValue, IconName, ALL_ICONS, etc.
    toast-types.ts

  pages/
    ErrorPage.tsx
    NotFoundPage.tsx
    dashboard/               # Dashboard, DashboardStats, DashboardRecentSessions, DashboardStatCard
    layout/                  # Layout, AppHeader, NavigationDrawer, NavigationLinks, ThemeSelector, MenuOverlay
    onboarding/              # Onboarding (3-step flow + shared components)
    sessions/                # SessionsList, SessionDetails, SessionForm, SessionItem, etc.
    settings/                # Settings, LocationDetails, LocationForm, LocationItem, etc.
    vehicles/                # VehiclesList, VehicleDetails, VehicleForm, VehicleItem, etc.

public/
  icons/                     # PWA icons (16, 32, 180, 192, 512 — standard + maskable)
```

---

## Data Model

```
Vehicle        { id, name?, make, model, year, icon, createdAt, isActive: 0|1 }
Location       { id, name, icon, color, defaultRate, createdAt, isActive: 0|1, order? }
ChargingSession{ id, vehicleId, locationId, energyKwh, ratePerKwh, costCents, chargedAt, notes? }
Settings       { key: 'app-settings', onboardingComplete }
UserPreferences (localStorage) { lastVehicleId?, lastLocationId?, recentSessionsLimit,
                                 sessionsFilterTimeRange?, sessionsFilterVehicleId?,
                                 sessionsFilterLocationId? }
```

**Key invariants:**
- `costCents` is computed at session creation (`round(energyKwh × ratePerKwh × 100)`) and never recalculated
- Vehicles and locations use soft-delete (`isActive: 0`) to preserve session history
- Deletion is blocked if the entity has existing sessions
- Theme persists to `localStorage` so it loads before IndexedDB is ready
- `UserPreferences` persists to `localStorage`

---

## IndexedDB Schema (Dexie v1)

```
vehicles:  id, isActive, createdAt
locations: id, isActive, createdAt, order
sessions:  id, vehicleId, locationId, chargedAt, [vehicleId+chargedAt]
settings:  key
```

---

## Provider Tree (mount order in main.tsx)

```
<ErrorBoundary>
  <ToastProvider>
    <DatabaseProvider db={db}>
      <ThemeProvider>
        <AppInitializationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppInitializationProvider>
      </ThemeProvider>
    </DatabaseProvider>
  </ToastProvider>
</ErrorBoundary>
```

---

## Routing

```
/error                          → ErrorPage (initialization failures)
/onboarding                     → Onboarding (3-step, no guard)

Protected by RequireOnboarding:
/                               → Dashboard
/sessions                       → SessionsList
/sessions/add                   → SessionDetails (create)
/sessions/:id/edit              → SessionDetails (edit)
/vehicles                       → VehiclesList
/vehicles/add                   → VehicleDetails (create)
/vehicles/:id/edit              → VehicleDetails (edit)
/settings                       → Settings
/settings/locations/add         → LocationDetails (create)
/settings/locations/:id/edit    → LocationDetails (edit)
*                               → NotFoundPage
```

---

## Key Patterns

### Result<T> pattern
All data-mutation hook methods return `Result<T>` instead of throwing:

```ts
// src/utilities/resultUtils.ts
type Result<T> = Success<T> | Failure;
success(data)   // → { success: true, data }
failure(msg)    // → { success: false, error: string }
isSuccess(r)    // type guard
isFailure(r)    // type guard
```

Use `isSuccess` / `isFailure` guards to branch in components.

### Custom hooks for all data access
Components never import `db` directly — they call hooks:

```ts
const { createSession } = useSessions();
const result = await createSession(input);
if (isFailure(result)) { showToast(result.error); return; }
```

### useImmerState
Ergonomic nested state updates:

```ts
const [form, setForm] = useImmerState(initialForm);
setForm((draft) => { draft.vehicle.name = 'New Name'; });
```

### Icon system
All icons go through `<Icon name="home" />` using the `IconName` union type defined in `src/types/shared-types.ts`. Do not use Lucide components directly in feature code.

### Backup / Restore
`src/utilities/backupUtils.ts` exports three functions: `exportBackup`, `readBackupFile`, `restoreBackup`. All wrapped by `useBackup` hook. Restore validates schema version match before overwriting.

---

## Development Commands

```bash
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Build then serve locally via Wrangler
npm run deploy    # Build then deploy to Cloudflare
```

Run `npm run build` after significant changes to catch type errors before committing.

---

## PWA Notes

- Service worker is generated by `vite-plugin-pwa` — do not edit it manually
- Precaches the full app shell; no runtime network requests needed
- `useServiceWorkerUpdate` / `useAppUpdateAvailable` handle update detection and prompting
- App requests persistent storage (`navigator.storage.persist()`) on init via `AppInitializationProvider`
- Storage usage shown on the Settings page via `navigator.storage.estimate()`
