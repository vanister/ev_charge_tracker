import { Component } from 'react';
import type { ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold text-body mb-2">EV Charge Tracker</h1>
              <p className="text-accent mb-4">Something went wrong</p>
              <p className="text-sm text-body-tertiary">An unexpected error occurred while rendering.</p>
              <p className="text-sm text-muted mt-4">Please refresh the page to try again</p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
