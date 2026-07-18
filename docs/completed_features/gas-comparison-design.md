# Gas Price Comparison & MPGe Feature

## Context

The app tracks EV charging sessions with energy (kWh), rate ($/kWh), and cost. Vehicles optionally store `batteryCapacity` (kWh) and `range` (miles), but these are never used in calculations today. Users want to see how their EV charging costs compare to gas, including MPGe and cost-per-mile comparisons.

## Key Formulas

- **mi/kWh** = `vehicle.range / vehicle.batteryCapacity` (or fallback from settings)
- **MPGe** = `mi/kWh * 33.7` (EPA: 33.7 kWh = 1 gallon of gas)
- **Est. miles driven** = `totalKwh * miPerKwh`
- **Equiv. gas cost** = `(miles / comparisonMpg) * gasPriceCents` (what gas would cost for same miles)
- **Savings** = `gasCostCents - totalChargingCostCents`

## Implementation Plan

### 1. Constants & Types

**`src/constants.ts`** - Add:
- `KWH_PER_GALLON = 33.7`
- `DEFAULT_GAS_PRICE_CENTS = 350` ($3.50/gal)
- `DEFAULT_COMPARISON_MPG = 40`
- `DEFAULT_MI_PER_KWH = 2.7`

**`src/pages/dashboard/dashboard-types.ts`** - Add `GasComparisonStats` type:
- `miPerKwh`, `mpge`, `gasCostCents` (equivalent gas cost for same miles), `savingsCents`

### 2. Schema Changes

**`src/data/schemas.ts`** - Add 3 optional fields to `SettingsSchema`:
- `gasPriceCents: z.number().int().optional()` - avg gas price (cents/gal)
- `comparisonMpg: z.number().optional()` - gas car MPG to compare against
- `defaultMiPerKwh: z.number().optional()` - fallback when vehicle has no specs

No Dexie version bump needed - these are optional fields on an existing singleton record, not indexed columns. No changes to `DEFAULT_SETTINGS` or `repositories.ts` - fields remain undefined until user configures them.

### 3. Calculation Helpers

**New: `src/helpers/gasComparisonHelpers.ts`** - Pure functions:
- `getMiPerKwh(vehicle, defaultMiPerKwh)` - vehicle-derived or fallback
- `calcMpge(miPerKwh)` - miPerKwh * 33.7
- `calcGasCostCents(totalKwh, miPerKwh, gasPriceCents, comparisonMpg)` - what gas would cost for equivalent miles
- `computeGasComparison(totalKwh, totalCostCents, vehicle, settings)` - orchestrator returning `GasComparisonStats`

### 4. Format Utilities

**`src/utilities/formatUtils.ts`** - Add:
- `formatMpge(mpge)` - e.g. "118 MPGe"

### 5. Dashboard Data Flow

**`src/pages/dashboard/useDashboardData.ts`**:
- Load settings alongside existing data in `Promise.all`
- After `computeStats`, call `computeGasComparison` if settings are configured
- Return `gasComparison: GasComparisonStats | null`

When filter is "All Vehicles", use `defaultMiPerKwh` from settings. When a specific vehicle is selected, derive mi/kWh from its specs if available.

### 6. Dashboard UI

**`src/pages/dashboard/ChargeStats.tsx`**:
- Accept optional `gasComparison` prop
- Below existing 2x2 grid, render gas comparison section:
  - **When configured**: Stat cards for MPGe, Gas Cost (equiv.), Savings (green/red)
  - **When not configured**: Use `DashboardStatCard` with `--` values and an action link to `/settings#gas-comparison` (e.g. "Set up" link)

**`src/pages/dashboard/DashboardStatCard.tsx`**:
- Add optional `action` prop: `{ label: string; to: string }`
- When provided, render a small link below the value that navigates to `to`

**`src/pages/dashboard/Dashboard.tsx`** - Pass `gasComparison` to `ChargeStats`

### 7. Settings UI

**New: `src/pages/settings/GasComparisonSectionBody.tsx`**:
- Follows same pattern as `SessionSectionBody`: load settings via `useSettings().getSettings()`, update via `updateSettings()`, toast on save
- Number inputs for: Gas Price ($/gal, displayed as dollars, stored as cents), Comparison MPG, Default mi/kWh
- Each input saves on change (or via a Save button) using `updateSettings({ gasPriceCents, comparisonMpg, defaultMiPerKwh })`
- Helper text explaining mi/kWh is only used when vehicle specs are missing

**`src/pages/settings/Settings.tsx`** - Add "Gas Comparison" section between Session and Storage

### 8. Tests

**New: `src/helpers/__tests__/gasComparisonHelpers.test.ts`**:
- `getMiPerKwh` - vehicle-derived vs fallback
- `calcMpge` - known values
- Edge cases: zero kWh, zero MPG
- `computeGasComparison` end-to-end
- Savings positive when EV cheaper, negative otherwise

## Critical Files

- `src/data/schemas.ts` - settings schema extension
- `src/helpers/gasComparisonHelpers.ts` - new calculation helpers
- `src/pages/dashboard/useDashboardData.ts` - data flow wiring
- `src/pages/dashboard/ChargeStats.tsx` - comparison UI
- `src/pages/dashboard/dashboard-types.ts` - new types
- `src/pages/settings/GasComparisonSectionBody.tsx` - new settings section
- `src/pages/settings/Settings.tsx` - add section
- `src/utilities/formatUtils.ts` - new formatters
- `src/constants.ts` - new constants

## Verification

1. `npm run build` - no type/build errors
2. Add a vehicle with battery capacity and range, verify mi/kWh is derived
3. Configure gas comparison in Settings (gas price, MPG)
4. Dashboard should show MPGe, Gas Cost, and Savings
5. Filter to "All Vehicles" - should use default mi/kWh from settings
6. With no gas comparison configured - placeholder callout with link to settings appears
7. Run tests: `npm test -- gasComparisonHelpers`
