
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import LoadingOverlay from '@/components/LoadingOverlay';
import { usePageTransition } from '@/contexts/PageTransitionContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useFrontendSettings } from '@/hooks/useFrontendSettings';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { endTransition } = usePageTransition();
  const { currentRestaurant } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { settings } = useFrontendSettings(restaurantId);

  // Determine background color from frontend settings, fallback to white
  const appBgColor = settings?.primary_color || '#fff';

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
    <div
      className="min-h-screen"
      style={{ backgroundColor: appBgColor, transition: 'background-color 0.3s' }}
    >
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
