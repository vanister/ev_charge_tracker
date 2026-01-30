# EV Charge Tracker - Implementation Tasks

## Setup Phase

- [ ] Initialize Vite React TypeScript project
  - Run `npm create vite@latest ev-charge-tracker -- --template react-ts` and set up basic project structure
- [ ] Install core dependencies
  - Install dexie, dexie-react-hooks, react-router-dom, recharts, date-fns
- [ ] Set up Tailwind CSS
  - Install and configure tailwindcss, postcss, autoprefixer with `npx tailwindcss init -p`
- [ ] Install and configure Vite PWA plugin
  - Install vite-plugin-pwa and configure in vite.config.ts for service worker generation

## Data Layer

- [ ] Create TypeScript types and interfaces
  - Define Vehicle, ChargingSession, Settings, LocationType types in src/types/
- [ ] Set up Dexie database schema
  - Create src/lib/db.ts with vehicles, sessions, settings stores and indexes
- [ ] Create constants file
  - Define LOCATION_TYPES map with labels, icons, colors in src/lib/constants.ts

## Data Access Hooks

- [ ] Implement useAppReady hook
  - Create hook to check if settings exist and if onboarding is complete
- [ ] Implement useSettings hook
  - Create hook with useLiveQuery for settings CRUD operations and completeOnboarding()
- [ ] Implement useVehicles hook
  - Create hook with useLiveQuery for vehicle CRUD operations, including soft delete logic
- [ ] Implement useSessions hook
  - Create hook with useLiveQuery for session CRUD with filters (vehicleId, locationType, dateRange)
- [ ] Implement useStats hook
  - Create hook to compute totalKwh, totalCost, avgRate, byLocation, byDate from sessions

## Routing & Pages

- [ ] Set up React Router structure
  - Configure routes: /, /onboarding, /sessions, /sessions/add, /sessions/:id/edit, /vehicles, /vehicles/add, /vehicles/:id/edit, /settings
- [ ] Create Onboarding flow pages
  - Build 3-step onboarding: Welcome screen, Default rates setup, First vehicle creation
- [ ] Build Dashboard page
  - Create main dashboard with stats summary, recent sessions, empty state handling
- [ ] Build SessionsList page
  - Create sessions list with filters, sorting, empty states, edit/delete actions
- [ ] Build SessionForm component
  - Create form for adding/editing sessions with cost calculation (energyKwh × ratePerKwh × 100)
- [ ] Build VehiclesList page
  - Create vehicles list with add/edit/delete actions, handle deletion validation
- [ ] Build VehicleForm component
  - Create form for adding/editing vehicles with emoji icon picker
- [ ] Build Settings page
  - Create settings page for default rates, storage info (navigator.storage.estimate), app info

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
  - Create logic to check settings, redirect to onboarding if needed, create default settings on first launch
- [ ] Add vehicle deletion safety checks
  - Prevent deletion of vehicles with sessions, offer cascade delete option
- [ ] Test offline functionality
  - Verify all features work without network, test service worker caching
- [ ] Build and deploy to static hosting
  - Configure deployment to Vercel/Netlify/GitHub Pages with HTTPS
