import { useEffect, useState } from 'react';
import { useMaintenanceRecords } from '../../hooks/useMaintenanceRecords';
import { formatDate, getDateRangeForTimeFilter } from '../../utilities/dateUtils';
import { formatCost } from '../../utilities/formatUtils';
import { DashboardStatCard } from './DashboardStatCard';
import type { MaintenanceRecord } from '../../data/data-types';
import type { TimeFilterValue } from '../../types/shared-types';

type MaintenanceSummaryCardProps = {
  activeVehicleId: string;
  timeRange: TimeFilterValue;
};

export function MaintenanceSummary({ activeVehicleId, timeRange }: MaintenanceSummaryCardProps) {
  const { getMaintenanceRecordList } = useMaintenanceRecords();
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await getMaintenanceRecordList(activeVehicleId);

      if (!result.success) {
        console.error('Failed to load maintenance records for dashboard:', result.error);
        return;
      }

      const dateRange = getDateRangeForTimeFilter(timeRange);
      const records = dateRange
        ? result.data.filter((r) => r.servicedAt >= dateRange.start && r.servicedAt <= dateRange.end)
        : result.data;

      setFilteredRecords(records);
    };

    load();
  }, [activeVehicleId, timeRange, getMaintenanceRecordList]);

  const lastRecord = filteredRecords[0] ?? null;
  const lastServicedDate = lastRecord ? formatDate(lastRecord.servicedAt, 'MMM d, yyyy') : '—';
  const totalCostCents = filteredRecords.reduce((sum, r) => sum + (r.costCents ?? 0), 0);
  const totalCostLabel = filteredRecords.length > 0 ? formatCost(totalCostCents) : '—';

  return (
    <div className="grid grid-cols-2 gap-3">
      <DashboardStatCard label="Last Serviced" value={lastServicedDate} icon="calendar" />
      <DashboardStatCard label="Total Service Cost" value={totalCostLabel} icon="wrench" />
    </div>
  );
}
