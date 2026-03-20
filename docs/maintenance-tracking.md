# Feature Design: Maintenance & Service Tracking

**Status: Draft** — See [maintenance-tasks.md](./maintenance-tasks.md) for implementation tracking.

## 1. Objective

Add a maintenance and service record log to the app, allowing users to track scheduled and completed vehicle servicing (tire rotations, brake checks, inspections, software updates, etc.) alongside their charging history.

Records are associated to a specific vehicle. The feature lives under the `/vehicles` route, scoped to a single vehicle at a time, and is accessible from the dashboard but is not part of the bottom tab bar navigation.

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

Mirrors the sessions page structure. Co-located under `src/pages/vehicles/maintenance/` to mirror the app's route hierarchy — maintenance is a sub-feature of vehicles, not a standalone section.

```
src/
├── data/
│   └── schemas.ts                        # Add MaintenanceRecordSchema, MAINTENANCE_TYPES
├── helpers/
│   └── maintenanceHelpers.ts             # groupRecordsByDate, createTypeLabel, sortRecords
├── pages/
│   └── vehicles/
│       └── maintenance/
│           ├── maintenance-types.ts          # MaintenanceFormData, MaintenanceRecord
│           ├── maintenanceFormHelpers.ts     # buildRecord, getDefaultDateTime
│           ├── MaintenanceList.tsx           # /vehicles/:vehicleId/maintenance — list page
│           ├── MaintenanceDetails.tsx        # /vehicles/:vehicleId/maintenance/add and .../maintenance/:id/edit
│           ├── MaintenanceForm.tsx           # Reusable form component
│           ├── MaintenanceItem.tsx           # Individual record row/card
│           ├── MaintenanceItemActions.tsx    # Edit / delete inline actions
│           └── MaintenanceEmptyState.tsx     # Empty state for no records
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
// NOTE: Rename all "InputData" types used for Dexie persistence to "Record" (e.g. MaintenanceRecord).
// "InputData" implies a transient/form shape; "Record" correctly signals it is the stored entity.
// Apply this convention to any existing InputData types across the codebase when encountered.
type MaintenanceRecord = {
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

Maintenance is nested under `/vehicles/:vehicleId`, scoping all records to a single vehicle per page load. It lives inside the `Layout` wrapper but is **not** registered in `BottomTabBar`'s `TABS` array. Because `BottomTabBar` uses `currentPath.startsWith(tab.path)` for active state, the Vehicles tab stays highlighted automatically on all maintenance routes.

```
Layout
├── /vehicles/:vehicleId/maintenance            MaintenanceList        (tab bar visible)
├── /vehicles/:vehicleId/maintenance/add        MaintenanceDetails     (tab bar hidden)
└── /vehicles/:vehicleId/maintenance/:id/edit   MaintenanceDetails     (tab bar hidden)
```

Add to `src/router.tsx` alongside existing vehicle routes:

```typescript
{ path: '/vehicles/:vehicleId/maintenance',          element: <MaintenanceList /> },
{ path: '/vehicles/:vehicleId/maintenance/add',      element: <MaintenanceDetails /> },
{ path: '/vehicles/:vehicleId/maintenance/:id/edit', element: <MaintenanceDetails /> },
```

`vehicleId` is read from `useParams()` in both `MaintenanceList` and `MaintenanceDetails` — it is the source of truth for which vehicle the records belong to. The form does not expose a vehicle selector field.

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

Add two `DashboardStatCard` instances to the dashboard below the charging stats grid, rendered side-by-side in the same 2-column grid to keep the layout balanced. Both cards are scoped to the active vehicle and omitted entirely when no vehicles exist.

`activeVehicleId` is resolved from the dashboard's current vehicle filter, falling back to `preferences.lastVehicleId`.

**Card 1 — Last Service**

Shows the most recent service type. Action navigates to the vehicle's maintenance list:

```tsx
<DashboardStatCard
  label="Last Service"
  value={lastServiceLabel}     // e.g. "Tire Rotation" or "No records yet"
  icon="wrench"
  action={{
    label: 'View all →',
    onClick: () => navigate(`/vehicles/${activeVehicleId}/maintenance`),
  }}
/>
```

If no records exist, `value` is `"No records yet"` and the action label is `"Add first record →"`.

**Card 2 — Last Serviced**

Shows the date of the most recent service record:

```tsx
<DashboardStatCard
  label="Last Serviced"
  value={lastServicedDate}     // e.g. "Mar 8, 2026" or "—"
  icon="calendar"
/>
```

`value` is formatted with `date-fns` (`MMM d, yyyy`). When no records exist, `value` is `"—"`. No action prop on this card.

Both cards are wrapped in a shared `MaintenanceSummaryCard` component that queries the records once and renders both `DashboardStatCard` instances.

---

## 6. UI & UX

### VehicleItem entry point

Add a wrench icon `Link` to `VehicleItem` alongside the existing edit and delete actions:

```tsx
<Link
  to={`/vehicles/${vehicle.id}/maintenance`}
  className="text-body-secondary hover:text-body hover:bg-background rounded-lg p-2 transition-colors"
  aria-label="View maintenance records"
>
  <Icon name="wrench" size="sm" />
</Link>
```

Action order: **wrench → edit → delete**. No other changes to `VehicleItem`.

---

### MaintenanceList (`/vehicles/:vehicleId/maintenance`)

- Page title: `"Maintenance"` via `usePageConfig('Maintenance', false)`
- No vehicle filter — scope is fixed to the `:vehicleId` URL param
- Vehicle name displayed in a sub-heading or breadcrumb for context (e.g. `"Tesla Model 3"`)
- Records grouped by year-month (e.g. `"March 2026"`), newest first
- Each `MaintenanceItem` shows: type label + icon, description, date, optional cost + mileage
- FAB or header button: `"+ Add Record"` → navigates to `/vehicles/:vehicleId/maintenance/add`
- Empty state: `MaintenanceEmptyState` with prompt to log first record

### MaintenanceDetails (`/vehicles/:vehicleId/maintenance/add`, `.../maintenance/:id/edit`)

`vehicleId` is sourced from `useParams()` — the form has no vehicle selector.

Form fields (in order):

| Field            | Input type         | Required |
|------------------|--------------------|----------|
| Service type     | Select (enum)      | Yes      |
| Description      | Text               | Yes      |
| Date of service  | `datetime-local`   | Yes      |
| Cost             | Number (currency)  | No       |
| Mileage          | Number (integer)   | No       |
| Service provider | Text               | No       |
| Next due date    | `date`             | No       |
| Next due mileage | Number (integer)   | No       |
| Notes            | Textarea           | No       |

- Date of service defaults to current datetime
- `FormFooter` with Save / Cancel buttons (same pattern as `SessionDetails`)
- Cancel navigates back to `/vehicles/:vehicleId/maintenance`

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
| Access route | Under `/vehicles/:vehicleId/maintenance` (not tab bar) | Natural ownership — maintenance belongs to a vehicle; keeps tab bar focused |
| Entry points | Wrench icon on `VehicleItem` (primary) + dashboard stat card (secondary) | Vehicle list is the natural place to discover per-vehicle actions; dashboard provides a quick summary shortcut |
| Data relationship | One record → one vehicle | Mirrors sessions; maintenance is always vehicle-specific |
| Cost storage | Integer cents | Consistent with `ChargingSession.costCents`; avoids float precision issues |
| Dashboard entry point | New stat card with action prop | Extends existing `DashboardStatCard` cleanly; no new layout components |
| Grouping in list | By month | Maintenance is sparse (monthly/quarterly); date-grouping would be too granular |
| `nextDue` fields | Stored, no active reminders | Captures the data now; reminder system is a separate future feature |
| Mileage unit | Miles (integer) | Matches US-centric defaults; unit label can be made configurable later |
