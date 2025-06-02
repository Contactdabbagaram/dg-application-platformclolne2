
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import { useFrontendSettings } from '@/hooks/useFrontendSettings';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { currentRestaurant, loading: restaurantLoading } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { settings, loading: settingsLoading } = useFrontendSettings(restaurantId);

  // Update document title and meta tags when settings load
  useEffect(() => {
    if (settings) {
      // Update page title
      if (settings.site_title) {
        document.title = settings.site_title;
      }
      
      // Update meta description
      if (settings.meta_description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', settings.meta_description);
        }
      }
      
      // Update meta keywords
      if (settings.meta_keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', settings.meta_keywords);
      }

      // Update favicon if provided
      if (settings.favicon_url) {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = settings.favicon_url;
        }
      }

      // Update CSS custom properties for theming
      if (settings.primary_color || settings.secondary_color || settings.accent_color) {
        const root = document.documentElement;
        if (settings.primary_color) {
          root.style.setProperty('--primary-color', settings.primary_color);
        }
        if (settings.secondary_color) {
          root.style.setProperty('--secondary-color', settings.secondary_color);
        }
        if (settings.accent_color) {
          root.style.setProperty('--accent-color', settings.accent_color);
        }
      }

      // Apply global font settings
      if (settings.body_font_family) {
        document.body.style.fontFamily = settings.body_font_family;
      }
    }
  }, [settings]);

  if (restaurantLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
