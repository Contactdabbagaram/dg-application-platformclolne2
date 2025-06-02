
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star } from 'lucide-react';
import { useFrontendSettings } from '@/hooks/useFrontendSettings';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Hero = () => {
  const { currentRestaurant } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { settings } = useFrontendSettings(restaurantId);
  const navigate = useNavigate();

  // Use comprehensive settings from database with fallbacks
  const heroTitle = settings?.hero_title || 'Fresh Homestyle Meals Delivered';
  const heroSubtitle = settings?.hero_subtitle || 'Experience authentic flavors crafted with love and delivered straight to your doorstep';
  const taglineBadgeText = settings?.tagline_badge_text || 'Authentic Home-Style Cooking';
  const primaryCtaText = settings?.primary_cta_text || 'Order Now';
  const secondaryCtaText = settings?.secondary_cta_text || 'View Our Menu';
  const primaryCtaUrl = settings?.primary_cta_url || '/menu';
  const secondaryCtaUrl = settings?.secondary_cta_url || '/menu';
  const statCustomers = settings?.stat_customers || '25,000';
  const statOrders = settings?.stat_orders || '100,000';
  const statCities = settings?.stat_cities || '20';
  const statExperience = settings?.stat_experience || '8';
  const statCustomersLabel = settings?.stat_customers_label || 'Happy Customers';
  const statOrdersLabel = settings?.stat_orders_label || 'Orders Delivered';
  const statCitiesLabel = settings?.stat_cities_label || 'Cities Served';
  const statExperienceLabel = settings?.stat_experience_label || 'Years Experience';
  const showStatPlusSuffix = settings?.show_stat_plus_suffix !== false;
  const heroBackground = settings?.hero_background_url;
  
  // Support both single image (legacy) and multiple images (new)
  const heroFrontImages = settings?.hero_front_images || [];
  const legacyHeroImage = settings?.hero_front_image_url;
  const finalHeroImages = heroFrontImages.length > 0 
    ? heroFrontImages 
    : legacyHeroImage 
    ? [legacyHeroImage] 
    : ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'];
  
  // Theme colors
  const primaryButtonBgColor = settings?.primary_button_bg_color || '#6366F1';
  const primaryButtonTextColor = settings?.primary_button_text_color || '#FFFFFF';
  const secondaryButtonBgColor = settings?.secondary_button_bg_color || '#FFFFFF';
  const secondaryButtonTextColor = settings?.secondary_button_text_color || '#10B981';
  const secondaryButtonBorderColor = settings?.secondary_button_border_color || '#10B981';

  const handlePrimaryCta = () => {
    navigate(primaryCtaUrl);
  };

  const handleSecondaryCta = () => {
    navigate(secondaryCtaUrl);
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Background Image Overlay */}
      {heroBackground && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
      )}
      
      {/* Modern Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-50 animate-bounce"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 border-indigo-200 px-4 py-2">
              <Star className="w-4 h-4 mr-2 fill-current" />
              {taglineBadgeText}
            </Badge>
            
            <div className="space-y-6">
              <h1 
                className="text-5xl lg:text-6xl font-bold leading-tight"
                style={{
                  fontFamily: settings?.heading_font_family || 'Inter',
                  fontWeight: settings?.heading_font_weight || '700',
                  color: settings?.heading_text_color || '#1F2937'
                }}
              >
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  {heroTitle}
                </span>
              </h1>
              
              <p 
                className="text-xl leading-relaxed max-w-lg"
                style={{
                  fontFamily: settings?.body_font_family || 'Inter',
                  fontWeight: settings?.body_font_weight || '400',
                  color: settings?.body_text_color || '#6B7280'
                }}
              >
                {heroSubtitle}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handlePrimaryCta}
                className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: primaryButtonBgColor,
                  color: primaryButtonTextColor
                }}
              >
                {primaryCtaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleSecondaryCta}
                className="text-lg px-8 py-4 hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: secondaryButtonBgColor,
                  color: secondaryButtonTextColor,
                  borderColor: secondaryButtonBorderColor,
                  borderWidth: '2px'
                }}
              >
                {secondaryCtaText}
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  {statCustomers}{showStatPlusSuffix ? '+' : ''}
                </div>
                <div className="text-sm text-gray-600">{statCustomersLabel}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {statOrders}{showStatPlusSuffix ? '+' : ''}
                </div>
                <div className="text-sm text-gray-600">{statOrdersLabel}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {statCities}{showStatPlusSuffix ? '+' : ''}
                </div>
                <div className="text-sm text-gray-600">{statCitiesLabel}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {statExperience}{showStatPlusSuffix ? '+' : ''}
                </div>
                <div className="text-sm text-gray-600">{statExperienceLabel}</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Hero Images Carousel */}
          <div className="relative">
            <div className="relative z-10">
              {finalHeroImages.length === 1 ? (
                // Single image
                <img 
                  src={finalHeroImages[0]}
                  alt="Delicious homestyle meal"
                  className="rounded-2xl shadow-2xl w-full h-[600px] object-cover"
                />
              ) : (
                // Multiple images carousel
                <Carousel 
                  className="w-full" 
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {finalHeroImages.map((imageUrl, index) => (
                      <CarouselItem key={index}>
                        <img 
                          src={imageUrl}
                          alt={`Delicious homestyle meal ${index + 1}`}
                          className="rounded-2xl shadow-2xl w-full h-[600px] object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {finalHeroImages.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </>
                  )}
                </Carousel>
              )}
            </div>
            
            {/* Modern Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-blue-200 to-emerald-200 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
