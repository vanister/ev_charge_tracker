import { useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartBarData, LocationChartConfig } from '../chart-types';
import { ChartTooltip } from '../ChartTooltip';
import { LocationLegend } from './LocationLegend';

type ChargeSessionChartProps = {
  bars: ChartBarData[];
  xAxisInterval: number;
  activeLocations: LocationChartConfig[];
};

export function ChargeSessionChart({ bars, xAxisInterval, activeLocations }: ChargeSessionChartProps) {
  const yAxisFormatter = useCallback((v: number) => {
    if (v === 0) {
      return '';
    }
    if (v >= 1000) {
      return `${+(v / 1000).toFixed(1)}k`;
    }
    return `${Math.round(v)}`;
  }, []);

  return (
    <div className="charge-session-chart bg-surface border-default rounded-xl border px-2 pt-4 pb-3">
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
  );
}
