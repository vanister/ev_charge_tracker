import type { ReactNode } from 'react';

type FormFooterProps = {
  children: ReactNode;
};

export function FormFooter({ children }: FormFooterProps) {
  return (
    <div className="bg-background border-default fixed right-0 bottom-0 left-0 z-20 border-t">
      <div className="mx-auto w-full max-w-2xl p-4">{children}</div>
    </div>
  );
}
