import { useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData } from '../chart-types';
import type { SessionStats } from '../dashboard-types';
import { ChartTooltip } from '../ChartTooltip';
import { LocationLegend } from './LocationLegend';
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

  const yAxisFormatter = useCallback((v: number) => {
    if (v === 0) {
      return '';
    }
    if (v >= 1000) {
      return `${+(v / 1000).toFixed(1)}k`;
    }
    return `${Math.round(v)}`;
  }, []);

  if (activeLocations.length === 0) {
    return (
      <div className="bg-surface border-default mt-4 rounded-xl border px-2 py-10 text-center">
        <p className="text-body-secondary text-sm">No charging sessions for this period</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-surface border-default rounded-xl border px-2 pt-4 pb-3">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={bars}
            accessibilityLayer={false}
            barCategoryGap="35%"
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.08} />

            <XAxis
              dataKey="label"
              interval={xAxisInterval}
              tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={yAxisFormatter}
              width={44}
            />

            <Tooltip
              content={<ChartTooltip locationConfigs={activeLocations} />}
              cursor={{ fill: 'currentColor', opacity: 0.05 }}
              isAnimationActive={false}
              trigger="click"
            />

            {activeLocations.map((loc) => (
              <Bar
                focusable={false}
                key={loc.locationId}
                dataKey={loc.locationId}
                stackId="stack"
                fill={loc.color}
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        <LocationLegend activeLocations={activeLocations} />
      </div>

      <LocationKwhStats sortedByKwh={sortedByKwh} totalKwh={stats.totalKwh} />
    </div>
  );
}
