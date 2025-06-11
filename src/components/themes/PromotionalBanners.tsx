
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Percent, Gift, Clock } from 'lucide-react';
import { useFrontendSettings } from '@/hooks/useFrontendSettings';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useNavigate } from 'react-router-dom';

const PromotionalBanners = () => {
  const { currentRestaurant } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { settings } = useFrontendSettings(restaurantId);
  const navigate = useNavigate();

  const primaryCtaUrl = settings?.primary_cta_url || '/menu';
  const primaryButtonBgColor = settings?.primary_button_bg_color || '#6366F1';
  const primaryButtonTextColor = settings?.primary_button_text_color || '#FFFFFF';

  const handleOrderNow = () => {
    navigate(primaryCtaUrl);
  };

  return (
    <section className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Promotional Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-8 md:p-12 mb-8 shadow-2xl">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10 text-center text-white">
            <Badge className="bg-white/20 text-white border-white/30 mb-4 text-lg px-6 py-2">
              <Gift className="w-5 h-5 mr-2" />
              Limited Time Offer
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              BUY 1 GET 1
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              On All Main Course Items
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Clock className="w-5 h-5" />
              <span className="text-lg">Valid until midnight today!</span>
            </div>
            <Button 
              size="lg" 
              onClick={handleOrderNow}
              className="text-xl px-12 py-6 bg-white text-red-600 hover:bg-gray-100 shadow-xl"
            >
              Order Now & Save 50%
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Secondary Promotional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Percent className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">30% OFF</h3>
              <p className="text-gray-600 mb-4">On orders above ₹500</p>
              <Badge className="bg-green-100 text-green-800">Code: SAVE30</Badge>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">FREE Delivery</h3>
              <p className="text-gray-600 mb-4">On your first order</p>
              <Badge className="bg-blue-100 text-blue-800">No minimum order</Badge>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 mb-4">Under 30 minutes</p>
              <Badge className="bg-purple-100 text-purple-800">Express service</Badge>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Don't Miss Out on These Amazing Deals!
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the best of homestyle cooking with unbeatable prices and lightning-fast delivery.
          </p>
          <Button 
            size="lg" 
            onClick={handleOrderNow}
            className="text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              backgroundColor: primaryButtonBgColor,
              color: primaryButtonTextColor
            }}
          >
            Explore Full Menu
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
