# Maintenance Tracking - Implementation Tasks

Implementation tasks for the [Maintenance & Service Tracking](./maintenance-tracking.md) feature.
Phase numbers correspond directly to sections in the design doc (e.g. Phase 2 → §2, Phase 3 → §3).

## Progress Summary

- **Phase 2 - Data Model** [§2]: 🟨 2/3 (schema + DB done; `maintenance-types.ts` missing)
- **Phase 3 - File Structure & Helpers** [§3]: ⬜ 0/2
- **Phase 4 - Routing** [§4]: ⬜ 0/1
- **Phase 5 - Dashboard Integration** [§5]: ⬜ 0/3
- **Phase 6 - UI & UX** [§6]: ⬜ 0/5

**Overall Progress**: 2/14 tasks complete

---

## TODO

### Phase 2 - Data Model [§2]

> Ref: [§2 Data Model](./maintenance-tracking.md#2-data-model) — schema, types, Dexie table.
>
> Note: `useMaintenanceRecords` hook (`src/hooks/useMaintenanceRecords.ts`) is also complete — full CRUD and backup integration.

- [x] 1. Add `MaintenanceRecordSchema` and `MAINTENANCE_TYPES` to `src/data/schemas.ts` [§2 — MaintenanceType Enum, MaintenanceRecord Schema]
  - `MAINTENANCE_TYPES` const array (10 values: `tire_rotation` … `other`) ✓
  - `MaintenanceType` derived type ✓
  - `MaintenanceRecordSchema` Zod schema with all §2 fields ✓
- [ ] 2. Add `MaintenanceFormData` and `MaintenanceRecord` types to `src/pages/vehicles/maintenance/maintenance-types.ts` [§2 — MaintenanceRecord Schema, §3 — Type Conventions]
  - `MaintenanceRecord` exists in `src/data/data-types.ts` (inferred from schema) but `MaintenanceFormData` is missing entirely
  - Create `src/pages/vehicles/maintenance/maintenance-types.ts` with both types
  - `MaintenanceFormData` — string fields for form binding, `type` allows `''`
  - Follow naming convention from §3: use `Record` suffix (not `InputData`) for the stored entity shape
- [x] 3. Add `maintenanceRecords` table to Dexie schema in `src/data/db.ts` [§2 — Dexie Table]
  - `maintenanceRecords` table present in `db.version(3)` and `db.version(4)` ✓
  - Index: `'id, vehicleId, servicedAt, [vehicleId+servicedAt]'` ✓

### Phase 3 - File Structure & Helpers [§3]

> Ref: [§3 File Structure](./maintenance-tracking.md#3-file-structure) — helpers and utilities co-located under `src/pages/vehicles/maintenance/`.

- [ ] 4. Create `src/pages/vehicles/maintenance/maintenanceFormHelpers.ts` [§3 — maintenanceFormHelpers.ts]
  - `buildRecord(formData, vehicleId): MaintenanceRecord` — converts string inputs to typed values; computes `costCents` once via `Math.round(cost * 100)` and does not recalculate [§7 — Cost immutability]
  - `getDefaultDateTime(): string` — returns current datetime as ISO string for `datetime-local` input
- [ ] 5. Create `src/helpers/maintenanceHelpers.ts` [§3 — maintenanceHelpers.ts]
  - `groupRecordsByDate(records)` — groups by year-month, newest first (used by `MaintenanceList` per §6)
  - `createTypeLabel(type: MaintenanceType): string` — human-readable label
  - `sortRecords(records)` — sorts by `servicedAt` descending

### Phase 4 - Routing [§4]

> Ref: [§4 Routing](./maintenance-tracking.md#4-routing) — nested under `/vehicles/:vehicleId`, inside `Layout`, excluded from `BottomTabBar`.

- [ ] 6. Register maintenance routes in `src/router.tsx` [§4]
  - `/vehicles/:vehicleId/maintenance` → `<MaintenanceList />`
  - `/vehicles/:vehicleId/maintenance/add` → `<MaintenanceDetails />`
  - `/vehicles/:vehicleId/maintenance/:id/edit` → `<MaintenanceDetails />`
  - Routes live inside the `Layout` wrapper; no `BottomTabBar` entry needed — Vehicles tab stays active via `startsWith` matching

### Phase 5 - Dashboard Integration [§5]

> Ref: [§5 Dashboard Integration](./maintenance-tracking.md#5-dashboard-integration) — extends `DashboardStatCard` and adds a `MaintenanceSummaryCard`.

- [ ] 7. Extend `DashboardStatCard` with optional `action` prop [§5a — Extend DashboardStatCard]
  - Add `action?: { label: string; onClick: () => void }` to props type
  - Render a `<button className="text-primary mt-2 text-xs font-medium">` below the stat value when `action` is provided
  - Must be backward-compatible — existing cards unchanged
- [ ] 8. Create `MaintenanceSummaryCard.tsx` in `src/pages/dashboard/` [§5b — Maintenance Summary on Dashboard]
  - Queries maintenance records once for the active vehicle
  - `activeVehicleId` resolved from dashboard vehicle filter, falling back to `preferences.lastVehicleId`; omit both cards entirely when no vehicles exist
  - **Card 1 — Last Service** (`icon="wrench"`): value = most recent service type label; action navigates to `/vehicles/${activeVehicleId}/maintenance`; when no records: `value="No records yet"`, action label `"Add first record →"`
  - **Card 2 — Last Serviced** (`icon="calendar"`): value = most recent `servicedAt` formatted as `MMM d, yyyy` via `date-fns`; `value="—"` when no records; no `action` prop
- [ ] 9. Add `MaintenanceSummaryCard` to the Dashboard page [§5b]
  - Position below the charging stats grid in its own 2-column grid row
  - Pass `activeVehicleId` and navigate action

### Phase 6 - UI & UX [§6]

> Ref: [§6 UI & UX](./maintenance-tracking.md#6-ui--ux) — `VehicleItem` entry point, `MaintenanceList`, `MaintenanceDetails`, `MaintenanceForm`, supporting components.

- [ ] 10. Add wrench icon link to `VehicleItem.tsx` [§6 — VehicleItem entry point]
  - `<Link to={`/vehicles/${vehicle.id}/maintenance`}>` with `<Icon name="wrench" size="sm" />`
  - Action order: **wrench → edit → delete**
  - `aria-label="View maintenance records"`
- [ ] 11. Create `MaintenanceList.tsx` — `/vehicles/:vehicleId/maintenance` [§6 — MaintenanceList]
  - `usePageConfig('Maintenance', false)` — tab bar visible
  - Vehicle name sub-heading sourced from `:vehicleId` param; inactive vehicles shown with `(removed)` label [§7 — Soft-deleted vehicles]
  - Records grouped by month via `groupRecordsByDate` from `maintenanceHelpers.ts`, rendered as `MaintenanceItem`
  - FAB / header button navigates to `.../add`
  - Renders `MaintenanceEmptyState` when no records
- [ ] 12. Create `MaintenanceDetails.tsx` — add and edit page [§6 — MaintenanceDetails]
  - `usePageConfig('Add Service Record', true)` or `usePageConfig('Edit Service Record', true)` — tab bar hidden (matches `SessionDetails` / `VehicleDetails` pattern)
  - `vehicleId` from `useParams()` — no vehicle selector in form
  - Wraps `MaintenanceForm`; on save persists to Dexie via `buildRecord`; on cancel navigates back to list
- [ ] 13. Create `MaintenanceForm.tsx` — reusable form component [§6 — MaintenanceDetails form fields table]
  - Fields in order: service type (select from `MAINTENANCE_TYPES`), description, date of service (`datetime-local`, defaults to now), cost (number/currency, optional), mileage (integer, optional), service provider (text, optional), next due date (`date`, optional), next due mileage (integer, optional), notes (textarea, optional)
  - `FormFooter` with Save / Cancel buttons (same pattern as `SessionDetails`)
  - Required fields: service type, description, date of service
- [ ] 14. Create supporting components [§6]
  - `MaintenanceItem.tsx` — type label + icon, description, date, optional cost + mileage
  - `MaintenanceItemActions.tsx` — Edit / Delete inline actions
  - `MaintenanceEmptyState.tsx` — empty state with prompt to log first record
