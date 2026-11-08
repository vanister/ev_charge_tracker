# Maintenance Tab + Vehicles in Settings

Promote maintenance to its own bottom tab with a cross-vehicle list, and move vehicle management into a Settings section. The tab bar stays at four tabs. No database or data-hook changes.

## Navigation

- Tabs: Dashboard, Sessions, Service (`wrench` icon, `/maintenance`), Settings
- Vehicles tab removed

## Routes

```
/maintenance                  -> MaintenanceList      (optional ?vehicleId= pre-filter)
/maintenance/add              -> MaintenanceDetails   (create; optional ?vehicleId= pre-select)
/maintenance/:id/edit         -> MaintenanceDetails   (edit; vehicle from record)
/settings/vehicles/add        -> VehicleDetails       (create)
/settings/vehicles/:id/edit   -> VehicleDetails       (edit)

removed: /vehicles, /vehicles/add, /vehicles/:id/edit, /vehicles/:vehicleId/maintenance/* (no redirects)
```

## Folder moves

- `src/pages/vehicles/maintenance/*` -> `src/pages/maintenance/*`
- `src/pages/vehicles/*` -> `src/pages/settings/vehicles/*`
- `VehiclesList` folds into a `VehiclesSectionBody` settings section

## Settings: Vehicles section

```
Settings
  Theme, Date & Time
  Vehicles (id="vehicles")       <- new, above Locations
    "Add vehicle" button -> /settings/vehicles/add
    for vehicle: VehicleItem (maintenance shortcut, edit, delete)
    empty state when no vehicles
  Locations, ...
```

- `VehicleItem` links: wrench -> `/maintenance?vehicleId=<id>`, edit -> `/settings/vehicles/<id>/edit`
- `VehicleDetails` save/cancel -> `/settings#vehicles` (scrolled via existing `useScrollToHash`)

## Maintenance list

```
load all records (no vehicleId) + active vehicles
selectedVehicleId = query param ?? preferences.maintenanceFilterVehicleId ?? undefined (all)
on filter change: update state + persist to preferences
visibleRecords = selectedVehicleId ? filter by vehicle : all
group by date (existing helper)
showVehicleFilter = vehicles.length > 1
each item: show vehicle name when viewing all vehicles
add/edit -> /maintenance/add | /maintenance/:id/edit, carrying ?vehicleId= when filtered
```

- New preference field: `maintenanceFilterVehicleId?: string`

## Maintenance form / details

```
formData gains vehicleId (required select at top of form, like SessionForm)
create default vehicleId: query param ?? (only vehicle if exactly one) ?? ''
edit: vehicleId from loaded record
buildRecord(formData) reads vehicleId from formData (no separate arg)
save/cancel -> /maintenance (keep ?vehicleId= when present)
remove standalone vehicle-name header line
```

## Other link updates

- Dashboard Maintenance section "View all" -> `/maintenance`
- Sessions empty state "Add vehicle" -> `/settings/vehicles/add`
- `MaintenanceSummary` import path updated for `getMaintenanceTypeLabel`

## Docs + tests

- Update `ARCHITECTURE.md`: routes, folder tree, tab bar, Settings sections, preference field
- Unit test for `buildRecord` (vehicleId sourced from form data)
