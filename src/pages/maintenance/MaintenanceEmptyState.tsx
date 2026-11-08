import { EmptyState } from '../../components/EmptyState';

type MaintenanceEmptyStateProps = {
  onAdd: () => void;
};

export function MaintenanceEmptyState(props: MaintenanceEmptyStateProps) {
  const { onAdd } = props;

  return (
    <EmptyState
      icon="wrench"
      title="No service records"
      message="Log your first service record."
      actionLabel="Add Record"
      onAction={onAdd}
    />
  );
}
