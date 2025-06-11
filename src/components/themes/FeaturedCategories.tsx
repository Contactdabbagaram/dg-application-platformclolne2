
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Star } from 'lucide-react';
import { useFrontendSettings } from '@/hooks/useFrontendSettings';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useNavigate } from 'react-router-dom';

const FeaturedCategories = () => {
  const { currentRestaurant } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { settings } = useFrontendSettings(restaurantId);
  const navigate = useNavigate();

  const primaryCtaUrl = settings?.primary_cta_url || '/menu';
  const primaryButtonBgColor = settings?.primary_button_bg_color || '#6366F1';
  const primaryButtonTextColor = settings?.primary_button_text_color || '#FFFFFF';

  const categories = [
    {
      name: "Main Course",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Hearty traditional meals",
      badge: "Most Popular",
      items: "25+ items"
    },
    {
      name: "Appetizers",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Perfect starters",
      badge: "Chef's Choice",
      items: "15+ items"
    },
    {
      name: "Desserts",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Sweet endings",
      badge: "New Items",
      items: "12+ items"
    }
  ];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`${primaryCtaUrl}?category=${encodeURIComponent(categoryName)}`);
  };

  const handleViewAll = () => {
    navigate(primaryCtaUrl);
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 border-indigo-200 px-4 py-2 mb-4">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Featured Categories
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Menu
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated categories of authentic homestyle dishes
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="group cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="relative">
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-800 font-medium">
                      {category.badge}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/90 rounded-full p-2">
                      <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-3">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {category.items}
                    </span>
                    <span className="text-indigo-600 font-medium group-hover:text-indigo-700">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={handleViewAll}
            className="text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              backgroundColor: primaryButtonBgColor,
              color: primaryButtonTextColor
            }}
          >
            View Full Menu
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
