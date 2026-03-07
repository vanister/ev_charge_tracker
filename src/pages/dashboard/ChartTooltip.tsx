import type { ChartTooltipProps } from './chart-types';

export function ChartTooltip({ active, payload, label, locationConfigs }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const activeEntries = payload.filter((entry) => (entry.value ?? 0) > 0);
  if (activeEntries.length === 0) return null;

  const total = activeEntries.reduce((sum, e) => sum + (e.value ?? 0), 0);
  const configByKey = new Map(locationConfigs.map((c) => [c.locationId, c]));

  return (
    <div className="bg-surface border border-default rounded-lg px-3 py-2.5 shadow-lg min-w-[140px]">
      <p className="text-xs font-semibold text-body mb-2">{label}</p>
      {activeEntries.map((entry) => {
        const config = configByKey.get(entry.dataKey as string);
        return (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-1 last:mb-0">
            <span
              className="inline-block w-2 h-2 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-xs text-body-secondary flex-1">{config?.name ?? entry.dataKey}</span>
            <span className="text-xs font-medium text-body ml-2">{(entry.value ?? 0).toFixed(1)} kWh</span>
          </div>
        );
      })}
      {activeEntries.length > 1 && (
        <div className="flex justify-between border-t border-default mt-2 pt-1.5">
          <span className="text-xs text-body-secondary">Total</span>
          <span className="text-xs font-semibold text-body">{total.toFixed(1)} kWh</span>
        </div>
      )}
    </div>
  );
}
