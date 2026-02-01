type InitializationErrorProps = {
  error: string;
};

export function InitializationError({ error }: InitializationErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">EV Charge Tracker</h1>
        <p className="text-red-600 mb-4">Failed to initialize app</p>
        <p className="text-sm text-gray-600">{error}</p>
        <p className="text-sm text-gray-500 mt-4">This app requires IndexedDB support</p>
      </div>
    </div>
  );
}
