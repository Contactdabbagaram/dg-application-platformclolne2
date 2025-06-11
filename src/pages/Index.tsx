
import { useEffect, Suspense } from 'react';
import Hero from '@/components/Hero';
import PromotionalBanners from '@/components/themes/PromotionalBanners';
import FeaturedCategories from '@/components/themes/FeaturedCategories';
import MinimalHero from '@/components/themes/MinimalHero';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import HeroSkeleton from '@/components/skeletons/HeroSkeleton';
import { useFrontendSettings } from '@/hooks/useFrontendSettings';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { usePageTransition } from '@/contexts/PageTransitionContext';

const Index = () => {
  const { currentRestaurant, loading: restaurantLoading } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { settings, loading: settingsLoading } = useFrontendSettings(restaurantId);
  const { endTransition } = usePageTransition();

  // End transition when component is ready
  useEffect(() => {
    if (!restaurantLoading && !settingsLoading) {
      endTransition();
    }
  }, [restaurantLoading, settingsLoading, endTransition]);

  // Update document title and meta tags when settings load
  useEffect(() => {
    if (settings) {
      // Update page title
      if (settings.site_title) {
        document.title = settings.site_title;
      }
      
      if (settings.meta_description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', settings.meta_description);
        }
      }
      
      if (settings.meta_keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', settings.meta_keywords);
      }

      if (settings.favicon_url) {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = settings.favicon_url;
        }
      }

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

      if (settings.body_font_family) {
        document.body.style.fontFamily = settings.body_font_family;
      }
    }
  }, [settings]);

  if (restaurantLoading || settingsLoading) {
    return <HeroSkeleton />;
  }

  // Determine which theme component to render
  const selectedTheme = settings?.homepage_theme || 'classic';
  
  const renderThemeComponent = () => {
    switch (selectedTheme) {
      case 'promotional':
        return <PromotionalBanners />;
      case 'categories':
        return <FeaturedCategories />;
      case 'minimal':
        return <MinimalHero />;
      case 'classic':
      default:
        return (
          <Suspense fallback={<HeroSkeleton />}>
            <Hero />
          </Suspense>
        );
    }
  };

  return (
    <div className="animate-fade-in">
      {renderThemeComponent()}
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
