import { EmptyState } from '../../../components/EmptyState';

type MaintenanceEmptyStateProps = {
  onAdd: () => void;
  vehicleLabel?: string;
};

export function MaintenanceEmptyState(props: MaintenanceEmptyStateProps) {
  const { onAdd, vehicleLabel } = props;
  const message = vehicleLabel
    ? `Log the first service record for ${vehicleLabel}.`
    : 'Log the first service record for this vehicle.';

  return (
    <EmptyState
      icon="wrench"
      title="No maintenance records"
      message={message}
      actionLabel="Add Record"
      onAction={onAdd}
    />
  );
}
