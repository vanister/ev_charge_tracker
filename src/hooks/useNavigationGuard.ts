import { useEffect } from 'react';

type UseNavigationGuardOptions = {
  enabled: boolean;
};

// useBlocker from react-router-dom requires a data router (RouterProvider) and
// is incompatible with <BrowserRouter>. Guard only against page unload/reload.
export function useNavigationGuard({ enabled }: UseNavigationGuardOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);
}
