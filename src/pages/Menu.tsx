
import { useState, useEffect, Suspense, useMemo } from 'react';
import MenuCategories from '@/components/MenuCategories';
import MenuItemCard from '@/components/MenuItemCard';
import LocationPicker from '@/components/LocationPicker';
import MenuSkeleton from '@/components/skeletons/MenuSkeleton';
import { useMenuItems, MenuItem, OutletWithDistance } from '@/hooks/useMenu';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { usePageTransition } from '@/contexts/PageTransitionContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MapPin, Filter } from 'lucide-react';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryImage, setCategoryImage] = useState<string>('');
  const [selectedOutlet, setSelectedOutlet] = useState<OutletWithDistance | null>(null);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);

  const { currentRestaurant } = useRestaurant();
  const { endTransition } = usePageTransition();
  
  // Fetch ALL menu items without category filter for client-side filtering
  const { data: allMenuItems, isLoading } = useMenuItems(
    undefined, // No category filter - get all items
    selectedOutlet?.restaurant_id || currentRestaurant?.id
  );

  // Client-side filtering based on selected category
  const filteredMenuItems = useMemo(() => {
    if (!allMenuItems) return [];
    if (!selectedCategory) return allMenuItems;
    return allMenuItems.filter(item => item.category_id === selectedCategory);
  }, [allMenuItems, selectedCategory]);

  // End transition when component is ready
  useEffect(() => {
    if (!isLoading) {
      endTransition();
    }
  }, [isLoading, endTransition]);

  // Check URL params for category selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  const handleCategorySelect = (categoryId: string, imageUrl: string) => {
    setSelectedCategory(categoryId || null);
    setCategoryImage(imageUrl);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (categoryId) {
      url.searchParams.set('category', categoryId);
    } else {
      url.searchParams.delete('category');
    }
    window.history.replaceState({}, '', url);
  };

  const handleAddToCart = (item: MenuItem) => {
    console.log('Adding to cart:', item);
    // TODO: Implement cart functionality
  };

  const handleOutletSelect = (outlet: OutletWithDistance) => {
    setSelectedOutlet(outlet);
    setIsLocationSheetOpen(false);
  };

  // Default category image
  const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  // Show skeleton while loading
  if (isLoading) {
    return <MenuSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Hero Section with Dynamic Category Image */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={categoryImage || defaultImage}
          alt="Menu category"
          className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {selectedCategory ? 'Category Menu' : 'Our Menu'}
            </h1>
            <p className="text-lg opacity-90">
              Delicious homestyle meals delivered fresh
            </p>
          </div>
        </div>
        
        {/* Location Button */}
        <div className="absolute top-4 left-4">
          <Sheet open={isLocationSheetOpen} onOpenChange={setIsLocationSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {selectedOutlet ? selectedOutlet.name : 'Select Location'}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-96">
              <SheetHeader>
                <SheetTitle>Choose Delivery Location</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <LocationPicker 
                  onOutletSelect={handleOutletSelect}
                  selectedOutlet={selectedOutlet}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="mb-8">
        <Suspense fallback={<div className="h-16 animate-pulse bg-gray-200 rounded-lg"></div>}>
          <MenuCategories
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            restaurantId={selectedOutlet?.restaurant_id || currentRestaurant?.id}
          />
        </Suspense>
      </div>

      {/* Outlet Info */}
      {selectedOutlet && (
        <div className="mx-4 mb-6 p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{selectedOutlet.name}</h3>
              <p className="text-sm text-gray-600">{selectedOutlet.address}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>🚚 ₹{selectedOutlet.delivery_fee} delivery</p>
              <p>⏰ {selectedOutlet.duration ? Math.round(selectedOutlet.duration) : '25-30'} mins</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="px-4">
        {filteredMenuItems && filteredMenuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">
              {selectedCategory 
                ? 'No items available in this category.' 
                : 'No menu items available at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
