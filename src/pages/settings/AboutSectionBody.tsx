import { Icon } from '../../components/Icon';

export function AboutSectionBody() {
  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="zap" size="md" className="text-primary" />
        </div>
        <div>
          <p className="text-base font-semibold text-body">EV Charge Tracker</p>
          <p className="text-sm text-body-secondary">Version 1.0.0</p>
        </div>
      </div>
      <p className="text-sm text-body-secondary">
        Track your electric vehicle charging sessions, costs, and usage across all your locations.
      </p>
    </>
  );
}
