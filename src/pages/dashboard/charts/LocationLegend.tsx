import type { LocationChartConfig } from '../chart-types';

type LocationLegendProps = {
  activeLocations: LocationChartConfig[];
};

export function LocationLegend({ activeLocations }: LocationLegendProps) {
  return (
    <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1.5 px-2">
      {activeLocations.map((loc) => (
        <div key={loc.locationId} className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: loc.color }} />
          <span className="text-body-secondary text-xs">{loc.name}</span>
        </div>
      ))}
    </div>
  );
}
