import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function ErrorFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-body mb-2">EV Charge Tracker</h1>
        <p className="text-accent mb-4">Something went wrong</p>
        <p className="text-sm text-body-tertiary">An unexpected error occurred while rendering.</p>
        <p className="text-sm text-muted mt-4">Please refresh the page to try again</p>
      </div>
    </div>
  );
}

type GenericErrorProps = {
  children: ReactNode;
};

const onError = (error: unknown, info: React.ErrorInfo) => {
  console.error('Unhandled render error:', error, info);
};

export function GenericError({ children }: GenericErrorProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}
