---
name: component
description: Scaffold a new React component following project conventions. Use when creating a new component, page, or feature.
---

Create a new React component based on my description.

## Structure
- One component per file, named export only, no default export
- Props type defined in the same file as `type ComponentNameProps = {...}`
- File named exactly as the component: `ComponentName.tsx`
- Place in the appropriate feature folder under `src/`

## Patterns
- `export function ComponentName({ prop1, prop2 }: ComponentNameProps) {...}`
- Arrow functions for event handlers, callbacks, and internal functions
- Arrow functions require parens, destructure objects
- Logic in helpers/hooks, not in the component body
- Use `clsx` for dynamic class names
- No JSDocs or XML comments
- Named exports only, no barrel files, no re-exports
- Use `tailwindcss` for styling

## Before writing
1. State the component name, file path, and props shape
2. Identify if any helpers or hooks need to be created alongside it
3. Flag if the component needs data from Dexie/IndexedDB — confirm the pattern before assuming

## Example shape
```tsx
import { useState, useEffect } from 'react';
import { SomeChild } from './SomeChild';
import { formatLabel } from './helpers';

type MyComponentProps = {
  label: string;
  onAction: () => void;
};

export function MyComponent({ label, onAction }: MyComponentProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // hooks defined here above handlers, after consts
  }, [/* deps */])

  const handleClick = () => {
    setActive(!active);
    onAction();
  };

  return (
    <div className="bg-accent px-0 text-sm">
      <SomeChild />
      <button type="button" onClick={handleClick}>
        {formatLabel(label)}
      </button>
    </div>
  );
}
```

Do not add tests unless asked. Do not add comments unless they explain why, not what.