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
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={handleEdit}
        className="p-1.5 text-body-secondary hover:text-body hover:bg-background rounded-lg transition-colors"
        aria-label="Edit session"
      >
        <Icon name="edit" size="sm" />
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="p-1.5 text-body-secondary hover:text-red-600 dark:hover:text-red-400 hover:bg-background rounded-lg transition-colors"
        aria-label="Delete session"
      >
        <Icon name="trash-2" size="sm" />
      </button>
    </div>
  );
}
