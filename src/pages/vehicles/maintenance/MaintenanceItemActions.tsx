import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';

type MaintenanceItemActionsProps = {
  recordId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function MaintenanceItemActions({ recordId, onEdit, onDelete }: MaintenanceItemActionsProps) {
  const handleEdit = () => onEdit(recordId);
  const handleDelete = () => onDelete(recordId);

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button variant="ghost" aria-label="Edit record" onClick={handleEdit}>
        <Icon name="edit" size="sm" />
      </Button>
      <Button
        variant="ghost"
        aria-label="Delete record"
        onClick={handleDelete}
        className="hover:text-red-600 dark:hover:text-red-400"
      >
        <Icon name="trash-2" size="sm" />
      </Button>
    </div>
  );
}
