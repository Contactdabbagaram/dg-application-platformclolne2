import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Coffee, Utensils, ShoppingCart, Menu as MenuIcon, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenuCategories } from '@/hooks/useMenu';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useSmoothNavigation } from '@/hooks/useSmoothNavigation';

const AssistiveTouch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: 100 }); // Start on right edge
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const buttonRef = useRef<HTMLDivElement>(null);
  const dragThreshold = 5;
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const inactivityTimer = useRef<NodeJS.Timeout>();
  
  const navigate = useNavigate();
  const location = useLocation();
  const { smoothNavigate } = useSmoothNavigation(navigate);
  const { currentRestaurant } = useRestaurant();
  const { data: categories } = useMenuCategories(currentRestaurant?.id);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Utensils, label: 'Menu', path: '/menu' },
    { icon: ShoppingCart, label: 'Cart', action: () => console.log('Open cart') },
    { icon: Coffee, label: 'Orders', action: () => console.log('View orders') },
  ];

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    setIsActive(true);
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      if (!isExpanded && !isDragging) {
        setIsActive(false);
      }
    }, 3000);
  }, [isExpanded, isDragging]);

  // Snap to nearest edge with animation
  const snapToEdge = useCallback(() => {
    const buttonSize = 56;
    const margin = 16;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Determine which edge is closer
    const distanceToLeft = position.x;
    const distanceToRight = screenWidth - position.x - buttonSize;
    const snapToLeft = distanceToLeft < distanceToRight;
    
    // Calculate snap position
    const newX = snapToLeft ? margin : screenWidth - buttonSize - margin;
    const newY = Math.max(margin, Math.min(screenHeight - buttonSize - margin, position.y));
    
    setIsAnimating(true);
    setPosition({ x: newX, y: newY });
    
    // End animation after transition
    setTimeout(() => setIsAnimating(false), 300);
  }, [position]);

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartPos.current = { x: clientX, y: clientY };
    hasMoved.current = false;
    
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y
    });
    
    setIsDragging(true);
    setIsActive(true);
    
    // Clear inactivity timer during drag
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
  };

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Check if moved beyond threshold
    const deltaX = Math.abs(clientX - dragStartPos.current.x);
    const deltaY = Math.abs(clientY - dragStartPos.current.y);
    
    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      hasMoved.current = true;
    }
    
    if (hasMoved.current) {
      const buttonSize = 56;
      const margin = 8; // Allow some overlap with edges during drag
      
      const newX = Math.max(-margin, Math.min(window.innerWidth - buttonSize + margin, clientX - dragOffset.x));
      const newY = Math.max(-margin, Math.min(window.innerHeight - buttonSize + margin, clientY - dragOffset.y));
      
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragOffset]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      if (hasMoved.current) {
        // Snap to edge after drag
        requestAnimationFrame(() => {
          snapToEdge();
        });
      }
      
      resetInactivityTimer();
    }
  }, [isDragging, snapToEdge, resetInactivityTimer]);

  // Global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        handleDragMove(e);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchend', handleDragEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      snapToEdge();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [snapToEdge]);

  // Initialize inactivity timer
  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [resetInactivityTimer]);

  // Handle button click (only if not dragged)
  const handleButtonClick = () => {
    if (!hasMoved.current) {
      setIsExpanded(!isExpanded);
      resetInactivityTimer();
    }
  };

  const handleItemClick = (item: typeof menuItems[0]) => {
    if (item.path) {
      if (location.pathname !== item.path) {
        smoothNavigate(item.path);
      }
    } else if (item.action) {
      item.action();
    }
    setIsExpanded(false);
    resetInactivityTimer();
  };

  const handleCategoryClick = (categoryId: string) => {
    const targetPath = `/menu?category=${categoryId}`;
    if (location.pathname + location.search !== targetPath) {
      smoothNavigate(targetPath);
    }
    setIsExpanded(false);
    resetInactivityTimer();
  };

  // Calculate menu position
  const getMenuPosition = () => {
    const buttonSize = 56;
    const menuWidth = 192;
    const menuHeight = 320;
    const gap = 8;
    
    let menuX = position.x;
    let menuY = position.y - menuHeight - gap;
    
    // Adjust horizontal position
    if (menuX + menuWidth > window.innerWidth - 16) {
      menuX = window.innerWidth - menuWidth - 16;
    }
    if (menuX < 16) {
      menuX = 16;
    }
    
    // Adjust vertical position
    if (menuY < 16) {
      menuY = position.y + buttonSize + gap;
    }
    
    return { x: menuX, y: menuY };
  };

  const menuPosition = getMenuPosition();

  return (
    <>
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => {
              setIsExpanded(false);
              resetInactivityTimer();
            }}
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
                  onClick={() => {
                    setIsExpanded(false);
                    resetInactivityTimer();
                  }}
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
              
              {/* Categories */}
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
      
      {/* Floating Button */}
      <div
        ref={buttonRef}
        className={`fixed z-50 select-none touch-none transition-all duration-300 ${
          isAnimating ? 'transition-all duration-300 ease-out' : ''
        } ${isDragging ? 'z-[60]' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isActive || isExpanded || isDragging ? 1 : 0.6,
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <Button
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 touch-none ${
            isExpanded 
              ? 'bg-red-500 hover:bg-red-600 scale-110' 
              : 'bg-green-400 hover:bg-green-500'
          } ${isDragging ? 'scale-110 shadow-xl' : ''} ${
            !isActive && !isExpanded && !isDragging ? 'shadow-md' : 'shadow-lg'
          }`}
          onClick={handleButtonClick}
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={resetInactivityTimer}
        >
          {isExpanded ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MenuIcon className="h-6 w-6 text-white" />
          )}
        </Button>
        
        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
            Drag to move
          </div>
        )}
      </div>
    </>
  );
};

export default AssistiveTouch;
