import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../hooks/useDatabase';
import { useBackup } from '../../hooks/useBackup';
import { OnboardingHeader } from './OnboardingHeader';
import { FormFooter } from '../../components/FormFooter';
import { Button } from '../../components/Button';

type OnboardingStep1WelcomeProps = {
  onContinue: () => void;
};

export function OnboardingStep1Welcome(props: OnboardingStep1WelcomeProps) {
  const navigate = useNavigate();
  const { db } = useDatabase();
  const { readBackupFile, restoreBackup } = useBackup();
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRestoreClick = () => {
    setRestoreError(null);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Reset input so the same file can be re-selected after cancelling
    e.target.value = '';

    const readResult = await readBackupFile(file);
    if (!readResult.success) {
      setRestoreError(readResult.error);
      return;
    }

    const backup = readResult.data;

    if (backup.version !== db.verno) {
      const msg =
        `Backup version (${backup.version}) does not match ` +
        `the app's database version (${db.verno}). Restore is not possible.`;
      setRestoreError(msg);
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
      setRestoreError(`Restore failed: ${restoreResult.error}`);
      return;
    }

    navigate('/', { replace: true });
  };

  return (
    <div className="text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelected}
      />

      <OnboardingHeader
        title="EV Charge Tracker"
        description="Track your electric vehicle charging sessions with ease."
        subDescription={
          'Work completely offline, manage multiple vehicles, and analyze your ' +
          'charging costs across different locations.'
        }
      />

      <FormFooter>
        <Button
          variant="primary"
          onClick={props.onContinue}
          disabled={isRestoring}
          fullWidth
          className="sm:w-auto"
        >
          Get Started
        </Button>
      </FormFooter>

      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-xs text-body-secondary">or</p>
        <Button variant="secondary" onClick={handleRestoreClick} disabled={isRestoring}>
          {isRestoring ? 'Restoring…' : 'Restore from backup'}
        </Button>
        {restoreError && (
          <p className="text-sm text-red-600 dark:text-red-400">{restoreError}</p>
        )}
      </div>
    </div>
  );
}
