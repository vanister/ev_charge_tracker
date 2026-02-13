import { Button } from '../../components/Button';

type SessionsEmptyStateProps = {
  hasFilters: boolean;
  onAddSession: () => void;
  onClearFilters: () => void;
};

export function SessionsEmptyState(props: SessionsEmptyStateProps) {
  const { hasFilters, onAddSession, onClearFilters } = props;

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <p className="text-body-secondary text-lg mb-4">No sessions match your filters</p>
        <Button variant="secondary" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <p className="text-body-secondary text-lg mb-2">No charging sessions yet</p>
      <p className="text-body-tertiary text-sm mb-6">
        Add your first charging session to get started
      </p>
      <Button variant="primary" onClick={onAddSession}>
        Add Session
      </Button>
    </div>
  );
}
