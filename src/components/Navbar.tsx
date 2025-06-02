
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, ShoppingCart, Phone, MapPin } from 'lucide-react';
import { useFrontendSettings } from '@/hooks/useFrontendSettings';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentRestaurant } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { settings } = useFrontendSettings(restaurantId);
  const navigate = useNavigate();

  const businessName = settings?.business_name || 'DabbaGaram';
  const contactPhone = settings?.contact_phone || '+91-9876543210';
  const deliveryRadiusText = settings?.delivery_radius_text || 'Free delivery within 5km';
  const orderCutoffText = settings?.order_cutoff_text || 'Order before 8 PM for same-day delivery';
  const headerBarColor = settings?.header_bar_color || '#6366F1';
  const primaryButtonBgColor = settings?.primary_button_bg_color || '#6366F1';
  const primaryButtonTextColor = settings?.primary_button_text_color || '#FFFFFF';
  const showCartButton = settings?.show_cart_button !== false;
  const cartButtonUrl = settings?.cart_button_url || '/cart';
  const primaryCtaUrl = settings?.primary_cta_url || '/menu';
  const navigationMenu = settings?.navigation_menu || [
    { id: 'home', label: 'Home', url: '/', order: 1 },
    { id: 'menu', label: 'Menu', url: '/menu', order: 2 },
    { id: 'support', label: 'Support', url: '/support', order: 3 }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOrderNow = () => {
    navigate(primaryCtaUrl);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleCartClick = () => {
    navigate(cartButtonUrl);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar with customizable color */}
      <div style={{ backgroundColor: headerBarColor }} className="text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>{contactPhone}</span>
              </div>
              <div className="hidden md:flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{deliveryRadiusText}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white/90 text-indigo-600">
                {orderCutoffText}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                {settings?.logo_url ? (
                  <img 
                    src={settings.logo_url} 
                    alt={businessName}
                    className="h-10 w-auto"
                  />
                ) : (
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: headerBarColor }}
                  >
                    {businessName.charAt(0)}
                  </div>
                )}
                <span className="ml-3 text-xl font-bold text-gray-900">{businessName}</span>
              </Link>
            </div>
          </div>

          {/* Desktop Menu - Dynamic */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationMenu.map((item: any, index: number) => (
                <Link 
                  key={item.id}
                  to={item.url} 
                  className={`${index === 0 ? 'text-gray-900' : 'text-gray-600'} hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Cart and CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {showCartButton && (
              <Button variant="ghost" size="sm" className="relative" onClick={handleCartClick}>
                <ShoppingCart className="h-5 w-5" />
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  style={{ backgroundColor: headerBarColor }}
                >
                  0
                </Badge>
              </Button>
            )}
            <Button 
              onClick={handleOrderNow}
              className="text-white shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                backgroundColor: primaryButtonBgColor,
                color: primaryButtonTextColor
              }}
            >
              {settings?.primary_cta_text || 'Order Now'}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 p-2 rounded-md"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Dynamic */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
            {navigationMenu.map((item: any, index: number) => (
              <button 
                key={item.id}
                onClick={() => handleNavigation(item.url)} 
                className={`${index === 0 ? 'text-gray-900' : 'text-gray-600'} hover:text-indigo-600 block px-3 py-2 text-base font-medium w-full text-left`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center space-x-4 px-3 py-2">
              {showCartButton && (
                <Button variant="ghost" size="sm" className="relative" onClick={handleCartClick}>
                  <ShoppingCart className="h-5 w-5" />
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    style={{ backgroundColor: headerBarColor }}
                  >
                    0
                  </Badge>
                </Button>
              )}
              <Button 
                onClick={handleOrderNow}
                className="flex-1 text-white"
                style={{
                  backgroundColor: primaryButtonBgColor,
                  color: primaryButtonTextColor
                }}
              >
                {settings?.primary_cta_text || 'Order Now'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
