
import { Loader2 } from 'lucide-react';
import { usePageTransition } from '@/contexts/PageTransitionContext';

const LoadingOverlay = () => {
  const { isTransitioning } = usePageTransition();

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-300">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
