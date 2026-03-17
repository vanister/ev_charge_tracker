import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_TRANSITION_DURATION } from '../constants';

export function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, PAGE_TRANSITION_DURATION);

    return () => clearTimeout(timer);
  }, [hash]);
}
