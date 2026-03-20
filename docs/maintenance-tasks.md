# Maintenance Tracking - Implementation Tasks

Implementation tasks for the [Maintenance & Service Tracking](./maintenance-tracking.md) feature.

## Progress Summary

- **Phase 1 - Data Model**: ⬜ 0/3
- **Phase 2 - Routing**: ⬜ 0/1
- **Phase 3 - Core Components**: ⬜ 0/6
- **Phase 4 - Dashboard Integration**: ⬜ 0/3
- **Phase 5 - Vehicle Entry Point**: ⬜ 0/1

**Overall Progress**: 0/14 tasks complete

---

## TODO

### Phase 1 - Data Model

- [ ] 1. Add `MaintenanceRecordSchema` and `MAINTENANCE_TYPES` to `src/data/schemas.ts`
  - Add the `MAINTENANCE_TYPES` const array
  - Add `MaintenanceType` derived type
  - Add `MaintenanceRecordSchema` Zod schema matching the spec
- [ ] 2. Add `MaintenanceFormData` and `MaintenanceRecord` types to `src/pages/vehicles/maintenance/maintenance-types.ts`
  - `MaintenanceFormData` — string fields for form binding, `type` allows `''`
  - `MaintenanceRecord` — validated shape ready for Dexie persistence
- [ ] 3. Add `maintenanceRecords` table to Dexie schema in `src/data/db.ts`
  - Index: `'++id, vehicleId, servicedAt, [vehicleId+servicedAt]'`
  - Bump the database version

### Phase 2 - Routing

- [ ] 4. Register maintenance routes in `src/router.tsx`
  - `/vehicles/:vehicleId/maintenance` → `<MaintenanceList />`
  - `/vehicles/:vehicleId/maintenance/add` → `<MaintenanceDetails />`
  - `/vehicles/:vehicleId/maintenance/:id/edit` → `<MaintenanceDetails />`

### Phase 3 - Core Components

- [ ] 5. Create `src/pages/vehicles/maintenance/maintenanceFormHelpers.ts`
  - `buildRecord(formData, vehicleId): MaintenanceRecord` — converts string inputs to typed values
  - `getDefaultDateTime(): string` — returns current datetime as ISO string for `datetime-local` input
- [ ] 6. Create `src/helpers/maintenanceHelpers.ts`
  - `groupRecordsByDate(records)` — groups by year-month, newest first
  - `createTypeLabel(type: MaintenanceType): string` — human-readable label
  - `sortRecords(records)` — sorts by `servicedAt` descending
- [ ] 7. Create `MaintenanceForm.tsx` — reusable form component
  - Fields in order: service type (select), description, date of service, cost, mileage, service provider, next due date, next due mileage, notes
  - `FormFooter` with Save / Cancel buttons (same pattern as `SessionDetails`)
- [ ] 8. Create `MaintenanceList.tsx` — `/vehicles/:vehicleId/maintenance`
  - `usePageConfig('Maintenance', false)` — tab bar visible
  - Vehicle name sub-heading sourced from `:vehicleId` param
  - Records grouped by month via `groupRecordsByDate`, rendered as `MaintenanceItem`
  - FAB / header button navigates to `.../add`
  - Renders `MaintenanceEmptyState` when no records
- [ ] 9. Create `MaintenanceDetails.tsx` — add and edit page
  - `usePageConfig('Add Service Record', true)` or `usePageConfig('Edit Service Record', true)` — tab bar hidden
  - `vehicleId` from `useParams()` — no vehicle selector in form
  - Wraps `MaintenanceForm`; on save persists to Dexie; on cancel navigates back to list
- [ ] 10. Create supporting components
  - `MaintenanceItem.tsx` — type label + icon, description, date, optional cost + mileage
  - `MaintenanceItemActions.tsx` — Edit / Delete inline actions
  - `MaintenanceEmptyState.tsx` — empty state with prompt to log first record

### Phase 4 - Dashboard Integration

- [ ] 11. Extend `DashboardStatCard` with optional `action` prop
  - Add `action?: { label: string; onClick: () => void }` to props type
  - Render a small text button below the stat value when `action` is provided
  - Must be backward-compatible — existing cards unchanged
- [ ] 12. Create `MaintenanceSummaryCard.tsx` in `src/pages/dashboard/`
  - Uses `DashboardStatCard` with `icon="wrench"`
  - Shows count of records and most recent service type + date for the active vehicle
  - `activeVehicleId` resolved from dashboard vehicle filter, falling back to `preferences.lastVehicleId`
  - Omit card entirely when no vehicles exist
  - `value="No records yet"` and action label `"Add first record →"` when no records for active vehicle
- [ ] 13. Add `MaintenanceSummaryCard` to the Dashboard page
  - Position below the charging stats grid
  - Pass `activeVehicleId` and navigate action

### Phase 5 - Vehicle Entry Point

- [ ] 14. Add wrench icon link to `VehicleItem.tsx`
  - `<Link to={'/vehicles/${vehicle.id}/maintenance'}>` with `<Icon name="wrench" size="sm" />`
  - Action order: wrench → edit → delete
  - `aria-label="View maintenance records"`
