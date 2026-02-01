# EV Charge Tracker - Implementation Tasks

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

1. [ ] Implement DatabaseProvider context
   - Create context to provide single Dexie db instance to entire app
2. [ ] Implement AppInitializationProvider context
   - Create context to handle app initialization (settings check, location seeding, persistent storage request)
   - Provide isLoading, needsOnboarding, settings to app
3. [ ] Implement useDatabase hook
   - Create hook to access db from DatabaseContext
4. [ ] Implement useAppInitialization hook
   - Create hook to access initialization state from AppInitializationContext
5. [ ] Implement useSettings hook
   - Create hook with useLiveQuery for settings CRUD operations and completeOnboarding()
6. [ ] Implement useVehicles hook
   - Create hook with useLiveQuery for vehicle CRUD operations, including soft delete logic
7. [ ] Implement useLocations hook
   - Create hook with useLiveQuery for location CRUD operations, including soft delete logic and deletion validation
8. [ ] Implement useSessions hook
   - Create hook with useLiveQuery for session CRUD with filters (vehicleId, locationId, dateRange)
9. [ ] Implement useStats hook
   - Create hook to compute totalKwh, totalCost, avgRate, byLocation (with names), byDate from sessions

## 4. Routing & Pages

1. [ ] Set up React Router structure
   - Configure routes: /, /onboarding, /sessions, /sessions/add, /sessions/:id/edit, /vehicles, /vehicles/add, /vehicles/:id/edit, /settings
2. [ ] Create Onboarding flow pages
   - Build 3-step onboarding: Welcome screen, Review/Edit Locations, First vehicle creation
3. [ ] Build Dashboard page
   - Create main dashboard with stats summary, recent sessions, empty state handling
4. [ ] Build SessionsList page
   - Create sessions list with filters, sorting, empty states, edit/delete actions
5. [ ] Build SessionForm component
   - Create form for adding/editing sessions with cost calculation (energyKwh × ratePerKwh × 100), location selector with rate auto-fill
6. [ ] Build VehiclesList page
   - Create vehicles list with add/edit/delete actions, handle deletion validation
7. [ ] Build VehicleForm component
   - Create form for adding/editing vehicles with emoji icon picker
8. [ ] Build Settings page
   - Create settings page with locations management section (add/edit/delete locations), storage info (navigator.storage.estimate), app info

## 5. UI Components

1. [ ] Create reusable UI components
   - Build Button, Input, Select, Card, Modal, EmptyState components with Tailwind styling
2. [ ] Implement charts with Recharts
   - Create energy usage by location chart and timeline chart for dashboard

## 6. PWA Features

1. [ ] Generate PWA icons
   - Create icons in public/icons/: 192x192, 512x512, 180x180, 32x32, 16x16
2. [ ] Configure PWA manifest
   - Set up manifest.json with name, icons, theme colors, display mode in vite.config.ts
3. [ ] Implement persistent storage request
   - Add navigator.storage.persist() call on app init, show storage quota in settings
4. [ ] Add service worker update notification
   - Detect new service worker and show 'Update available' UI with reload action

## 7. Business Logic & Testing

1. [ ] Implement app initialization flow
   - Create logic to check settings, seed locations if needed, redirect to onboarding if needed, create default settings on first launch
2. [ ] Add vehicle deletion safety checks
   - Prevent deletion of vehicles with sessions, offer cascade delete option
3. [ ] Add location deletion safety checks
   - Prevent deletion of locations with sessions
4. [ ] Test offline functionality
   - Verify all features work without network, test service worker caching
5. [ ] Build and deploy to static hosting
   - Configure deployment to Vercel/Netlify/GitHub Pages with HTTPS
