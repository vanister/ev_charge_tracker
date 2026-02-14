import { useState, useCallback } from 'react';
import { produce } from 'immer';

export function useImmerState<T>(initialValue: T | (() => T)) {
  const [state, setState] = useState(initialValue);

  const setImmerState = useCallback((updater: T | ((draft: T) => void)) => {
    setState((currentState) => {
      if (typeof updater === 'function') {
        return produce(currentState, updater as (draft: T) => void);
      }
      return updater;
    });
  }, []);

  return [state, setImmerState] as const;
}
