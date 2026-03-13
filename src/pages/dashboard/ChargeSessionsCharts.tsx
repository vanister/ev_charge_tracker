import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData } from './chart-types';
import type { SessionStats } from './dashboard-types';
import { ChartTooltip } from './ChartTooltip';
import { CHART_X_AXIS_INTERVAL } from '../../constants';

type ChargeSessionsChartProps = {
  data: ChartData;
  stats: SessionStats;
};

export function ChargeSessionsCharts({ data, stats }: ChargeSessionsChartProps) {
  const { days, locationConfigs } = data;

  // Only render locations that have at least one session in the window
  const activeLocations = locationConfigs.filter((loc) => days.some((day) => (day[loc.locationId] as number) > 0));

  const sortedByKwh = useMemo(() => [...stats.byLocation].sort((a, b) => b.totalKwh - a.totalKwh), [stats.byLocation]);

  if (activeLocations.length === 0) {
    return (
      <div className="mt-4 bg-surface border-default rounded-xl border px-2 py-10 text-center">
        <p className="text-body-secondary text-sm">No charging sessions in the last 31 days</p>
      </div>
    );
  }

  return (
    <div className="mt-4">

      <div className="bg-surface border-default rounded-xl border px-2 pt-4 pb-3">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={days} barCategoryGap="35%" margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.08} />

            <XAxis
              dataKey="label"
              interval={CHART_X_AXIS_INTERVAL}
              tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => (v === 0 ? '' : `${v}`)}
              width={36}
            />

            <Tooltip
              content={<ChartTooltip locationConfigs={activeLocations} />}
              cursor={{ fill: 'currentColor', opacity: 0.05 }}
            />

            {activeLocations.map((loc) => (
              <Bar
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

        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1.5 px-2">
          {activeLocations.map((loc) => (
            <div key={loc.locationId} className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: loc.color }} />
              <span className="text-body-secondary text-xs">{loc.name}</span>
            </div>
          ))}
        </div>
      </div>

      {stats.totalKwh > 0 && sortedByKwh.length > 0 && (
        <div className="bg-surface border-default mt-3 space-y-3 rounded-xl border px-4 py-4">
          {sortedByKwh.map((loc) => {
            const pct = Math.round((loc.totalKwh / stats.totalKwh) * 100);
            return (
              <div key={loc.locationId}>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm">{loc.name}</span>
                  <span className="text-body-secondary text-xs">{pct}%</span>
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
      )}
    </div>
  );
}
