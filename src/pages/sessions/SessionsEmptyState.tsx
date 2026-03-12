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
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <p className="text-body-secondary text-lg mb-4">No sessions match your filters</p>
        <Button variant="secondary" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  if (hasTimeRangeFilter) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <p className="text-body-secondary text-lg mb-2">No sessions in this time period</p>
        <p className="text-body-tertiary text-sm mb-6">Try selecting a different time range</p>
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
