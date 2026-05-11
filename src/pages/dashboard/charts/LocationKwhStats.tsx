import type { LocationStat } from '../dashboard-types';
import { formatCost } from '../../../utilities/formatUtils';

type LocationKwhStatsProps = {
  sortedByKwh: LocationStat[];
  totalKwh: number;
};

const sessionLabel = (n: number) => `${n} ${n === 1 ? 'session' : 'sessions'}`;

export function LocationKwhStats({ sortedByKwh, totalKwh }: LocationKwhStatsProps) {
  if (totalKwh <= 0 || sortedByKwh.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface border-default mt-4 space-y-3 rounded-xl border px-4 py-4">
      {sortedByKwh.map((loc) => {
        const pct = Math.round((loc.totalKwh / totalKwh) * 100);
        return (
          <div key={loc.locationId}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-sm">{loc.name}</span>
              <span className="text-body-secondary shrink-0 text-xs">
                {sessionLabel(loc.sessionCount)} · {Math.round(loc.totalKwh)} kWh · {formatCost(loc.totalCostCents)} · {pct}%
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full">
              <div className="absolute inset-0 rounded-full bg-current opacity-10" />
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${pct}%`, backgroundColor: loc.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
