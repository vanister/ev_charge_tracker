import { useEffect, useContext, type ReactNode } from 'react';
import { LayoutConfigContext } from '../contexts/LayoutConfigContext';

type FormFooterProps = {
  children: ReactNode;
};

export function FormFooter({ children }: FormFooterProps) {
  const layoutConfig = useContext(LayoutConfigContext);

  useEffect(() => {
    layoutConfig?.setHideTabBar(true);
    return () => layoutConfig?.setHideTabBar(false);
  }, [layoutConfig]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-background border-t border-default">
      <div className="max-w-2xl w-full mx-auto p-4">{children}</div>
    </div>
  );
}
