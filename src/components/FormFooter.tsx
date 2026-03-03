import type { ReactNode } from 'react';

type FormFooterProps = {
  children: ReactNode;
};

export function FormFooter({ children }: FormFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t border-default">
      <div className="max-w-2xl w-full mx-auto p-4">{children}</div>
    </div>
  );
}
