import { useAppUpdateAvailable } from '../../hooks/useAppUpdateAvailable';
import { Icon } from '../../components/Icon';

export function UpdateSectionBody() {
  // dontToast=true prevents the toast from showing while the user is already on this page
  const { needsUpdate, applyUpdate } = useAppUpdateAvailable(true);

  if (!needsUpdate) {
    return (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="check-circle" size="md" className="text-primary" />
        </div>
        <p className="text-sm text-body">App is up to date</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="info" size="md" className="text-primary" />
        </div>
        <p className="text-sm text-body">A new version is available</p>
      </div>
      <button
        type="button"
        onClick={applyUpdate}
        className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg
          hover:bg-primary-hover transition-colors shrink-0"
      >
        Reload
      </button>
    </div>
  );
}
