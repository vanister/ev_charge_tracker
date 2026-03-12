import { useEffect } from 'react';
import { useLayoutConfig } from './useLayoutConfig';

export function usePageConfig(title: string, hideTabBar = false) {
  const { setTitle, setHideTabBar } = useLayoutConfig();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  useEffect(() => {
    if (!hideTabBar) {
      return;
    }

    setHideTabBar(true);

    return () => setHideTabBar(false);
  }, [hideTabBar, setHideTabBar]);

  return { updateTitle: setTitle };
}
