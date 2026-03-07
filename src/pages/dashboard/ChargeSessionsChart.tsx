import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData, LocationChartConfig } from '../../helpers/chartHelpers';
import { SectionHeader } from '../../components/SectionHeader';

type ChargeSessionsChartProps = {
  data: ChartData;
};

// Show a label every 5th day so the x-axis stays readable with 31 bars
const X_AXIS_INTERVAL = 4;

export function ChargeSessionsChart({ data }: ChargeSessionsChartProps) {
  const { days, locationConfigs } = data;

  // Only render locations that have at least one session in the window
  const activeLocations = locationConfigs.filter((loc) =>
    days.some((day) => (day[loc.locationId] as number) > 0)
  );

  if (activeLocations.length === 0) return null;

  return (
    <div className="mb-8">
      <SectionHeader title="Last 31 Days" />

      <div className="bg-surface rounded-xl border border-default px-2 pt-4 pb-3">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={days} barCategoryGap="35%" margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.08} />

            <XAxis
              dataKey="label"
              interval={X_AXIS_INTERVAL}
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

type TooltipEntry = {
  value?: number;
  dataKey?: string;
  fill?: string;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  locationConfigs: LocationChartConfig[];
};

function ChartTooltip({ active, payload, label, locationConfigs }: ChartTooltipProps) {
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
