# EV Charge Tracker - Implementation Tasks

## Progress Summary

- **Phase 1 - Setup**: ✅ Complete (4/4)
- **Phase 2 - Data Layer**: ✅ Complete (4/4)
- **Phase 3 - Context Providers & Hooks**: ✅ Complete (8/8)
- **Phase 4 - Routing & Pages**: 🚧 In Progress (6/8)
- **Phase 5 - UI Components**: ⏳ Not Started (0/2)
- **Phase 6 - PWA Features**: 🚧 In Progress (2/4)
- **Phase 7 - Business Logic & Testing**: 🚧 In Progress (3/5)

**Overall Progress**: 27/35 tasks complete (77%)

### Next Up
The foundation is complete! Next priorities:
1. Build Dashboard page with stats and recent sessions
2. Create session management UI (add/edit/list)
3. Create vehicle management UI (add/edit/list)
4. Build Settings page
5. Generate PWA icons and implement update notifications

---

## 1. Setup Phase

1. [x] Initialize Vite React TypeScript project
   - Run `npm create vite@latest ev-charge-tracker -- --template react-ts` and set up basic project structure
2. [x] Install core dependencies
   - Install dexie, dexie-react-hooks, react-router-dom, recharts, date-fns
3. [x] Set up Tailwind CSS
   - Install and configure tailwindcss, postcss, autoprefixer with `npx tailwindcss init -p`
4. [x] Install and configure Vite PWA plugin
   - Install vite-plugin-pwa and configure in vite.config.ts for service worker generation

## 2. Data Layer

1. [x] Create TypeScript types and interfaces
   - Define Vehicle, ChargingSession, Settings, Location types in src/data/data-types.ts
2. [x] Set up Dexie database schema
   - Create src/data/db.ts with vehicles, sessions, settings, locations stores and indexes
3. [x] Create constants file
   - Define DEFAULT_LOCATIONS seed templates in src/data/constants.ts
4. [x] Create utility functions
   - Add generateId(), seedDefaultLocations(), getDefaultSettings() in src/data/utils.ts

## 3. Context Providers & Hooks

1. [x] Implement DatabaseProvider context
   - Create context to provide single Dexie db instance to entire app
2. [x] Implement AppInitializationProvider context
   - Create context to handle app initialization (settings check, location seeding, persistent storage request)
   - Provide isInitialized, needsOnboarding, settings to app
3. [x] Implement useDatabase hook
   - Create hook to access db from DatabaseContext
4. [x] Implement useAppInitialization hook
   - Create hook to access initialization state from AppInitializationContext
5. [x] Implement useSettings hook
   - Create hook with useLiveQuery for settings CRUD operations and completeOnboarding()
6. [x] Implement useVehicles hook
   - Create hook with useLiveQuery for vehicle CRUD operations, including soft delete logic
7. [x] Implement useLocations hook
   - Create hook with useLiveQuery for location CRUD operations, including soft delete logic and deletion validation
8. [x] Implement useSessions hook
   - Create hook with useLiveQuery for session CRUD with filters (vehicleId, locationId, dateRange)

## 4. Routing & Pages

1. [x] Set up React Router structure
   - Configure routes: /, /onboarding, /sessions, /sessions/add, /sessions/:id/edit, /vehicles, /vehicles/add, /vehicles/:id/edit, /settings
2. [x] Create Onboarding flow pages
   - Build 3-step onboarding: Welcome screen, Review/Edit Locations, First vehicle creation
4. [x] Build SessionsList page
   - Create sessions list with filters, sorting, empty states, edit/delete actions
5. [x] Build SessionForm component
   - Create form for adding/editing sessions with cost calculation (energyKwh × ratePerKwh × 100), location selector with rate auto-fill
6. [x] Build VehiclesList page
   - Create vehicles list with add/edit/delete actions, handle deletion validation
7. [x] Build VehicleForm component
   - Create form for adding/editing vehicles with emoji icon picke
8. [ ] Build Settings page
   - Create settings page with locations management section (add/edit/delete locations), storage info (navigator.storage.estimate), app info
9. [ ] Build Dashboard page
   - Create main dashboard with stats summary, recent sessions, empty state handling
   - Implement useStats hook
   - Create hook to compute totalKwh, totalCost, avgRate, byLocation (with names), byDate from sessions

## 5. UI Components

1. [ ] Create reusable UI components
   - Build Button, Input, Select, Card, Modal, EmptyState components with Tailwind styling
2. [ ] Implement charts with Recharts
   - Create energy usage by location chart and timeline chart for dashboard

## 6. PWA Features

1. [ ] Generate PWA icons
   - Create icons in public/icons/: 192x192, 512x512, 180x180, 32x32, 16x16
2. [x] Configure PWA manifest
   - Set up manifest.json with name, icons, theme colors, display mode in vite.config.ts
3. [x] Implement persistent storage request
   - Add navigator.storage.persist() call on app init, show storage quota in settings
4. [ ] Add service worker update notification
   - Detect new service worker and show 'Update available' UI with reload action

## 7. Business Logic & Testing

1. [x] Implement app initialization flow
   - Create logic to check settings, seed locations if needed, redirect to onboarding if needed, create default settings on first launch
2. [x] Add vehicle deletion safety checks
   - Prevent deletion of vehicles with sessions, offer cascade delete option
3. [x] Add location deletion safety checks
   - Prevent deletion of locations with sessions
4. [ ] Test offline functionality
   - Verify all features work without network, test service worker caching
5. [ ] Build and deploy to static hosting
   - Configure deployment to Vercel/Netlify/GitHub Pages with HTTPS
