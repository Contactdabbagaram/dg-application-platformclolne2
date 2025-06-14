import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import { useFrontendSettings } from '@/hooks/useFrontendSettings';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useSmoothNavigation } from '@/hooks/useSmoothNavigation';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import LocationSearch from '@/components/LocationSearch';

// Colors from the reference image and fallback if not set
const LOCATION_BAR_COLOR = "#8BC34A";  // Green - matches reference screenshot
const LOCATION_TEXT_COLOR = "#fff";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const { currentRestaurant } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { settings } = useFrontendSettings(restaurantId);
  const navigate = useNavigate();
  const { smoothNavigate } = useSmoothNavigation(navigate);

  const businessName = settings?.business_name || 'DabbaGaram';
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

  // Address to display: selected one, otherwise restaurant's, otherwise fallback
  const displayedAddress =
    selectedAddress ||
    currentRestaurant?.address ||
    'Select your pickup location';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    smoothNavigate('/login');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOrderNow = () => {
    smoothNavigate(primaryCtaUrl);
  };

  const handleNavigation = (path: string) => {
    smoothNavigate(path);
    setIsOpen(false);
  };

  const handleCartClick = () => {
    smoothNavigate(cartButtonUrl);
  };

  // ----- New: handle location select -----
  const handleLocationSelect = (location: string) => {
    setSelectedAddress(location);
    setLocationSheetOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* --- Green (location) bar at the top --- */}
      <div
        className="w-full"
        style={{
          backgroundColor: LOCATION_BAR_COLOR,
          color: LOCATION_TEXT_COLOR
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-1 text-xs sm:text-sm" style={{ minHeight: 40 }}>
          {/* Left: PICKUP AT dropdown */}
          <div className="flex items-center">
            <Sheet open={locationSheetOpen} onOpenChange={setLocationSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className="flex items-center text-white font-semibold focus:outline-none"
                  aria-label="Change pickup location"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    marginRight: '1rem'
                  }}
                  onClick={() => setLocationSheetOpen(true)}
                >
                  PICKUP AT
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </SheetTrigger>
              <SheetContent side="top" className="max-w-md w-full mx-auto">
                <SheetHeader>
                  <SheetTitle>Choose Your Pickup Location</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <LocationSearch onLocationSelect={handleLocationSelect} />
                </div>
              </SheetContent>
            </Sheet>
            {/* Show selected address - truncated if too long */}
            <span
              className="ml-2 truncate max-w-xs text-white font-medium text-sm"
              title={displayedAddress}
              style={{maxWidth: 220}}
            >
              {displayedAddress}
            </span>
          </div>
          {/* Right: Login/User --- unchanged */}
          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:text-red-200"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogin}
                className="bg-white text-black ml-2"
                style={{ color: headerBarColor, borderColor: headerBarColor }}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation */}
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
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.url)}
                  className={`${index === 0 ? 'text-gray-900' : 'text-gray-600'} hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors`}
                >
                  {item.label}
                </button>
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
            
            {/* Mobile Auth Section */}
            {user ? (
              <div className="px-3 py-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 border-t">
                <Button 
                  onClick={handleLogin}
                  variant="outline"
                  className="w-full"
                >
                  Login
                </Button>
              </div>
            )}
            
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
