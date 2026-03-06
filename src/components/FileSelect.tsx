import { forwardRef } from 'react';

type FileSelectProps = {
  accept?: string;
  onChange: (file: File) => void;
};

export const FileSelect = forwardRef<HTMLInputElement, FileSelectProps>((props, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    // Reset so the same file can be re-selected after cancelling
    e.target.value = '';
    props.onChange(file);
  };

  return (
    <input
      ref={ref}
      type="file"
      accept={props.accept}
      className="hidden"
      onChange={handleChange}
    />
  );
});
