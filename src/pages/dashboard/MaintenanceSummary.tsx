import { useEffect, useState } from 'react';
import { useMaintenanceRecords } from '../../hooks/useMaintenanceRecords';
import { formatDate } from '../../utilities/dateUtils';
import { DashboardStatCard } from './DashboardStatCard';
import { createTypeLabel } from '../vehicles/maintenance/maintenanceHelpers';
import type { MaintenanceRecord } from '../../data/data-types';

type MaintenanceSummaryCardProps = {
  activeVehicleId: string;
};

export function MaintenanceSummary({ activeVehicleId }: MaintenanceSummaryCardProps) {
  const { getMaintenanceRecordList } = useMaintenanceRecords();
  const [lastRecord, setLastRecord] = useState<MaintenanceRecord | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = await getMaintenanceRecordList(activeVehicleId);

      if (!result.success) {
        console.error('Failed to load maintenance records for dashboard:', result.error);
        return;
      }

      // Records are sorted newest first; take the first one
      setLastRecord(result.data[0] ?? null);
    };

    load();
  }, [activeVehicleId, getMaintenanceRecordList]);

  const hasRecord = !!lastRecord;
  const lastServiceLabel = hasRecord ? createTypeLabel(lastRecord.type) : 'No records yet';
  const lastServicedDate = hasRecord ? formatDate(lastRecord.servicedAt, 'MMM d, yyyy') : '—';
  const actionLabel = hasRecord ? 'View all →' : 'Add first record →';

  return (
    <div className="grid grid-cols-2 gap-3">
      <DashboardStatCard
        label="Last Service"
        value={lastServiceLabel}
        icon="wrench"
        action={{
          label: actionLabel,
          to: `/vehicles/${activeVehicleId}/maintenance`
        }}
      />
      <DashboardStatCard label="Last Serviced" value={lastServicedDate} icon="calendar" />
    </div>
  );
}
