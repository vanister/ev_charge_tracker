import { useRef } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { useImmerState } from '../../hooks/useImmerState';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/Button';
import { failure, success } from '../../utilities/resultUtils';
import type { Result } from '../../utilities/resultUtils';
import type { ChargingSession, Location, Settings, Vehicle } from '../../data/data-types';

type BackupFile = {
  version: number;
  vehicles: Vehicle[];
  sessions: ChargingSession[];
  locations: Location[];
  settings: Settings[];
};

type ExportRestoreState = {
  isExporting: boolean;
  isRestoring: boolean;
  pendingRestore: BackupFile | null;
  restoreError: string | null;
};

const DEFAULT_STATE: ExportRestoreState = {
  isExporting: false,
  isRestoring: false,
  pendingRestore: null,
  restoreError: null
};

function validateBackup(parsed: unknown): Result<BackupFile> {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return failure('Backup file is not a valid object.');
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.version !== 'number' || !Number.isInteger(obj.version) || obj.version < 1) {
    return failure('Backup file is missing a valid version number.');
  }

  if (!Array.isArray(obj.vehicles)) return failure('Backup file is missing a "vehicles" array.');
  if (!Array.isArray(obj.sessions)) return failure('Backup file is missing a "sessions" array.');
  if (!Array.isArray(obj.locations)) return failure('Backup file is missing a "locations" array.');
  if (!Array.isArray(obj.settings)) return failure('Backup file is missing a "settings" array.');

  for (const v of obj.vehicles as unknown[]) {
    const vehicle = v as Record<string, unknown>;
    if (
      typeof vehicle.id !== 'string' ||
      typeof vehicle.make !== 'string' ||
      typeof vehicle.model !== 'string' ||
      typeof vehicle.year !== 'number' ||
      typeof vehicle.icon !== 'string' ||
      typeof vehicle.createdAt !== 'number' ||
      (vehicle.isActive !== 0 && vehicle.isActive !== 1)
    ) {
      return failure('Backup file contains an invalid vehicle record.');
    }
  }

  for (const l of obj.locations as unknown[]) {
    const location = l as Record<string, unknown>;
    if (
      typeof location.id !== 'string' ||
      typeof location.name !== 'string' ||
      typeof location.icon !== 'string' ||
      typeof location.color !== 'string' ||
      typeof location.defaultRate !== 'number' ||
      typeof location.createdAt !== 'number' ||
      (location.isActive !== 0 && location.isActive !== 1)
    ) {
      return failure('Backup file contains an invalid location record.');
    }
  }

  for (const s of obj.sessions as unknown[]) {
    const session = s as Record<string, unknown>;
    if (
      typeof session.id !== 'string' ||
      typeof session.vehicleId !== 'string' ||
      typeof session.locationId !== 'string' ||
      typeof session.energyKwh !== 'number' ||
      typeof session.ratePerKwh !== 'number' ||
      typeof session.costCents !== 'number' ||
      typeof session.chargedAt !== 'number'
    ) {
      return failure('Backup file contains an invalid session record.');
    }
  }

  for (const s of obj.settings as unknown[]) {
    const setting = s as Record<string, unknown>;
    if (typeof setting.key !== 'string') {
      return failure('Backup file contains an invalid settings record.');
    }
  }

  return success(obj as unknown as BackupFile);
}

export function ExportRestoreSectionBody() {
  const { db } = useDatabase();
  const { showToast } = useToast();
  const [state, setState] = useImmerState<ExportRestoreState>(DEFAULT_STATE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setState((draft) => { draft.isExporting = true; });

    try {
      const [vehicles, sessions, locations, settings] = await Promise.all([
        db.vehicles.toArray(),
        db.sessions.toArray(),
        db.locations.toArray(),
        db.settings.toArray()
      ]);

      const backup: BackupFile = { version: db.verno, vehicles, sessions, locations, settings };
      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const date = new Date().toISOString().slice(0, 10);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ev-charge-tracker-backup-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);

      showToast({ message: 'Backup exported successfully.', variant: 'success' });
    } catch (err) {
      showToast({
        message: `Export failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: 'error',
        persistent: true
      });
    } finally {
      setState((draft) => { draft.isExporting = false; });
    }
  }

  function handleRestoreClick() {
    setState((draft) => { draft.restoreError = null; });
    fileInputRef.current?.click();
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be re-selected after cancelling
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed: unknown = JSON.parse(event.target?.result as string);

        const validationResult = validateBackup(parsed);
        if (!validationResult.success) {
          setState((draft) => { draft.restoreError = validationResult.error; });
          return;
        }

        const backup = validationResult.data;

        if (backup.version !== db.verno) {
          setState((draft) => {
            draft.restoreError =
              `Backup version (${backup.version}) does not match the app's database version (${db.verno}). Restore is not possible.`;
          });
          return;
        }

        setState((draft) => {
          draft.restoreError = null;
          draft.pendingRestore = backup;
        });
      } catch {
        setState((draft) => {
          draft.restoreError = 'Failed to parse the backup file. Make sure it is a valid JSON file.';
        });
      }
    };

    reader.readAsText(file);
  }

  function handleCancelRestore() {
    setState((draft) => {
      draft.pendingRestore = null;
      draft.restoreError = null;
    });
  }

  async function handleConfirmRestore() {
    if (!state.pendingRestore) return;
    const backup = state.pendingRestore;

    setState((draft) => { draft.isRestoring = true; });

    try {
      await db.transaction('rw', [db.vehicles, db.sessions, db.locations, db.settings], async () => {
        await db.vehicles.clear();
        await db.sessions.clear();
        await db.locations.clear();
        await db.settings.clear();
        await db.vehicles.bulkPut(backup.vehicles);
        await db.sessions.bulkPut(backup.sessions);
        await db.locations.bulkPut(backup.locations);
        await db.settings.bulkPut(backup.settings);
      });

      setState(() => DEFAULT_STATE);
      showToast({ message: 'Restore completed successfully.', variant: 'success', persistent: true });
    } catch (err) {
      setState((draft) => { draft.isRestoring = false; });
      showToast({
        message: `Restore failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: 'error',
        persistent: true
      });
    }
  }

  const anyBusy = state.isExporting || state.isRestoring;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-body">Export Backup</p>
          <p className="text-xs text-body-secondary">Download all your data as a JSON file</p>
        </div>
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={anyBusy}
        >
          {state.isExporting ? 'Exporting…' : 'Export'}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-body">Restore from Backup</p>
          <p className="text-xs text-body-secondary">Replace all existing data from a backup file</p>
        </div>
        <Button
          variant="secondary"
          onClick={handleRestoreClick}
          disabled={anyBusy || state.pendingRestore != null}
        >
          Restore
        </Button>
      </div>

      {state.restoreError && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.restoreError}</p>
      )}

      {state.pendingRestore && (
        <div className="rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 p-4 space-y-3">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            Danger – This cannot be undone
          </p>
          <p className="text-sm text-red-700 dark:text-red-400">
            Restoring from this backup will permanently overwrite <strong>all</strong> existing
            vehicles, sessions, locations, and settings with the contents of the backup file.
            This action cannot be undone. Make sure you have exported a recent backup first.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={handleCancelRestore}
              disabled={state.isRestoring}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmRestore}
              disabled={state.isRestoring}
            >
              {state.isRestoring ? 'Restoring…' : 'Confirm Restore'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
