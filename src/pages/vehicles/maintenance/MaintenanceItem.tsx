import type { MaintenanceRecord } from '../../../data/data-types';

type MaintenanceItemProps = {
  record: MaintenanceRecord;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

// Stub — fully implemented in task 14
export function MaintenanceItem(props: MaintenanceItemProps) {
  const { record } = props;

  return <div>{record.description}</div>;
}
