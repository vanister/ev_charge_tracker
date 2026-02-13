import type { ReactNode } from 'react';

type OnboardingFooterProps = {
  children: ReactNode;
};

export function OnboardingFooter(props: OnboardingFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t border-default">
      <div className="max-w-2xl w-full mx-auto px-4 py-6">{props.children}</div>
    </div>
  );
}
