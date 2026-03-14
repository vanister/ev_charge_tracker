import { Icon } from '../../components/Icon';

type SessionItemActionsProps = {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  sessionId: string;
};

export function SessionItemActions({ onEdit, onDelete, sessionId }: SessionItemActionsProps) {
  const handleEdit = () => onEdit(sessionId);
  const handleDelete = () => onDelete(sessionId);

  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={handleEdit}
        className="text-body-secondary hover:text-body hover:bg-background rounded-lg p-1.5 transition-colors"
        aria-label="Edit session"
      >
        <Icon name="edit" size="sm" />
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="text-body-secondary hover:bg-background rounded-lg p-1.5 transition-colors hover:text-red-600 dark:hover:text-red-400"
        aria-label="Delete session"
      >
        <Icon name="trash-2" size="sm" />
      </button>
    </div>
  );
}
