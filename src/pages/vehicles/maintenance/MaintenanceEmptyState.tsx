import { EmptyState } from '../../../components/EmptyState';

type MaintenanceEmptyStateProps = {
  onAdd: () => void;
  label?: string;
};

export function MaintenanceEmptyState(props: MaintenanceEmptyStateProps) {
  const { onAdd, label } = props;

  return (
    <EmptyState
      icon="wrench"
      label={label}
      title="No maintenance records"
      message="Log the first service record for this vehicle."
      actionLabel="Add Record"
      onAction={onAdd}
    />
  );
}
