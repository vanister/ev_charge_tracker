import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../../hooks/useVehicles';
import { usePageConfig } from '../../hooks/usePageConfig';
import { ItemListButton } from '../../components/ItemListButton';
import { EmptyState } from '../../components/EmptyState';
import { VehicleItem } from './VehicleItem';
import type { Vehicle } from '../../data/data-types';

export function VehiclesList() {
  usePageConfig('Vehicles');

  const navigate = useNavigate();
  const { getVehicleList, deleteVehicle } = useVehicles();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const sortedVehicles = useMemo(() => [...vehicles].sort((a, b) => b.createdAt - a.createdAt), [vehicles]);

  useEffect(() => {
    const loadVehicles = async () => {
      const result = await getVehicleList();

      if (result.success) {
        setVehicles(result.data);
      }
    };

    loadVehicles();
  }, [getVehicleList]);

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this vehicle?');

    if (!confirmed) {
      return;
    }

    const result = await deleteVehicle(id);

    if (!result.success) {
      alert(`Failed to delete vehicle: ${result.error}`);
      return;
    }

    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  if (vehicles.length === 0) {
    return (
      <div className="bg-background flex flex-1 flex-col py-6">
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
    <div className="bg-background px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <ItemListButton label="Add vehicle" onClick={() => navigate('/vehicles/add')} className="mb-6" />

        <div className="space-y-3">
          {sortedVehicles.map((vehicle) => (
            <VehicleItem key={vehicle.id} vehicle={vehicle} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
