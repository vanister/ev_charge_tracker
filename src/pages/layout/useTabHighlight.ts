import { useLayoutEffect, useRef, useState } from 'react';

export type TabHighlight = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function useTabHighlight(activeIndex: number) {
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [highlight, setHighlight] = useState<TabHighlight>({ left: 0, top: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    const measureActiveTab = () => {
      const activeTab = tabRefs.current[activeIndex];
      if (!activeTab) {
        return;
      }

      setHighlight({
        left: activeTab.offsetLeft,
        top: activeTab.offsetTop,
        width: activeTab.offsetWidth,
        height: activeTab.offsetHeight
      });
    };

    measureActiveTab();
    window.addEventListener('resize', measureActiveTab);

    return () => window.removeEventListener('resize', measureActiveTab);
  }, [activeIndex]);

  return { tabRefs, highlight };
}
