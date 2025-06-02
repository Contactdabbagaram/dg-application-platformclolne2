
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Leaf, Plus } from 'lucide-react';
import { MenuItem } from '@/hooks/useMenu';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onAddToCart }: MenuItemCardProps) => {
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
        {item.is_popular && (
          <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
            Popular
          </Badge>
        )}
        {item.is_vegetarian && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded flex items-center justify-center">
            <Leaf className="h-3 w-3 text-white" />
          </div>
        )}
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
            <span>{item.preparation_time} mins</span>
          </div>
          {item.calories && (
            <span>{item.calories} cal</span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary-600">
            ₹{item.price}
          </span>
          <Button
            size="sm"
            onClick={() => onAddToCart(item)}
            className="bg-primary-500 hover:bg-primary-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
