import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

type UseNavigationGuardOptions = {
  enabled: boolean;
  message?: string | (() => string);
};

export function useNavigationGuard({ enabled, message }: UseNavigationGuardOptions) {
  const blocker = useBlocker(enabled);

  useEffect(() => {
    if (blocker.state !== 'blocked') {
      return;
    }

    const resolved = typeof message === 'function' ? message() : message;
    const confirmed = window.confirm(
      resolved ?? 'Are you sure you want to leave? This may interrupt an in-progress operation.'
    );

    if (confirmed) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker, message]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);
}
