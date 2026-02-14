import { EmptyState } from '../../components/EmptyState';

type SessionFormEmptyStatesProps = {
  isEditMode: boolean;
  sessionNotFound: boolean;
  hasVehicles: boolean;
  hasLocations: boolean;
  onNavigate: (path: string) => void;
};

export function SessionFormEmptyStates({
  isEditMode,
  sessionNotFound,
  hasVehicles,
  hasLocations,
  onNavigate
}: SessionFormEmptyStatesProps) {
  if (isEditMode && sessionNotFound) {
    return (
      <EmptyState
        title="Session Not Found"
        message="The session you're trying to edit could not be found."
        actionLabel="Back to Sessions"
        onAction={() => onNavigate('/sessions')}
      />
    );
  }

  if (!hasVehicles) {
    return (
      <EmptyState
        icon="car"
        title="No Vehicles Found"
        message="You need to add a vehicle before creating a charging session."
        actionLabel="Add Your First Vehicle"
        onAction={() => onNavigate('/vehicles/add')}
      />
    );
  }

  if (!hasLocations) {
    return (
      <EmptyState
        icon="map-pin"
        title="No Locations Found"
        message="You need to add a location before creating a charging session."
        actionLabel="Manage Locations"
        onAction={() => onNavigate('/settings')}
      />
    );
  }

  return null;
}
