import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData } from './chart-types';
import { ChartTooltip } from './ChartTooltip';
import { SectionHeader } from '../../components/SectionHeader';
import { CHART_X_AXIS_INTERVAL } from '../../constants';

type ChargeSessionsChartProps = {
  data: ChartData;
};

export function ChargeSessionsChart({ data }: ChargeSessionsChartProps) {
  const { days, locationConfigs } = data;

  // Only render locations that have at least one session in the window
  const activeLocations = locationConfigs.filter((loc) =>
    days.some((day) => (day[loc.locationId] as number) > 0)
  );

  if (activeLocations.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <SectionHeader title="Last 31 Days" />

      <div className="bg-surface rounded-xl border border-default px-2 pt-4 pb-3">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={days} barCategoryGap="35%" margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
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

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 px-2 justify-center">
          {activeLocations.map((loc) => (
            <div key={loc.locationId} className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: loc.color }}
              />
              <span className="text-xs text-body-secondary">{loc.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
