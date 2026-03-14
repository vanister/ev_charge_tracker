import { Icon } from '../../components/Icon';

export function AboutSectionBody() {
  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <div className="bg-primary/10 rounded-lg p-2">
          <Icon name="zap" size="md" className="text-primary" />
        </div>
        <div>
          <p className="text-body text-base font-semibold">EV Charge Tracker</p>
          <p className="text-body-secondary text-sm">Version 1.0.0</p>
        </div>
      </div>
      <p className="text-body-secondary text-sm">
        Track your electric vehicle charging sessions, costs, and usage across all your locations.
      </p>
    </>
  );
}
