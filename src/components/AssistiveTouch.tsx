import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Coffee, Utensils, ShoppingCart, Menu as MenuIcon, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenuCategories } from '@/hooks/useMenu';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useSmoothNavigation } from '@/hooks/useSmoothNavigation';

const AssistiveTouch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 }); // Default: bottom-right with 24px margin
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  
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

  // Handle mouse/touch drag functionality
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;
    
    // Keep button within viewport bounds
    const buttonSize = 56; // 14 * 4 = 56px (w-14 h-14)
    const maxX = window.innerWidth - buttonSize - 16; // 16px margin
    const maxY = window.innerHeight - buttonSize - 16;
    
    setPosition({
      x: Math.max(16, Math.min(maxX, newX)),
      y: Math.max(16, Math.min(maxY, newY))
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
      const handleTouchMove = (e: TouchEvent) => handleDragMove(e);
      const handleMouseUp = () => handleDragEnd();
      const handleTouchEnd = () => handleDragEnd();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragStart]);

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

  // Calculate menu position based on button position
  const getMenuPosition = () => {
    const buttonSize = 56;
    const menuWidth = 192; // min-w-48 = 12rem = 192px
    const menuHeight = 320; // max-h-80 = 20rem = 320px
    
    let menuX = position.x;
    let menuY = position.y - menuHeight - 8; // 8px gap above button
    
    // Adjust if menu would go off screen
    if (menuX + menuWidth > window.innerWidth - 16) {
      menuX = window.innerWidth - menuWidth - 16;
    }
    if (menuY < 16) {
      menuY = position.y + buttonSize + 8; // Show below button
    }
    
    return { x: menuX, y: menuY };
  };

  const menuPosition = getMenuPosition();

  return (
    <>
      {isExpanded && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Menu Content */}
          <div 
            className="fixed bg-white rounded-2xl shadow-xl border border-gray-200 p-3 min-w-48 max-h-80 overflow-y-auto z-50 animate-scale-in"
            style={{
              left: `${menuPosition.x}px`,
              top: `${menuPosition.y}px`,
            }}
          >
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
      
      <div
        ref={buttonRef}
        className="fixed z-50 cursor-move select-none"
        style={{
          right: `${position.x}px`,
          bottom: `${position.y}px`,
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <Button
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 ${
            isExpanded 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-400 hover:bg-green-500'
          } ${isDragging ? 'scale-110' : ''}`}
          onClick={(e) => {
            // Only toggle if not dragging
            if (!isDragging) {
              setIsExpanded(!isExpanded);
            }
          }}
        >
          {isExpanded ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MenuIcon className="h-6 w-6 text-white" />
          )}
        </Button>
        
        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Drag to move
          </div>
        )}
      </div>
    </>
  );
};

export default AssistiveTouch;
