# EV Charge Tracker - Implementation Tasks

## Setup Phase

- [x] Initialize Vite React TypeScript project
  - Run `npm create vite@latest ev-charge-tracker -- --template react-ts` and set up basic project structure
- [x] Install core dependencies
  - Install dexie, dexie-react-hooks, react-router-dom, recharts, date-fns
- [x] Set up Tailwind CSS
  - Install and configure tailwindcss, postcss, autoprefixer with `npx tailwindcss init -p`
- [x] Install and configure Vite PWA plugin
  - Install vite-plugin-pwa and configure in vite.config.ts for service worker generation

## Data Layer

- [x] Create TypeScript types and interfaces
  - Define Vehicle, ChargingSession, Settings, Location types in src/data/data-types.ts
- [x] Set up Dexie database schema
  - Create src/data/db.ts with vehicles, sessions, settings, locations stores and indexes
- [x] Create constants file
  - Define DEFAULT_LOCATIONS seed templates in src/data/constants.ts
- [x] Create utility functions
  - Add generateId(), seedDefaultLocations(), getDefaultSettings() in src/data/utils.ts

## Data Access Hooks

- [ ] Implement useAppReady hook
  - Create hook to check if settings exist and if onboarding is complete
- [ ] Implement useSettings hook
  - Create hook with useLiveQuery for settings CRUD operations and completeOnboarding()
- [ ] Implement useVehicles hook
  - Create hook with useLiveQuery for vehicle CRUD operations, including soft delete logic
- [ ] Implement useLocations hook
  - Create hook with useLiveQuery for location CRUD operations, including soft delete logic and deletion validation
- [ ] Implement useSessions hook
  - Create hook with useLiveQuery for session CRUD with filters (vehicleId, locationId, dateRange)
- [ ] Implement useStats hook
  - Create hook to compute totalKwh, totalCost, avgRate, byLocation (with names), byDate from sessions

## Routing & Pages

- [ ] Set up React Router structure
  - Configure routes: /, /onboarding, /sessions, /sessions/add, /sessions/:id/edit, /vehicles, /vehicles/add, /vehicles/:id/edit, /settings
- [ ] Create Onboarding flow pages
  - Build 3-step onboarding: Welcome screen, Review/Edit Locations, First vehicle creation
- [ ] Build Dashboard page
  - Create main dashboard with stats summary, recent sessions, empty state handling
- [ ] Build SessionsList page
  - Create sessions list with filters, sorting, empty states, edit/delete actions
- [ ] Build SessionForm component
  - Create form for adding/editing sessions with cost calculation (energyKwh × ratePerKwh × 100), location selector with rate auto-fill
- [ ] Build VehiclesList page
  - Create vehicles list with add/edit/delete actions, handle deletion validation
- [ ] Build VehicleForm component
  - Create form for adding/editing vehicles with emoji icon picker
- [ ] Build Settings page
  - Create settings page with locations management section (add/edit/delete locations), storage info (navigator.storage.estimate), app info

## UI Components

- [ ] Create reusable UI components
  - Build Button, Input, Select, Card, Modal, EmptyState components with Tailwind styling
- [ ] Implement charts with Recharts
  - Create energy usage by location chart and timeline chart for dashboard

## PWA Features

- [ ] Generate PWA icons
  - Create icons in public/icons/: 192x192, 512x512, 180x180, 32x32, 16x16
- [ ] Configure PWA manifest
  - Set up manifest.json with name, icons, theme colors, display mode in vite.config.ts
- [ ] Implement persistent storage request
  - Add navigator.storage.persist() call on app init, show storage quota in settings
- [ ] Add service worker update notification
  - Detect new service worker and show 'Update available' UI with reload action

## Business Logic & Testing

- [ ] Implement app initialization flow
  - Create logic to check settings, seed locations if needed, redirect to onboarding if needed, create default settings on first launch
- [ ] Add vehicle deletion safety checks
  - Prevent deletion of vehicles with sessions, offer cascade delete option
- [ ] Add location deletion safety checks
  - Prevent deletion of locations with sessions
- [ ] Test offline functionality
  - Verify all features work without network, test service worker caching
- [ ] Build and deploy to static hosting
  - Configure deployment to Vercel/Netlify/GitHub Pages with HTTPS
