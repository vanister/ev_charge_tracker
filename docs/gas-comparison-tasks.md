# Gas Comparison & MPGe — Implementation Tasks (v1.6.0)

The design doc is located here: [gas-comparison-design.md](./gas-comparison-design.md)

## Phase 1: Data & Constants

- [x] 1. Add constants to `src/constants.ts`
  - `KWH_PER_GALLON = 33.7` (EPA standard)
  - `DEFAULT_GAS_PRICE_CENTS = 350` ($3.50/gal)
  - `DEFAULT_COMPARISON_MPG = 40`
  - `DEFAULT_MI_PER_KWH = 2.7`
- [x] 2. Add optional fields to `SettingsSchema` in `src/data/schemas.ts`
  - `gasPriceCents: z.number().int().optional()` — avg gas price in cents/gal
  - `comparisonMpg: z.number().optional()` — gas car MPG to compare against
  - `defaultMiPerKwh: z.number().optional()` — fallback when vehicle has no battery capacity + range
- [x] 3. Add `GasComparisonStats` type to `src/pages/dashboard/dashboard-types.ts`
  - `miPerKwh`, `mpge`, `gasCostCents`, `savingsCents`

## Phase 2: Calculation Helpers & Formatters

- [ ] 4. Create `src/helpers/gasComparisonHelpers.ts`
  - `getMiPerKwh(vehicle, defaultMiPerKwh)` — use vehicle `range / batteryCapacity` if both exist, otherwise fallback
  - `calcMpge(miPerKwh)` — `miPerKwh * KWH_PER_GALLON`
  - `calcGasCostCents(totalKwh, miPerKwh, gasPriceCents, comparisonMpg)` — equivalent gas cost for same miles
  - `computeGasComparison(totalKwh, totalCostCents, vehicle, settings)` — orchestrator returning `GasComparisonStats`
- [ ] 5. Add `formatMpge(mpge)` to `src/utilities/formatUtils.ts`

## Phase 3: Settings UI

- [ ] 6. Create `src/pages/settings/GasComparisonSectionBody.tsx`
  - Number inputs for: Gas Price ($/gal, stored as cents), Comparison MPG, Default mi/kWh
  - Follows `SessionSectionBody` pattern: load via `useSettings().getSettings()`, save via `updateSettings()`, toast on save
  - Helper text explaining mi/kWh is only used when vehicle specs are missing
- [ ] 7. Add "Gas Comparison" section to `src/pages/settings/Settings.tsx`
  - Place between Session and Storage sections
  - Use `id="gas-comparison"` for deep linking from dashboard

## Phase 4: Dashboard Integration

- [ ] 8. Extend `DashboardStatCard` with optional `action` prop
  - `action?: { label: string; to: string }` — renders a small link below the value
- [ ] 9. Update `src/pages/dashboard/useDashboardData.ts`
  - Load settings alongside existing data in `Promise.all`
  - Compute gas comparison stats when settings are configured
  - Return `gasComparison: GasComparisonStats | null`
  - When "All Vehicles" filter is active, use `defaultMiPerKwh` from settings
  - When specific vehicle is selected, derive mi/kWh from its specs if available
- [ ] 10. Update `src/pages/dashboard/ChargeStats.tsx`
  - Accept optional `gasComparison` prop
  - When configured: show stat cards for MPGe, Gas Cost (equivalent), Savings (green/red)
  - When not configured: show placeholder callout using `DashboardStatCard` with `--` values and action link to `/settings#gas-comparison`

## Phase 5: Finalize

- [ ] 11. Create `src/helpers/__tests__/gasComparisonHelpers.test.ts`
  - `getMiPerKwh` — vehicle-derived vs fallback
  - `calcMpge` — known values (e.g. 2.7 mi/kWh = ~91 MPGe)
  - `calcGasCostCents` — edge cases: zero kWh, zero MPG
  - `computeGasComparison` — end-to-end with realistic inputs
  - Savings positive when EV cheaper, negative otherwise
- [ ] 12. Bump version to `1.6.0` in `package.json`
- [ ] 13. Run `npm run build` — verify no errors
- [ ] 14. Run `/review`
