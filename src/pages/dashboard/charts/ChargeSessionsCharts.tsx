import { useMemo } from 'react';
import type { ChartData } from '../chart-types';
import type { SessionStats } from '../dashboard-types';
import { ChargeSessionChart } from './ChargeSessionChart';
import { LocationKwhStats } from './LocationKwhStats';

type ChargeSessionsChartProps = {
  data: ChartData;
  stats: SessionStats;
};

export function ChargeSessionsCharts({ data, stats }: ChargeSessionsChartProps) {
  const { bars, locationConfigs, xAxisInterval } = data;

  // Only render locations that have at least one session in the window
  const activeLocations = useMemo(
    () => locationConfigs.filter((loc) => bars.some((bar) => (bar[loc.locationId] as number) > 0)),
    [locationConfigs, bars]
  );

  const sortedByKwh = useMemo(() => [...stats.byLocation].sort((a, b) => b.totalKwh - a.totalKwh), [stats.byLocation]);

  if (activeLocations.length === 0) {
    return (
      <div className="bg-surface border-default mt-4 rounded-xl border px-2 py-10 text-center">
        <p className="text-body-secondary text-sm">No charging sessions for this period</p>
      </div>
    );
  }

  return (
    <div>
      <ChargeSessionChart bars={bars} xAxisInterval={xAxisInterval} activeLocations={activeLocations} />
      <LocationKwhStats sortedByKwh={sortedByKwh} totalKwh={stats.totalKwh} />
    </div>
  );
}
