
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import LoadingOverlay from '@/components/LoadingOverlay';
import { usePageTransition } from '@/contexts/PageTransitionContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { endTransition } = usePageTransition();

  useEffect(() => {
    // Start transition when location changes
    setIsTransitioning(true);
    
    // End transition after a short delay to show the animation
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      endTransition();
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname, endTransition]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <LoadingOverlay />
      <main 
        className={`transition-all duration-300 ${
          isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
