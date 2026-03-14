import { useRef, useState } from 'react';
import { useBackup } from '../hooks/useBackup';
import { Button } from './Button';
import { FileSelect } from './FileSelect';

type RestoreBackupButtonProps = {
  onSuccess: () => void | Promise<void>;
  onError?: (error: string | null) => void;
  onRestoreStart?: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  skipConfirm?: boolean;
};

export function RestoreBackupButton(props: RestoreBackupButtonProps) {
  const { readBackupFile, restoreBackup } = useBackup();
  const [isRestoring, setIsRestoring] = useState(false);
  const fileSelectRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    props.onError?.(null);
    fileSelectRef.current?.click();
  };

  const handleFileSelected = async (file: File) => {
    const readResult = await readBackupFile(file);
    if (!readResult.success) {
      props.onError?.(readResult.error);
      return;
    }

    if (
      !props.skipConfirm &&
      !confirm(
        'This will permanently overwrite all existing data with the contents of the backup file. This cannot be undone. Continue?'
      )
    ) {
      return;
    }

    props.onRestoreStart?.();
    setIsRestoring(true);

    const restoreResult = await restoreBackup(readResult.data);

    if (!restoreResult.success) {
      setIsRestoring(false);
      props.onError?.(`Restore failed: ${restoreResult.error}`);
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
    </>
  );
}
