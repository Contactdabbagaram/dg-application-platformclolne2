
import { Card, CardContent } from '@/components/ui/card';
import { useSupportCategories } from '@/hooks/useSupportCategories';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface SupportCategoriesProps {
  onCategorySelect: (categoryId: string, categoryName: string) => void;
}

const SupportCategories = ({ onCategorySelect }: SupportCategoriesProps) => {
  const { currentRestaurant, loading: restaurantLoading } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { data: categories, isLoading } = useSupportCategories(restaurantId);

  if (restaurantLoading || isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 text-sm">No restaurant context available.</p>
        <p className="text-xs text-gray-500 mt-1">Please ensure you're logged in properly.</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    // Default categories when none are configured
    const defaultCategories = [
      {
        id: 'order-issue',
        name: 'Order Issues',
        description: 'Problems with your current order',
        icon: 'AlertCircle',
        color: 'border-red-200 hover:border-red-300 hover:bg-red-50',
        accent_color: 'bg-red-500',
        is_urgent: true
      },
      {
        id: 'delivery-delay',
        name: 'Delivery Delay',
        description: 'Your order is running late',
        icon: 'Clock',
        color: 'border-orange-200 hover:border-orange-300 hover:bg-orange-50',
        accent_color: 'bg-orange-500',
        is_urgent: true
      },
      {
        id: 'payment',
        name: 'Payment & Billing',
        description: 'Payment issues or refund requests',
        icon: 'CreditCard',
        color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50',
        accent_color: 'bg-blue-500',
        is_urgent: false
      },
      {
        id: 'feedback',
        name: 'Feedback',
        description: 'Share your experience with us',
        icon: 'MessageSquare',
        color: 'border-green-200 hover:border-green-300 hover:bg-green-50',
        accent_color: 'bg-green-500',
        is_urgent: false
      },
      {
        id: 'track-order',
        name: 'Track Order',
        description: 'Check your order status',
        icon: 'MapPin',
        color: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50',
        accent_color: 'bg-purple-500',
        is_urgent: false
      },
      {
        id: 'general',
        name: 'General Inquiry',
        description: 'Other questions or concerns',
        icon: 'HelpCircle',
        color: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
        accent_color: 'bg-gray-500',
        is_urgent: false
      }
    ];

    return (
      <div className="space-y-3">
        {defaultCategories.map((category) => {
          const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.HelpCircle;
          
          return (
            <Card 
              key={category.id} 
              className={`cursor-pointer transition-all duration-200 border-2 ${category.color}`}
              onClick={() => onCategorySelect(category.id, category.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.accent_color}`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm text-gray-800 truncate">{category.name}</h3>
                      {category.is_urgent && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 flex-shrink-0">
                          Urgent
                        </span>
                      )}
                    </div>
                    {category.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">{category.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => {
        const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.HelpCircle;
        
        return (
          <Card 
            key={category.id} 
            className={`cursor-pointer transition-all duration-200 border-2 ${category.color || 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
            onClick={() => onCategorySelect(category.id, category.name)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${category.accent_color || 'bg-gray-500'}`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm text-gray-800 truncate">{category.name}</h3>
                    {category.is_urgent && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 flex-shrink-0">
                        Urgent
                      </span>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{category.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SupportCategories;
