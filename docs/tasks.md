# EV Charge Tracker - Implementation Tasks

## Progress Summary

- **Phase 1 - Setup**: ✅ Complete (4/4)
- **Phase 2 - Data Layer**: ✅ Complete (4/4)
- **Phase 3 - Context Providers & Hooks**: ✅ Complete (11/11)
- **Phase 4 - Routing & Pages**: ✅ Complete (8/8)
- **Phase 5 - UI Components**: 🚧 In Progress (1/2)
- **Phase 6 - Tech Debt / Cleanup**: ⏳ Not Started (0/5)
- **Phase 7 - PWA Features**: 🚧 In Progress (2/4)
- **Phase 8 - Business Logic & Testing**: 🚧 In Progress (3/5)

**Overall Progress**: 30/42 tasks complete (71%)

### Next Up
All pages are implemented! Next priorities:
1. Implement charts with Recharts (energy by location, timeline)
2. Generate PWA icons (192x192, 512x512, 180x180, 32x32, 16x16)
3. Add service worker update notification
4. Address tech debt (type consolidation, helpers cleanup, async/await)

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

1. [ ] Organize the types that are sprinkled throughout the components and helpers into feature level types or global types
2. [ ] Check for opportunities to use the `useImmerState` hook
3. [ ] More specific error pages
4. [ ] Clean up helpers by removing the useless `build*Input` helpers
5. [ ] Standardize on a page max-width across all pages
6. [ ] Replace `Promise.then` with `async/await`

## 7. PWA Features

1. [ ] Generate PWA icons
   - Create icons in public/icons/: 192x192, 512x512, 180x180, 32x32, 16x16 (standard + maskable variants)
   - All icons (including favicon) must visually match the Lucide "zap" icon used in Settings > About
2. [x] Configure PWA manifest
   - Set up manifest with name, icons, theme_color: #14b8a6 (teal-500), display: standalone in vite.config.ts
3. [x] Implement persistent storage request
   - Add navigator.storage.persist() call on app init, show storage quota in settings
4. [ ] Add service worker update notification
   - Detect new service worker and show 'Update available' UI with reload action

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

## Post-MVP

1. [ ] Support vehicle image upload
   - Allow users to upload a custom image for their vehicle instead of the default 🚗 emoji
   - Store image reference and display in VehicleItem and other vehicle displays
2. [ ] Export, backup and restore functionality
3. [ ] Sync ability using users storage accounts
   - iCloud, Drive, OneDrive, etc. 