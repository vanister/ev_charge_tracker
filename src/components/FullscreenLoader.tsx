type FullscreenLoaderProps = {
  header?: string;
  description?: string;
};

export function FullscreenLoader({
  header = 'EV Charge Tracker',
  description = 'Loading...',
}: FullscreenLoaderProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-body mb-2">{header}</h1>
        <p className="text-body-tertiary">{description}</p>
      </div>
    </div>
  );
}
