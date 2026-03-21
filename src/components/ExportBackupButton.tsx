import { useState } from 'react';
import { useBackup } from '../hooks/useBackup';
import { Button } from './Button';
import { getDateGroupKey } from '../utilities/dateUtils';
import { BACKUP_FILE_NAME } from '../data/constants';

type ExportBackupButtonProps = {
  onSuccess?: () => void | Promise<void>;
  onError?: (error: string) => void;
  onExportStart?: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function ExportBackupButton(props: ExportBackupButtonProps) {
  const { exportBackup } = useBackup();
  const [isExporting, setIsExporting] = useState(false);

  const handleClick = async () => {
    props.onExportStart?.();
    setIsExporting(true);

    const result = await exportBackup();

    if (!result.success) {
      setIsExporting(false);
      props.onError?.(`Export failed: ${result.error}`);
      return;
    }

    const json = JSON.stringify(result.data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = getDateGroupKey(Date.now());
    const a = document.createElement('a');

    a.href = url;
    a.download = `${date}-v${result.data.dbVersion}-${BACKUP_FILE_NAME}`;
    a.click();

    URL.revokeObjectURL(url);

    setIsExporting(false);
    await props.onSuccess?.();
  };

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      disabled={isExporting || props.disabled}
      className={props.className}
    >
      {isExporting ? 'Exporting…' : (props.label ?? 'Export backup')}
    </Button>
  );
}
