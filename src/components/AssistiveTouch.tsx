
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Coffee, Utensils, ShoppingCart, Menu as MenuIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMenuCategories } from '@/hooks/useMenu';

const AssistiveTouch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { data: categories } = useMenuCategories();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Utensils, label: 'Menu', path: '/menu' },
    { icon: ShoppingCart, label: 'Cart', action: () => console.log('Open cart') },
    { icon: Coffee, label: 'Orders', action: () => console.log('View orders') },
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
    setIsExpanded(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/menu?category=${categoryId}`);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-lg p-3 min-w-48">
          <div className="flex flex-col gap-2">
            {/* Main Menu Items */}
            <div className="border-b pb-2 mb-2">
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-10 px-3"
                  onClick={() => handleItemClick(item)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </div>
            
            {/* Categories */}
            {categories && categories.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 px-3 mb-2">Categories</p>
                {categories.slice(0, 5).map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 px-3 text-xs"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <Button
        className="w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-600 shadow-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <MenuIcon className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default AssistiveTouch;
