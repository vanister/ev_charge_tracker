type MaintenanceEmptyStateProps = {
  onAdd: () => void;
};

// Stub — fully implemented in task 14
export function MaintenanceEmptyState(props: MaintenanceEmptyStateProps) {
  const { onAdd } = props;

  return (
    <div>
      <p>No maintenance records yet.</p>
      <button type="button" onClick={onAdd}>
        Add first record
      </button>
    </div>
  );
}
