import { useRef, useState } from 'react';
import { useBackup } from '../hooks/useBackup';
import { Button } from './Button';
import { FileSelect } from './FileSelect';

type RestoreBackupButtonProps = {
  onSuccess: () => void | Promise<void>;
  onError?: (error: string | null) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  skipConfirm?: boolean;
};

export function RestoreBackupButton(props: RestoreBackupButtonProps) {
  const { readBackupFile, restoreBackup } = useBackup();
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileSelectRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setError(null);
    if (props.onError) {
      props.onError(null);
    }
    fileSelectRef.current?.click();
  };

  const handleFileSelected = async (file: File) => {
    const readResult = await readBackupFile(file);
    if (!readResult.success) {
      if (props.onError) {
        props.onError(readResult.error);
      } else {
        setError(readResult.error);
      }
      return;
    }

    if (!props.skipConfirm && !window.confirm('This will permanently overwrite all existing data with the contents of the backup file. This cannot be undone. Continue?')) {
      return;
    }

    setIsRestoring(true);

    const restoreResult = await restoreBackup(readResult.data);

    if (!restoreResult.success) {
      setIsRestoring(false);
      if (props.onError) {
        props.onError(`Restore failed: ${restoreResult.error}`);
      } else {
        setError(`Restore failed: ${restoreResult.error}`);
      }
      return;
    }

    setIsRestoring(false);
    await props.onSuccess();
  };

  return (
    <>
      <FileSelect ref={fileSelectRef} accept=".json" onChange={handleFileSelected} />
      <Button
        variant="secondary"
        onClick={handleClick}
        disabled={isRestoring || props.disabled}
        className={props.className}
      >
        {isRestoring ? 'Restoring…' : (props.label ?? 'Restore from backup')}
      </Button>
      {!props.onError && error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </>
  );
}
