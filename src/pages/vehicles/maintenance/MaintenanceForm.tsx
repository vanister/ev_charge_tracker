import { MAINTENANCE_TYPES } from '../../../constants';
import { FormInput } from '../../../components/FormInput';
import { FormTextarea } from '../../../components/FormTextarea';
import { FormSelect } from '../../../components/FormSelect';
import { createTypeLabel } from './maintenanceHelpers';
import type { MaintenanceFormData } from './maintenance-types';

type MaintenanceFormProps = {
  id?: string;
  formData: MaintenanceFormData;
  onChange: (field: keyof MaintenanceFormData, value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string;
};

export function MaintenanceForm(props: MaintenanceFormProps) {
  const { id, formData, onChange, onSubmit, isLoading, error } = props;

  return (
    <form id={id} onSubmit={onSubmit} className="space-y-4">
      <FormSelect
        id="type"
        label="Service Type"
        required
        value={formData.type}
        onChange={(e) => onChange('type', e.target.value)}
        disabled={isLoading}
        options={[
          { value: '', text: 'Select service type' },
          ...MAINTENANCE_TYPES.map((t) => ({ value: t, text: createTypeLabel(t) }))
        ]}
      />

      <FormInput
        id="description"
        label="Description (optional)"
        type="text"
        value={formData.description}
        onChange={(e) => onChange('description', e.target.value)}
        placeholder="Brief description of the service"
        disabled={isLoading}
      />

      <FormInput
        id="servicedAt"
        label="Date of Service"
        type="date"
        required
        value={formData.servicedAt}
        onChange={(e) => onChange('servicedAt', e.target.value)}
        disabled={isLoading}
      />

      <FormInput
        id="cost"
        label="Cost (optional)"
        type="number"
        step="0.01"
        min="0"
        value={formData.cost}
        onChange={(e) => onChange('cost', e.target.value)}
        placeholder="0.00"
        disabled={isLoading}
      />

      <FormInput
        id="mileage"
        label="Mileage (optional)"
        type="number"
        step="1"
        min="0"
        value={formData.mileage}
        onChange={(e) => onChange('mileage', e.target.value)}
        placeholder="Current odometer reading"
        disabled={isLoading}
      />

      <FormInput
        id="serviceProvider"
        label="Service Provider (optional)"
        type="text"
        value={formData.serviceProvider}
        onChange={(e) => onChange('serviceProvider', e.target.value)}
        placeholder="Shop or provider name"
        disabled={isLoading}
      />

      <FormInput
        id="nextDueDate"
        label="Next Due Date (optional)"
        type="date"
        value={formData.nextDueDate}
        onChange={(e) => onChange('nextDueDate', e.target.value)}
        disabled={isLoading}
      />

      <FormInput
        id="nextDueMileage"
        label="Next Due Mileage (optional)"
        type="number"
        step="1"
        min="0"
        value={formData.nextDueMileage}
        onChange={(e) => onChange('nextDueMileage', e.target.value)}
        placeholder="Mileage for next service"
        disabled={isLoading}
      />

      <FormTextarea
        id="notes"
        label="Notes (optional)"
        rows={3}
        value={formData.notes}
        onChange={(e) => onChange('notes', e.target.value)}
        placeholder="Any additional notes..."
        disabled={isLoading}
      />

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
    </form>
  );
}
