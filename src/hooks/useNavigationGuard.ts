import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

type UseNavigationGuardOptions = {
  enabled: boolean;
  message?: string | (() => string);
};

export function useNavigationGuard({ enabled, message }: UseNavigationGuardOptions) {
  const getConfirmMessage = () => {
    const resolved = typeof message === 'function' ? message() : message;
    return resolved ?? 'Are you sure you want to leave? This may interrupt an in-progress operation.';
  };

  const blocker = useBlocker(enabled);

  useEffect(() => {
    if (blocker.state !== 'blocked') return;

    if (!window.confirm(getConfirmMessage())) {
      blocker.reset();
      return;
    }

    blocker.proceed();
  }, [blocker]);

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);
}
