import { useDateTimeFormat } from '../../hooks/useDateTimeFormat';
import { useToast } from '../../hooks/useToast';
import { ButtonRow } from '../../components/ButtonRow';
import { formatDateTime } from '../../utilities/dateUtils';
import { DATE_FORMAT_OPTIONS, TIME_FORMAT_OPTIONS } from '../../constants';

const DATE_FORMAT_LABELS = DATE_FORMAT_OPTIONS.map((o) => o.label);
const TIME_FORMAT_LABELS = TIME_FORMAT_OPTIONS.map((o) => o.label);

export function DateTimeSectionBody() {
  const { prefs, updateDateFormat, updateTimeFormat } = useDateTimeFormat();
  const { showToast } = useToast();

  const dateLabel =
    DATE_FORMAT_OPTIONS.find((o) => o.value === prefs.dateFormat)?.label ?? DATE_FORMAT_OPTIONS[0].label;
  const timeLabel =
    TIME_FORMAT_OPTIONS.find((o) => o.value === prefs.timeFormat)?.label ?? TIME_FORMAT_OPTIONS[0].label;

  const handleDateFormatChange = async (label: string) => {
    const option = DATE_FORMAT_OPTIONS.find((o) => o.label === label);
    if (!option) {
      return;
    }
    const result = await updateDateFormat(option.value);
    showToast(
      result.success
        ? { message: 'Preferences saved', variant: 'success' }
        : { message: 'Failed to save preference', variant: 'error' }
    );
  };

  const handleTimeFormatChange = async (label: string) => {
    const option = TIME_FORMAT_OPTIONS.find((o) => o.label === label);
    if (!option) {
      return;
    }
    const result = await updateTimeFormat(option.value);
    showToast(
      result.success
        ? { message: 'Preferences saved', variant: 'success' }
        : { message: 'Failed to save preference', variant: 'error' }
    );
  };

  const preview = formatDateTime(Date.now(), prefs);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <p className="text-body text-sm font-medium">Date format</p>
        <ButtonRow options={DATE_FORMAT_LABELS} value={dateLabel} onChange={handleDateFormatChange} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-body text-sm font-medium">Time format</p>
        <ButtonRow options={TIME_FORMAT_LABELS} value={timeLabel} onChange={handleTimeFormatChange} />
      </div>
      <p className="text-body-secondary text-xs">Preview: {preview}</p>
    </div>
  );
}
