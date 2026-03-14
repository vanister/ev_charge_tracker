type FullscreenLoaderProps = {
  header?: string;
  description?: string;
};

export function FullscreenLoader({ header = 'EV Charge Tracker', description = 'Loading...' }: FullscreenLoaderProps) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-body mb-2 text-2xl font-bold">{header}</h1>
        <p className="text-body-tertiary">{description}</p>
      </div>
    </div>
  );
}
