
import { usePageTransition } from '@/contexts/PageTransitionContext';
import { useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';

export const useSmoothNavigation = (navigate: NavigateFunction) => {
  const { startTransition, endTransition } = usePageTransition();

  const smoothNavigate = useCallback((path: string) => {
    startTransition();
    
    // Small delay to show transition effect
    setTimeout(() => {
      navigate(path);
      // End transition after navigation
      setTimeout(() => {
        endTransition();
      }, 100);
    }, 150);
  }, [navigate, startTransition, endTransition]);

  return { smoothNavigate };
};
