import { EmptyState } from '../../../components/EmptyState';

type MaintenanceEmptyStateProps = {
  onAdd: () => void;
};

export function MaintenanceEmptyState(props: MaintenanceEmptyStateProps) {
  const { onAdd } = props;

  return (
    <EmptyState
      icon="wrench"
      title="No maintenance records"
      message="Log the first service record for this vehicle."
      actionLabel="Add Record"
      onAction={onAdd}
    />
  );
}
