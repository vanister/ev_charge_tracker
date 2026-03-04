import { useEffect } from 'react';
import { useImmerState } from '../../hooks/useImmerState';
import { formatBytes } from '../../utilities/formatUtils';

type StorageState = {
  storageUsed: number | null;
  storageQuota: number | null;
};

const DEFAULT_STATE: StorageState = {
  storageUsed: null,
  storageQuota: null
};

export function StorageSectionBody() {
  const [state, setState] = useImmerState<StorageState>(DEFAULT_STATE);

  useEffect(() => {
    const loadStorageEstimate = async () => {
      const estimate = await navigator.storage?.estimate?.();
      setState((draft) => {
        draft.storageUsed = estimate?.usage ?? null;
        draft.storageQuota = estimate?.quota ?? null;
      });
    };

    loadStorageEstimate();
  }, [setState]);

  if (state.storageUsed == null || state.storageQuota == null) {
    return <p className="text-sm text-body-secondary">Storage information unavailable</p>;
  }

  const storagePercent =
    state.storageQuota > 0
      ? Math.min(100, (state.storageUsed / state.storageQuota) * 100)
      : null;

  return (
    <>
      <div className="flex items-center justify-between text-sm">
        <span className="text-body-secondary">Used</span>
        <span className="text-body font-medium">
          {formatBytes(state.storageUsed)} of {formatBytes(state.storageQuota)}
        </span>
      </div>
      {storagePercent != null && (
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${storagePercent}%` }}
          />
        </div>
      )}
    </>
  );
}
