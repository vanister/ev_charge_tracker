# EV Charge Tracker - Technical Architecture

> Detailed technical specifications. For hook APIs and shared contracts, see [architecture.md](../architecture.md). For a high-level overview, see [design-outline.md](./design-outline.md).

## Overview

A fully offline PWA for tracking EV charging sessions. Designed to function as a native-like app without app store distribution, with all data stored locally on-device.

## Technology Stack

### Core

- **Vite** -- build tool and dev server
- **React 19** -- UI framework
- **TypeScript** -- type safety
- **Dexie.js v4** -- IndexedDB wrapper
- **Zod** -- schema validation (entity schemas in `src/data/schemas.ts`)
- **vite-plugin-pwa** -- service worker generation

### UI & Styling

- **Tailwind CSS v4** -- utility-first CSS (bundled via `@tailwindcss/vite` plugin)
- **Lucide React** -- tree-shakeable SVG icon components
- **Recharts** -- chart components for dashboard analytics
- **clsx** -- conditional className utility

### Additional

- **React Router v7** -- client-side routing
- **Immer** -- immutable state updates (via `useImmerState` hook)
- **date-fns** -- date utilities (wrapped by `src/utilities/dateUtils.ts`)
- **react-error-boundary** -- error boundary components

### Deployment

- **Cloudflare Workers / Wrangler** -- hosting and deployment

## Architecture Principles

### Offline-First Design

- All features work without internet connection
- No backend API, no cloud sync (yet)
- Data never leaves the device
- Network only needed for initial app download and updates
- IndexedDB for all persistent data
- Persistent storage requested to survive browser cleanup

### PWA as App Store Alternative

- Hosted on Cloudflare Workers
- Users install directly from browser
- Auto-updates via service worker with user-prompted reload
- No app store review process or platform fees

---

## Data Model

### Entity Relationships

```
Vehicle  --< ChargingSession >--  Location
Vehicle  --< MaintenanceRecord
Settings (singleton, key='app-settings')
SystemConfig (singleton, key='system-config')
```

### Database Schema (Dexie v4, 4 versions)

```
v1:
  vehicles:    ++id, isActive, createdAt
  sessions:    ++id, vehicleId, locationId, chargedAt, [vehicleId+chargedAt]
  settings:    key
  locations:   ++id, isActive, createdAt, order

v2:
  systemConfig: key

v3-v4:
  maintenanceRecords: ++id, vehicleId, servicedAt, [vehicleId+servicedAt]
```

### Entity Schemas

Types are inferred from Zod schemas defined in `src/data/schemas.ts` and exported from `src/data/data-types.ts`. See [architecture.md](../architecture.md) for complete type definitions.

Key entities: `Vehicle`, `Location`, `ChargingSession`, `MaintenanceRecord`, `Settings`, `SystemConfig`.

---

## First Launch & Onboarding

### App Initialization Flow

```
App Launch
  -> Settings exist? No -> Create defaults
  -> Locations exist? No -> Seed default locations
  -> onboardingComplete? No -> Show Onboarding
  -> Otherwise -> Show Dashboard
```

### Onboarding Steps

1. **Welcome** -- app name and purpose, "Get Started" button
2. **Review/Edit Locations** -- show seeded defaults, allow editing, explain they can be changed in Settings
3. **First Vehicle** -- required: make/model/year, optional: name, icon picker -> mark onboarding complete -> Dashboard

---

## PWA Configuration

### Icons

Seven icon assets in `public/icons/`: 192x192, 192x192-maskable, 512x512, 512x512-maskable, 180x180 (iOS), 32x32, 16x16 (favicon).

### Manifest

- Name: "EV Charge Tracker"
- Short name: "Charge Tracker"
- Theme color: `#14b8a6` (teal-500)
- Display: `standalone`

### Service Worker

- **Register type**: `prompt` -- user is prompted to apply updates
- Precaches all JS/CSS bundles and app shell at install time
- Custom notification handling via `sw-notifications.js`
- Update flow: detect new SW -> show toast notification -> user taps to reload

### Persistent Storage

On app init, requests `navigator.storage.persist()`. Settings page displays storage quota usage via `navigator.storage.estimate()`.

---

## Data Access Pattern

### Context Providers

See [architecture.md](../architecture.md) for the full provider hierarchy and hook contracts.

- **DatabaseProvider** -- single Dexie instance via context
- **ThemeProvider** -- light/dark/system, persisted to localStorage
- **AppInitializationProvider** -- seeds defaults, requests persistent storage
- **ToastProvider** -- toast notification queue
- **LayoutConfigProvider** -- per-page title and tab bar visibility

### Custom Hooks

All data-mutation hooks return `Promise<Result<T>>` instead of throwing. Components never import `db` directly -- all access through hooks that use `useDatabase()`.

See [architecture.md](../architecture.md) for complete hook signatures.

---

## Business Logic

### Cost Calculation

```
costCents = Math.round(energyKwh * ratePerKwh * 100)
```

Stored permanently at session creation. Changing default rates does not affect existing sessions.

### Vehicle Deletion

Blocked if the vehicle has any sessions. User must delete sessions first.

### Location Deletion

Blocked if the location has any sessions. Soft delete via `isActive` field.

### Default Rate Application

When a location is selected on the session form, `ratePerKwh` is pre-filled from `location.defaultRate`. User can override.

### Gas Comparison

Compares EV charging costs to equivalent gas costs. Uses EPA standard (33.7 kWh = 1 gallon of gas) and configurable gas price / MPG values stored in settings. See [gas-comparison-design.md](./gas-comparison-design.md).

### Maintenance Tracking

Per-vehicle maintenance records with type categorization (tire rotation, brake service, battery service, software update, inspection, etc.), cost tracking, mileage, and next-due date/mileage scheduling. Dashboard shows upcoming maintenance summary.

### Backup & Restore

JSON export/import with Zod schema validation and database version checking. Configurable backup reminder intervals with dismissible notifications.

---

## Key Design Decisions

| Decision | Rationale |
| --- | --- |
| Offline-only | Privacy, no backend costs, instant performance |
| IndexedDB via Dexie | Good DX, handles large datasets |
| Zod schemas | Runtime validation for backup restore, type inference |
| Result\<T\> pattern | No exceptions for expected errors, predictable flow |
| Cost stored as cents | Avoid floating point math issues |
| Cost never recalculates | Historical accuracy |
| Soft delete for vehicles/locations | Preserve session history integrity |
| Dynamic location store | User can customize locations, rates, add new ones |
| Lucide icons | Tree-shakeable SVG, consistent rendering |
| Immer for form state | Ergonomic nested state updates |
| Theme in localStorage | Instant theme on load before IndexedDB is ready |
| Persistent storage request | Reduce chance of data loss |
