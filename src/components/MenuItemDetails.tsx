
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useMenuItemWithDetails } from '@/hooks/useEnhancedMenu';
import { Star, Clock, Leaf, Plus, Minus, X } from 'lucide-react';

interface MenuItemDetailsProps {
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any, quantity: number, selectedVariations: any[], selectedAddons: any[]) => void;
}

const MenuItemDetails = ({ itemId, isOpen, onClose, onAddToCart }: MenuItemDetailsProps) => {
  const { data: item, isLoading } = useMenuItemWithDetails(itemId);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<any[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<any[]>([]);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">Loading...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!item) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">Item not found</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const basePrice = item.base_price || item.price;
  const totalPrice = basePrice * quantity;

  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedVariations, selectedAddons);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {item.name}
            {item.favorite && (
              <Badge className="bg-red-500">Favorite</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img
              src={item.image_url || '/placeholder.svg'}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute top-2 right-2 flex gap-1">
              {item.is_vegetarian && (
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <Leaf className="h-3 w-3 text-white" />
                </div>
              )}
              {item.is_popular && (
                <Badge className="bg-orange-500">Popular</Badge>
              )}
            </div>
          </div>

          {/* Description and Details */}
          <div>
            <p className="text-gray-600 mb-4">{item.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{item.preparation_time || item.minimum_prep_time || 15} mins</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span>{item.rating || 4.5}</span>
              </div>
              {item.calories && (
                <span>{item.calories} calories</span>
              )}
            </div>
          </div>

          {/* Variations */}
          {item.allow_variation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose Size/Variation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Note: Variations will be empty until database schema is updated */}
                  <p className="text-sm text-gray-500">No variations available yet</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add-ons */}
          {item.allow_addon && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add-ons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Note: Add-ons will be empty until database schema is updated */}
                  <p className="text-sm text-gray-500">No add-ons available yet</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nutritional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nutritional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {item.calories && (
                  <div>
                    <span className="font-medium">Calories:</span> {item.calories}
                  </div>
                )}
                <p className="text-sm text-gray-500 col-span-2">
                  Detailed nutrition information will be available soon
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Allergens */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Allergens & Dietary Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {item.is_vegetarian && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Vegetarian
                  </Badge>
                )}
                <p className="text-sm text-gray-500 w-full mt-2">
                  Detailed allergen information will be available soon
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Quantity and Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold">₹{totalPrice}</div>
              {quantity > 1 && (
                <div className="text-sm text-gray-500">₹{basePrice} each</div>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button 
            onClick={handleAddToCart}
            className="w-full"
            size="lg"
            disabled={!item.in_stock}
          >
            {item.in_stock ? `Add ${quantity} to Cart - ₹${totalPrice}` : 'Out of Stock'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDetails;
