# Maintenance Tab + Vehicles in Settings - Implementation Tasks

Design doc: [maintenance-tab-design.md](./maintenance-tab-design.md)

## Phase 1: Move vehicles into Settings

- [ ] 1. Move `src/pages/vehicles/*` (excluding `maintenance/`) to `src/pages/settings/vehicles/*` and fix imports.
- [ ] 2. Create `VehiclesSectionBody` in `src/pages/settings/vehicles/` from `VehiclesList` logic: vehicle list, "Add vehicle" button, empty state, delete handling. Delete `VehiclesList`.
- [ ] 3. Add a `Vehicles` section (`id="vehicles"`) to `Settings.tsx` directly above Locations.
- [ ] 4. Update `VehicleItem` links: edit -> `/settings/vehicles/<id>/edit`, wrench -> `/maintenance?vehicleId=<id>`.
- [ ] 5. Update `VehicleDetails` save/cancel navigation to `/settings#vehicles`.
- [ ] 6. Update the router: add `/settings/vehicles/add` and `/settings/vehicles/:id/edit`; remove `/vehicles`, `/vehicles/add`, `/vehicles/:id/edit`.
- [ ] 7. Update `SessionFormEmptyStates` "Add vehicle" action to `/settings/vehicles/add`.

## Phase 2: Maintenance as a top-level feature

- [ ] 8. Move `src/pages/vehicles/maintenance/*` to `src/pages/maintenance/*` and fix imports (including `MaintenanceSummary`).
- [ ] 9. Update the router: add `/maintenance`, `/maintenance/add`, `/maintenance/:id/edit`; remove `/vehicles/:vehicleId/maintenance/*`.
- [ ] 10. Replace the Vehicles tab in `BottomTabBar` with `{ path: '/maintenance', label: 'Service', icon: 'wrench' }`.

## Phase 3: Maintenance form with vehicle select

- [ ] 11. Add `vehicleId` to `MaintenanceFormData`; change `buildRecord` to read `vehicleId` from form data.
- [ ] 12. Add a required vehicle select at the top of `MaintenanceForm` (pass `vehicles` prop, same pattern as `SessionForm`).
- [ ] 13. Update `MaintenanceDetails`: load active vehicles; default `vehicleId` from `?vehicleId=`, else the only vehicle, else empty; in edit mode use the record's vehicle; remove the vehicle-name header line; save/cancel -> `/maintenance` keeping `?vehicleId=` when present.

## Phase 4: Maintenance list with vehicle filter

- [ ] 14. Add `maintenanceFilterVehicleId?: string` to `UserPreferences`.
- [ ] 15. Update `MaintenanceList`: load all records and active vehicles; initial filter from `?vehicleId=` then preference; persist filter changes; filter records by selected vehicle; show filter only when more than one vehicle; page title "Maintenance".
- [ ] 16. Show the vehicle name on each `MaintenanceItem` when viewing all vehicles (pass a vehicle name map or name prop).
- [ ] 17. Update add/edit navigation to the new routes, carrying `?vehicleId=` when filtered.

## Phase 5: Dashboard links

- [ ] 18. Point the Dashboard Maintenance "View all" link to `/maintenance`.
- [ ] 19. Make the `MaintenanceSummary` stat cards link to `/maintenance`.

## Phase 6: Tests, docs, verification

- [ ] 20. Add a unit test for `buildRecord` covering `vehicleId` sourced from form data.
- [ ] 21. Update `architecture.md`: routes, folder tree, tab bar, Settings sections, new preference field.
- [ ] 22. Verify:
  - [ ] `npm run build` passes
  - [ ] `npm run test` passes
  - [ ] Run `evs-review` on the diff
  - [ ] Manual check: Service tab active highlight, filter persistence, `?vehicleId=` deep link from Settings, create/edit with vehicle select, Settings vehicle add/edit/delete returns to `#vehicles`
