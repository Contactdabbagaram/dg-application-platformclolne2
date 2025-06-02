
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Leaf, Plus, Info } from 'lucide-react';
import { EnhancedMenuItem } from '@/hooks/useEnhancedMenu';

interface EnhancedMenuItemCardProps {
  item: EnhancedMenuItem;
  onAddToCart: (item: EnhancedMenuItem) => void;
  onViewDetails: (item: EnhancedMenuItem) => void;
}

const EnhancedMenuItemCard = ({ item, onAddToCart, onViewDetails }: EnhancedMenuItemCardProps) => {
  const displayPrice = item.base_price || item.price;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <img
          src={item.image_url || '/placeholder.svg'}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {item.is_popular && (
            <Badge className="bg-orange-500 hover:bg-orange-600">
              Popular
            </Badge>
          )}
          {item.favorite && (
            <Badge className="bg-red-500 hover:bg-red-600">
              Favorite
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          {item.is_vegetarian && (
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <Leaf className="h-3 w-3 text-white" />
            </div>
          )}
          {!item.in_stock && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
          <div className="flex items-center gap-1 text-sm text-yellow-600">
            <Star className="h-4 w-4 fill-current" />
            <span>{item.rating || 4.5}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{item.preparation_time || item.minimum_prep_time || 15} mins</span>
          </div>
          {item.calories && (
            <span>{item.calories} cal</span>
          )}
          {item.packing_charges > 0 && (
            <span>+₹{item.packing_charges} packing</span>
          )}
        </div>

        {/* Tags */}
        {item.variation_group_name && (
          <div className="mb-3">
            <Badge variant="outline" className="text-xs">
              {item.variation_group_name}
            </Badge>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-primary-600">
              ₹{displayPrice}
            </span>
            {item.allow_variation && (
              <span className="text-sm text-gray-500 ml-1">onwards</span>
            )}
          </div>
          <div className="flex gap-2">
            {(item.allow_addon || item.allow_variation) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(item)}
                disabled={!item.in_stock}
              >
                <Info className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => onAddToCart(item)}
              className="bg-primary-500 hover:bg-primary-600"
              disabled={!item.in_stock}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Additional indicators */}
        <div className="mt-2 flex gap-1 text-xs">
          {item.allow_addon && (
            <Badge variant="secondary" className="text-xs">Customizable</Badge>
          )}
          {item.ignore_taxes && (
            <Badge variant="outline" className="text-xs">Tax Free</Badge>
          )}
          {item.ignore_discounts && (
            <Badge variant="outline" className="text-xs">No Discounts</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMenuItemCard;
