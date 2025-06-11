
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Utensils } from 'lucide-react';
import { useFrontendSettings } from '@/hooks/useFrontendSettings';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useNavigate } from 'react-router-dom';

const MinimalHero = () => {
  const { currentRestaurant } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { settings } = useFrontendSettings(restaurantId);
  const navigate = useNavigate();

  const heroTitle = settings?.hero_title || 'Fresh Homestyle Meals Delivered';
  const heroSubtitle = settings?.hero_subtitle || 'Experience authentic flavors crafted with love and delivered straight to your doorstep';
  const taglineBadgeText = settings?.tagline_badge_text || 'Authentic Home-Style Cooking';
  const primaryCtaText = settings?.primary_cta_text || 'Order Now';
  const primaryCtaUrl = settings?.primary_cta_url || '/menu';
  const primaryButtonBgColor = settings?.primary_button_bg_color || '#6366F1';
  const primaryButtonTextColor = settings?.primary_button_text_color || '#FFFFFF';

  const handlePrimaryCta = () => {
    navigate(primaryCtaUrl);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Simple Badge */}
        <Badge className="bg-gray-100 text-gray-800 border-gray-200 px-4 py-2 mb-8">
          <Utensils className="w-4 h-4 mr-2" />
          {taglineBadgeText}
        </Badge>
        
        {/* Main Heading */}
        <h1 className="text-6xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight">
          {heroTitle}
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          {heroSubtitle}
        </p>
        
        {/* Simple CTA */}
        <Button 
          size="lg" 
          onClick={handlePrimaryCta}
          className="text-lg px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2"
          style={{
            backgroundColor: primaryButtonBgColor,
            color: primaryButtonTextColor,
            borderColor: primaryButtonBgColor
          }}
        >
          {primaryCtaText}
          <ArrowRight className="ml-3 h-5 w-5" />
        </Button>
        
        {/* Minimal Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-light text-gray-900">10k+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-gray-900">5.0</div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              Rating
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-gray-900">30min</div>
            <div className="text-sm text-gray-600">Delivery Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MinimalHero;
