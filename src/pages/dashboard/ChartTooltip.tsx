import type { ChartTooltipProps } from './chart-types';
import { formatCost } from '../../utilities/formatUtils';

const sessionLabel = (n: number) => `${n} ${n === 1 ? 'session' : 'sessions'}`;

export function ChartTooltip({ active, payload, label, locationConfigs }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const activeEntries = payload.filter((entry) => (entry.value ?? 0) > 0);

  if (activeEntries.length === 0) {
    return null;
  }

  const totalKwh = activeEntries.reduce((sum, e) => sum + (e.value ?? 0), 0);
  const totalCostCents = activeEntries.reduce(
    (sum, e) => sum + ((e.payload?.[`${e.dataKey}__cost`] as number) ?? 0),
    0
  );
  const totalCount = activeEntries.reduce(
    (sum, e) => sum + ((e.payload?.[`${e.dataKey}__count`] as number) ?? 0),
    0
  );
  const configByKey = new Map(locationConfigs.map((c) => [c.locationId, c]));

  return (
    <div className="bg-surface border-default min-w-[160px] rounded-lg border px-3 py-2.5 shadow-lg">
      <p className="text-body mb-2 text-xs font-semibold">{label}</p>
      {activeEntries.map((entry) => {
        const config = configByKey.get(entry.dataKey as string);
        const costCents = (entry.payload?.[`${entry.dataKey}__cost`] as number) ?? 0;
        const count = (entry.payload?.[`${entry.dataKey}__count`] as number) ?? 0;
        return (
          <div key={entry.dataKey} className="mb-1 flex items-center gap-2 last:mb-0">
            <span className="inline-block h-2 w-2 flex-shrink-0 rounded-sm" style={{ backgroundColor: entry.fill }} />
            <span className="text-body-secondary flex-1 text-xs">{config?.name ?? entry.dataKey}</span>
            <span className="text-body-secondary text-xs">{sessionLabel(count)}</span>
            <span className="text-body text-xs font-medium">{Math.round(entry.value ?? 0)} kWh</span>
            <span className="text-body-secondary text-xs">{formatCost(costCents)}</span>
          </div>
        );
      })}
      {activeEntries.length > 1 && (
        <div className="border-default mt-2 flex justify-between border-t pt-1.5">
          <span className="text-body-secondary text-xs">Total</span>
          <span className="text-body text-xs font-semibold">
            {sessionLabel(totalCount)} · {Math.round(totalKwh)} kWh · {formatCost(totalCostCents)}
          </span>
        </div>
      )}
    </div>
  );
}
