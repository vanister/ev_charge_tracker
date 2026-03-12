import type { SessionStats } from './dashboard-types';
import { SectionHeader } from '../../components/SectionHeader';

type KwhByLocationProps = {
  stats: SessionStats;
};

export function KwhByLocation({ stats }: KwhByLocationProps) {
  if (stats.totalKwh === 0 || stats.byLocation.length === 0) return null;

  const sorted = [...stats.byLocation].sort((a, b) => b.totalKwh - a.totalKwh);

  return (
    <div className="mb-8">
      <SectionHeader title="kWh by Location" />
      <div className="bg-surface border-default rounded-xl border px-4 py-4 space-y-3">
        {sorted.map((loc) => {
          const pct = Math.round((loc.totalKwh / stats.totalKwh) * 100);
          return (
            <div key={loc.locationId}>
              <div className="flex justify-between mb-1">
                <span className="text-sm">{loc.name}</span>
                <span className="text-body-secondary text-xs">{pct}%</span>
              </div>
              <div className="relative h-1.5 w-full rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-current opacity-10 rounded-full" />
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: loc.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
