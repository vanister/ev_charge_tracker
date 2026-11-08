import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../../../hooks/useVehicles';
import { ItemListButton } from '../../../components/ItemListButton';
import { VehicleItem } from './VehicleItem';
import type { VehicleRecord } from '../../../data/data-types';

export function VehiclesSectionBody() {
  const navigate = useNavigate();
  const { getVehicleList, deleteVehicle } = useVehicles();
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
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

  const handleAdd = () => {
    navigate('/settings/vehicles/add');
  };

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

  return (
    <div className="vehicles-section-body space-y-3">
      <ItemListButton label="Add vehicle" onClick={handleAdd} />
      {sortedVehicles.length === 0 && (
        <p className="text-body-secondary text-center text-sm">
          Add your first electric vehicle to start tracking charging sessions.
        </p>
      )}
      {sortedVehicles.map((vehicle) => (
        <VehicleItem key={vehicle.id} vehicle={vehicle} onDelete={handleDelete} />
      ))}
    </div>
  );
}
