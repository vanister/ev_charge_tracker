import { useEffect, useState } from 'react';
import { useMaintenanceRecords } from '../../hooks/useMaintenanceRecords';
import { useDateTimeFormat } from '../../hooks/useDateTimeFormat';
import { formatDate, getDateRangeForTimeFilter } from '../../utilities/dateUtils';
import { formatCost } from '../../utilities/formatUtils';
import { DashboardStatCard } from './DashboardStatCard';
import type { MaintenanceRecord } from '../../data/data-types';
import { getMaintenanceTypeLabel } from '../vehicles/maintenance/maintenanceHelpers';

export function MaintenanceSummary() {
  const { getMaintenanceRecordList } = useMaintenanceRecords();
  const { prefs: dateTimePrefs } = useDateTimeFormat();
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await getMaintenanceRecordList();

      if (!result.success) {
        console.error('Failed to load maintenance records for dashboard:', result.error);
        return;
      }

      const dateRange = getDateRangeForTimeFilter('all');
      const records = dateRange
        ? result.data.filter((r) => r.servicedAt >= dateRange.start && r.servicedAt <= dateRange.end)
        : result.data;

      setFilteredRecords(records);
    };

    load();
  }, [getMaintenanceRecordList]);

  const lastRecord = filteredRecords[0] ?? null;
  const lastServicedDate = lastRecord ? formatDate(lastRecord.servicedAt, dateTimePrefs) : '—';
  // format the service type to be human readable
  const lastServiceType = lastRecord ? getMaintenanceTypeLabel(lastRecord.type) : undefined;
  // only show cents if cost is less than 1000 dollars to avoid cluttering the UI with unnecessary detail for large costs
  const totalCostCents = filteredRecords.reduce((sum, r) => sum + (r.costCents ?? 0), 0);
  const totalCostLabel = filteredRecords.length > 0 ? formatCost(totalCostCents) : '—';

  return (
    <div className="grid grid-cols-2 gap-3">
      <DashboardStatCard label="Last Serviced" value={lastServicedDate} icon="calendar" subtitle={lastServiceType} />
      <DashboardStatCard label="Total Cost" value={totalCostLabel} icon="wrench" />
    </div>
  );
}
