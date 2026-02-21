import { Link, useNavigate } from 'react-router-dom';
import { useVehicles } from '../../hooks/useVehicles';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { VehicleItem } from './VehicleItem';
import { useMemo } from 'react';

export function VehiclesList() {
  usePageTitle('Vehicles');

  const navigate = useNavigate();
  const { vehicles, deleteVehicle } = useVehicles();
  const sortedVehicles = useMemo(() => [...vehicles].sort((a, b) => b.createdAt - a.createdAt), [vehicles]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this vehicle?');

    if (!confirmed) {
      return;
    }

    const result = await deleteVehicle(id);

    if (!result.success) {
      alert(`Failed to delete vehicle: ${result.error}`);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="h-[calc(100vh-5rem)] bg-background px-4 py-6 flex flex-col">
        <EmptyState
          icon="car"
          title="No vehicles yet"
          message="Add your first electric vehicle to start tracking charging sessions."
          actionLabel="Add Vehicle"
          onAction={() => navigate('/vehicles/add')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-end mb-6">
          <Link to="/vehicles/add">
            <Button variant="primary">Add Vehicle</Button>
          </Link>
        </div>

        <div className="space-y-3">
          {sortedVehicles.map((vehicle) => (
            <VehicleItem key={vehicle.id} vehicle={vehicle} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
