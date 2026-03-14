import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';

type SessionsEmptyStateProps = {
  hasFilters: boolean;
  hasTimeRangeFilter?: boolean;
  onAddSession: () => void;
  onClearFilters: () => void;
};

export function SessionsEmptyState(props: SessionsEmptyStateProps) {
  const { hasFilters, hasTimeRangeFilter, onAddSession, onClearFilters } = props;

  if (hasFilters) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 text-center">
        <p className="text-body-secondary mb-4 text-lg">No sessions match your filters</p>
        <Button variant="secondary" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  if (hasTimeRangeFilter) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 text-center">
        <p className="text-body-secondary mb-2 text-lg">No sessions in this time period</p>
        <p className="text-body-tertiary mb-6 text-sm">Try selecting a different time range</p>
      </div>
    );
  }

  return (
    <EmptyState
      icon="zap"
      title="No charging sessions yet"
      message="Add your first session to start tracking your EV charging stats."
      actionLabel="Add Session"
      onAction={onAddSession}
    />
  );
}
