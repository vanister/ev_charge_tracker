import { useEffect } from 'react';
import { useLayoutConfig } from './useLayoutConfig';

export function usePageTitle(title: string) {
  const { setTitle } = useLayoutConfig();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return { updateTitle: setTitle };
}
