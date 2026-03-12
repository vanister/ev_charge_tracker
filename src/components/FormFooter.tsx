import { useEffect, type ReactNode } from 'react';
import { useLayoutConfig } from '../hooks/useLayoutConfig';

type FormFooterProps = {
  children: ReactNode;
};

export function FormFooter({ children }: FormFooterProps) {
  const { setHideTabBar } = useLayoutConfig();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-background border-t border-default">
      <div className="max-w-2xl w-full mx-auto p-4">{children}</div>
    </div>
  );
}
