import { clsx } from 'clsx';

type ButtonRowProps = {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
};

export function ButtonRow({ options, value, onChange }: ButtonRowProps) {
  return (
    <div className="flex gap-1.5">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={clsx('flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors', {
            'bg-primary text-white': value === option,
            'bg-surface text-body-secondary hover:bg-primary/10': value !== option
          })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
