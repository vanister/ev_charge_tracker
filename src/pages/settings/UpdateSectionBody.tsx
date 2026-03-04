import { Icon } from '../../components/Icon';

type UpdateSectionBodyProps = {
  onApply: () => void;
};

export function UpdateSectionBody({ onApply }: UpdateSectionBodyProps) {
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
        onClick={onApply}
        className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg
          hover:bg-primary-hover transition-colors shrink-0"
      >
        Reload
      </button>
    </div>
  );
}
