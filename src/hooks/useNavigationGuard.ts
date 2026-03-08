import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

type UseNavigationGuardOptions = {
  enabled: boolean;
  message?: string;
};

/**
 * Prompts the user for confirmation before navigating away from the current page.
 * Blocks both in-app navigation (via React Router) and browser tab close/refresh.
 */
export function useNavigationGuard({ enabled, message }: UseNavigationGuardOptions) {
  const confirmMessage =
    message ?? 'Are you sure you want to leave? This may interrupt an in-progress operation.';

  const blocker = useBlocker(enabled);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (window.confirm(confirmMessage)) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, confirmMessage]);

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);
}
