
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Coffee, Utensils, ShoppingCart, Menu as MenuIcon, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenuCategories } from '@/hooks/useMenu';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useSmoothNavigation } from '@/hooks/useSmoothNavigation';

const AssistiveTouch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { smoothNavigate } = useSmoothNavigation();
  const { currentRestaurant } = useRestaurant();
  const { data: categories } = useMenuCategories(currentRestaurant?.id);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Utensils, label: 'Menu', path: '/menu' },
    { icon: ShoppingCart, label: 'Cart', action: () => console.log('Open cart') },
    { icon: Coffee, label: 'Orders', action: () => console.log('View orders') },
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    if (item.path) {
      // Use smooth navigation for better UX
      if (location.pathname !== item.path) {
        smoothNavigate(item.path);
      }
    } else if (item.action) {
      item.action();
    }
    setIsExpanded(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    const targetPath = `/menu?category=${categoryId}`;
    if (location.pathname + location.search !== targetPath) {
      smoothNavigate(targetPath);
    }
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {isExpanded && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Menu Content */}
          <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 min-w-48 max-h-80 overflow-y-auto z-50 animate-scale-in">
            <div className="flex flex-col gap-2">
              {/* Close button */}
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium text-gray-700">Quick Actions</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Main Menu Items */}
              <div className="border-b pb-2 mb-2">
                {menuItems.map((item, index) => {
                  const isCurrentPage = item.path && location.pathname === item.path;
                  return (
                    <Button
                      key={index}
                      variant={isCurrentPage ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start h-10 px-3"
                      onClick={() => handleItemClick(item)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
              
              {/* Categories - Only show if we have categories from the database */}
              {categories && categories.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 px-3 mb-2">Categories</p>
                  <div className="max-h-32 overflow-y-auto">
                    {categories.slice(0, 8).map((category) => {
                      const isCurrentCategory = location.search.includes(`category=${category.id}`);
                      return (
                        <Button
                          key={category.id}
                          variant={isCurrentCategory ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start h-8 px-3 text-xs mb-1"
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          {category.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      <Button
        className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 ${
          isExpanded 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-primary hover:bg-primary/90'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <X className="h-5 w-5" />
        ) : (
          <MenuIcon className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default AssistiveTouch;
