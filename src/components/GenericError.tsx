export function GenericError() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="p-8 text-center">
        <h1 className="text-body mb-2 text-2xl font-bold">EV Charge Tracker</h1>
        <p className="text-accent mb-4">Something went wrong</p>
        <p className="text-body-tertiary text-sm">An unexpected error occurred while rendering.</p>
        <p className="text-muted mt-4 text-sm">Please refresh the page to try again</p>
      </div>
    </div>
  );
}
