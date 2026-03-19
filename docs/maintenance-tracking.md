# Feature Design: Maintenance & Service Tracking

**Status: Draft** — See [tasks.md](./tasks.md) for implementation tracking.

## 1. Objective

Add a maintenance and service record log to the app, allowing users to track scheduled and completed vehicle servicing (tire rotations, brake checks, inspections, software updates, etc.) alongside their charging history.

Records are associated to a specific vehicle. The feature lives at its own root route (`/maintenance`) that is accessible from the dashboard but is not part of the bottom tab bar navigation.

---

## 2. Data Model

### MaintenanceType Enum

```typescript
const MAINTENANCE_TYPES = [
  'tire_rotation',
  'tire_replacement',
  'brake_service',
  'battery_service',
  'software_update',
  'inspection',
  'cabin_filter',
  'wiper_replacement',
  'coolant_service',
  'other',
] as const;

type MaintenanceType = (typeof MAINTENANCE_TYPES)[number];
```

### MaintenanceRecord Schema (Zod)

```typescript
export const MaintenanceRecordSchema = z.object({
  id: z.string(),                              // UUID
  vehicleId: z.string(),                       // FK → Vehicle.id
  type: z.enum(MAINTENANCE_TYPES),
  description: z.string(),                     // Short summary, e.g. "Rotated all four tires"
  costCents: z.number().optional(),            // Integer cents — same pattern as ChargingSession
  mileage: z.number().int().optional(),        // Odometer reading at time of service (miles)
  serviceProvider: z.string().optional(),      // Shop or mechanic name
  servicedAt: z.number(),                      // Epoch ms — date service was performed
  nextDueDate: z.number().optional(),          // Epoch ms — reminder date for next service
  nextDueMileage: z.number().int().optional(), // Mileage reminder for next service
  notes: z.string().optional(),
  createdAt: z.number(),                       // Epoch ms
});
```

**Key rules:**
- `costCents` is stored once at creation and never recalculated, preserving historical accuracy (same rule as `ChargingSession.costCents`).
- `vehicleId` is required — every record belongs to exactly one vehicle.
- `servicedAt` defaults to "now" in the form (same as `ChargingSession.chargedAt`).
- `mileage`, `nextDueDate`, and `nextDueMileage` are all optional to keep the form lightweight.

### Dexie Table

Add `maintenanceRecords` to the Dexie schema:

```typescript
// src/data/db.ts
maintenanceRecords: '++id, vehicleId, servicedAt, [vehicleId+servicedAt]'
```

Indexed by `[vehicleId+servicedAt]` for efficient per-vehicle listing sorted by date.

---

## 3. File Structure

Mirrors the sessions page structure exactly.

```
src/
├── data/
│   └── schemas.ts                        # Add MaintenanceRecordSchema, MAINTENANCE_TYPES
├── helpers/
│   └── maintenanceHelpers.ts             # groupRecordsByDate, createTypeLabel, sortRecords
├── pages/
│   └── maintenance/
│       ├── maintenance-types.ts          # MaintenanceFormData, MaintenanceInputData
│       ├── maintenanceFormHelpers.ts     # buildInputData, getDefaultDateTime
│       ├── MaintenanceList.tsx           # /maintenance — list page
│       ├── MaintenanceDetails.tsx        # /maintenance/add and /maintenance/:id/edit
│       ├── MaintenanceForm.tsx           # Reusable form component
│       ├── MaintenanceItem.tsx           # Individual record row/card
│       ├── MaintenanceItemActions.tsx    # Edit / delete inline actions
│       └── MaintenanceEmptyState.tsx     # Empty state for no records
```

### Type Conventions (`maintenance-types.ts`)

```typescript
// What the form controls bind to
type MaintenanceFormData = {
  vehicleId: string;
  type: MaintenanceType | '';
  description: string;
  costCents: string;         // user input, converted on save
  mileage: string;           // user input, converted on save
  serviceProvider: string;
  servicedAt: string;        // ISO datetime string for <input type="datetime-local">
  nextDueDate: string;       // ISO date string for <input type="date">
  nextDueMileage: string;
  notes: string;
};

// Validated, ready-to-persist shape
type MaintenanceInputData = {
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
};
```

---

## 4. Routing

Maintenance lives inside the `Layout` wrapper (gets `AppHeader` + `BottomTabBar`) but is **not** registered in `BottomTabBar`'s `TABS` array. Access is via dashboard only.

```
Layout
├── /maintenance                MaintenanceList        (tab bar visible)
├── /maintenance/add            MaintenanceDetails     (tab bar hidden)
└── /maintenance/:id/edit       MaintenanceDetails     (tab bar hidden)
```

Add to `src/router.tsx` alongside existing protected routes:

```typescript
{ path: '/maintenance',          element: <MaintenanceList /> },
{ path: '/maintenance/add',      element: <MaintenanceDetails /> },
{ path: '/maintenance/:id/edit', element: <MaintenanceDetails /> },
```

`MaintenanceDetails` calls `usePageConfig('Add Service Record', true)` or `usePageConfig('Edit Service Record', true)` to hide the tab bar — matching the pattern of `SessionDetails` and `VehicleDetails`.

---

## 5. Dashboard Integration

### 5a. Extend DashboardStatCard

Add an optional `action` prop to `DashboardStatCard` so any card can render a tappable link at the bottom:

```typescript
// src/pages/dashboard/DashboardStatCard.tsx
type DashboardStatCardProps = {
  label: string;
  value: string;
  icon: IconName;
  action?: {
    label: string;
    onClick: () => void;
  };
};
```

When `action` is provided, render a small text button below the stat value:

```tsx
{action && (
  <button
    onClick={action.onClick}
    className="text-primary mt-2 text-xs font-medium"
  >
    {action.label}
  </button>
)}
```

This prop is optional and backward-compatible — existing stat cards remain unchanged.

### 5b. Maintenance Summary on Dashboard

Add a `MaintenanceSummaryCard` component to the dashboard (below the charging stats grid). It shows:
- Count of service records for the currently filtered vehicle (or all vehicles if no filter)
- The most recent service type and date

The card uses `DashboardStatCard` with an action:

```tsx
<DashboardStatCard
  label="Last Service"
  value={lastServiceLabel}     // e.g. "Tire Rotation · 12 days ago"
  icon="wrench"
  action={{ label: 'View all →', onClick: () => navigate('/maintenance') }}
/>
```

If no records exist, `value` is `"No records yet"` and the action label is `"Add first record →"`.

---

## 6. UI & UX

### MaintenanceList (`/maintenance`)

- Page title: `"Maintenance"` via `usePageConfig('Maintenance', false)`
- Filter bar: vehicle selector (reuse `SessionsFilter` vehicle dropdown pattern)
- Records grouped by year-month (e.g. `"March 2026"`), newest first
- Each `MaintenanceItem` shows: type label + icon, description, date, optional cost + mileage
- FAB or header button: `"+ Add Record"` → navigates to `/maintenance/add`
- Empty state: `MaintenanceEmptyState` with prompt to log first record

### MaintenanceDetails (`/maintenance/add`, `/maintenance/:id/edit`)

Form fields (in order):

| Field            | Input type         | Required |
|------------------|--------------------|----------|
| Vehicle          | Select             | Yes      |
| Service type     | Select (enum)      | Yes      |
| Description      | Text               | Yes      |
| Date of service  | `datetime-local`   | Yes      |
| Cost             | Number (currency)  | No       |
| Mileage          | Number (integer)   | No       |
| Service provider | Text               | No       |
| Next due date    | `date`             | No       |
| Next due mileage | Number (integer)   | No       |
| Notes            | Textarea           | No       |

- Vehicle pre-fills from `preferences.lastVehicleId` (same as session form)
- Date of service defaults to current datetime
- `FormFooter` with Save / Cancel buttons (same pattern as `SessionDetails`)

---

## 7. Business Logic

- **Cost immutability**: `costCents` is computed once on save and stored. It is never recalculated, preserving the record's historical value regardless of future currency formatting changes.
- **Soft-deleted vehicles**: When loading records, join against `Vehicle.isActive`. Records for inactive vehicles remain in the list but the vehicle name is rendered with a `(removed)` label — same approach as sessions.
- **Next-due reminders**: `nextDueDate` and `nextDueMileage` are stored but reminder logic (push notifications, dashboard badges) is out of scope for the initial implementation. These fields are captured now for future use.
- **No location FK**: Unlike charging sessions, maintenance records are not tied to a charging location.

---

## 8. Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Access route | Dashboard card only (not tab bar) | Maintenance is less frequent than charging; keeps tab bar focused |
| Data relationship | One record → one vehicle | Mirrors sessions; maintenance is always vehicle-specific |
| Cost storage | Integer cents | Consistent with `ChargingSession.costCents`; avoids float precision issues |
| Dashboard entry point | New stat card with action prop | Extends existing `DashboardStatCard` cleanly; no new layout components |
| Grouping in list | By month | Maintenance is sparse (monthly/quarterly); date-grouping would be too granular |
| `nextDue` fields | Stored, no active reminders | Captures the data now; reminder system is a separate future feature |
| Mileage unit | Miles (integer) | Matches US-centric defaults; unit label can be made configurable later |
