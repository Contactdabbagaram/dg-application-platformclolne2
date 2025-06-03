
import { useNavigate } from 'react-router-dom';
import { usePageTransition } from '@/contexts/PageTransitionContext';
import { useCallback } from 'react';

export const useSmoothNavigation = () => {
  const navigate = useNavigate();
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
