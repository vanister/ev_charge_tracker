import type { MaintenanceRecord } from '../../../data/data-types';
import type { DateTimeFormatPrefs } from '../../../types/shared-types';
import { Icon } from '../../../components/Icon';
import { formatDate } from '../../../utilities/dateUtils';
import { formatCost } from '../../../utilities/formatUtils';
import { getMaintenanceTypeLabel } from './maintenanceHelpers';
import { MaintenanceItemActions } from './MaintenanceItemActions';

type MaintenanceItemProps = {
  record: MaintenanceRecord;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  dateTimeFormatPrefs?: DateTimeFormatPrefs;
};

export function MaintenanceItem(props: MaintenanceItemProps) {
  const { record, onEdit, onDelete, dateTimeFormatPrefs } = props;

  const typeLabel = getMaintenanceTypeLabel(record.type);
  const date = formatDate(record.servicedAt, dateTimeFormatPrefs);

  return (
    <div className="bg-surface border-default rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon name="wrench" size="sm" className="text-body-secondary shrink-0" />
          <span className="text-body font-medium">{typeLabel}</span>
        </div>
        <MaintenanceItemActions recordId={record.id} onEdit={onEdit} onDelete={onDelete} />
      </div>

      <p className="text-body-secondary mb-2 text-sm">{record.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="text-body-secondary">{date}</span>
        {!!record.mileage && (
          <>
            <span className="text-body-tertiary">•</span>
            <span className="text-body-secondary">{record.mileage.toLocaleString()} mi</span>
          </>
        )}
        {!!record.costCents && (
          <>
            <span className="text-body-tertiary">•</span>
            <span className="text-body">{formatCost(record.costCents)}</span>
          </>
        )}
      </div>
    </div>
  );
}
