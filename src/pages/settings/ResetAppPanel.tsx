import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { useResetApp } from '../../hooks/useResetApp';
import { useImmerState } from '../../hooks/useImmerState';

type ResetState = {
  showConfirm: boolean;
  confirmText: string;
  isResetting: boolean;
};

const INITIAL_STATE: ResetState = {
  showConfirm: false,
  confirmText: '',
  isResetting: false
};

export function ResetAppPanel() {
  const { resetApp } = useResetApp();
  const [state, setState] = useImmerState<ResetState>(INITIAL_STATE);

  const handleReset = async () => {
    setState((draft) => {
      draft.isResetting = true;
    });

    const result = await resetApp();

    if (!result.success) {
      setState((draft) => {
        draft.isResetting = false;
      });
      alert(`Reset failed: ${result.error}`);
      return;
    }

    location.replace('/onboarding');
  };

  const handleCancel = () => {
    setState(INITIAL_STATE);
  };

  if (!state.showConfirm) {
    return (
      <button
        type="button"
        className="text-sm font-medium text-red-600 dark:text-red-400"
        onClick={() =>
          setState((draft) => {
            draft.showConfirm = true;
          })
        }
      >
        Reset App
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
      <div className="flex items-center gap-2">
        <Icon name="alert-triangle" size="sm" className="shrink-0 text-red-600 dark:text-red-400" />
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">Factory Reset</p>
      </div>

      <p className="text-body text-sm">
        All data will be erased &mdash; vehicles, sessions, maintenance records, locations, and preferences. The app
        will restart at the setup screen.
      </p>

      <p className="text-sm font-medium text-red-600 dark:text-red-400">
        Back up your data first from Backup &amp; Restore to avoid permanent loss.
      </p>

      <div>
        <label htmlFor="reset-confirm" className="text-body mb-1 block text-sm font-medium">
          Type <span className="font-semibold">&quot;yes&quot;</span> to erase all data
        </label>
        <input
          id="reset-confirm"
          type="text"
          autoComplete="off"
          value={state.confirmText}
          onChange={(e) =>
            setState((draft) => {
              draft.confirmText = e.target.value;
            })
          }
          className="bg-surface border-default w-full rounded-lg border px-3 py-2 text-body focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={state.isResetting}
        />
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" fullWidth onClick={handleCancel} disabled={state.isResetting}>
          Cancel
        </Button>
        <button
          type="button"
          disabled={state.confirmText.trim().toLowerCase() !== 'yes' || state.isResetting}
          onClick={handleReset}
          className="w-full rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.isResetting ? 'Resetting…' : 'Confirm Reset'}
        </button>
      </div>
    </div>
  );
}
