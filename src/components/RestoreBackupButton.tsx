import { useRef, useState } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { useBackup } from '../hooks/useBackup';
import { Button } from './Button';
import { FileSelect } from './FileSelect';

type RestoreBackupButtonProps = {
  onSuccess: () => void | Promise<void>;
  label?: string;
  disabled?: boolean;
};

export function RestoreBackupButton(props: RestoreBackupButtonProps) {
  const { db } = useDatabase();
  const { readBackupFile, restoreBackup } = useBackup();
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileSelectRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setError(null);
    fileSelectRef.current?.click();
  };

  const handleFileSelected = async (file: File) => {
    const readResult = await readBackupFile(file);
    if (!readResult.success) {
      setError(readResult.error);
      return;
    }

    const backup = readResult.data;

    if (backup.version !== db.verno) {
      const msg =
        `Backup version (${backup.version}) does not match ` +
        `the app's database version (${db.verno}). Restore is not possible.`;
      setError(msg);
      return;
    }

    const confirmed = window.confirm(
      'This will permanently overwrite all existing data with the contents of the backup ' +
      'file. This cannot be undone. Continue?'
    );
    if (!confirmed) {
      return;
    }

    setIsRestoring(true);

    const restoreResult = await restoreBackup(backup);

    if (!restoreResult.success) {
      setIsRestoring(false);
      setError(`Restore failed: ${restoreResult.error}`);
      return;
    }

    await props.onSuccess();
  };

  return (
    <>
      <FileSelect ref={fileSelectRef} accept=".json" onChange={handleFileSelected} />
      <Button
        variant="secondary"
        onClick={handleClick}
        disabled={isRestoring || props.disabled}
      >
        {isRestoring ? 'Restoring…' : (props.label ?? 'Restore from backup')}
      </Button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </>
  );
}
