
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, Calendar, Clock } from 'lucide-react';

interface Discount {
  id: string;
  discount_name: string;
  discount_type: number;
  discount_value: number;
  is_active: boolean;
  petpooja_discount_id: string;
  on_total: boolean;
  starts_at?: string;
  ends_at?: string;
  time_from?: string;
  time_to?: string;
  min_amount?: number;
  max_amount?: number;
  has_coupon: boolean;
  max_limit?: number;
  applicable_on?: string;
  order_types?: string;
  discount_days?: string;
}

interface StoreDiscountDataProps {
  discounts: Discount[];
  loading: boolean;
}

const StoreDiscountData = ({ discounts, loading }: StoreDiscountDataProps) => {
  if (loading) {
    return <div className="text-center py-8">Loading discount data...</div>;
  }

  const activeDiscounts = discounts.filter(discount => discount.is_active);

  const getDiscountTypeLabel = (type: number) => {
    switch (type) {
      case 1: return 'Percentage';
      case 2: return 'Fixed Amount';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not set';
    return timeString;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Tag className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{discounts.length}</div>
            <div className="text-sm text-gray-600">Total Discounts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Tag className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <div className="text-2xl font-bold">{activeDiscounts.length}</div>
            <div className="text-sm text-gray-600">Active Discounts</div>
          </CardContent>
        </Card>
      </div>

      {discounts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Discount Data</h3>
            <p className="text-gray-500">No discount configurations found. Sync data from Petpooja to view discount settings.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discounts.map((discount) => (
            <Card key={discount.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{discount.discount_name}</span>
                  <Badge variant={discount.is_active ? "default" : "secondary"}>
                    {discount.is_active ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Type:</span>
                  </div>
                  <div>
                    {getDiscountTypeLabel(discount.discount_type)}
                  </div>
                  
                  <div>
                    <span className="font-medium">Value:</span>
                  </div>
                  <div>
                    {discount.discount_type === 1 ? `${discount.discount_value}%` : `₹${discount.discount_value}`}
                  </div>
                  
                  <div>
                    <span className="font-medium">Applied On:</span>
                  </div>
                  <div>
                    {discount.on_total ? 'Total Amount' : 'Item Amount'}
                  </div>
                  
                  <div>
                    <span className="font-medium">Petpooja ID:</span>
                  </div>
                  <div>
                    {discount.petpooja_discount_id}
                  </div>
                </div>

                {(discount.starts_at || discount.ends_at) && (
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium text-sm">Validity Period</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div>Start: {formatDate(discount.starts_at)}</div>
                      <div>End: {formatDate(discount.ends_at)}</div>
                    </div>
                  </div>
                )}

                {(discount.time_from || discount.time_to) && (
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium text-sm">Time Restrictions</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div>From: {formatTime(discount.time_from)}</div>
                      <div>To: {formatTime(discount.time_to)}</div>
                    </div>
                  </div>
                )}

                {(discount.min_amount || discount.max_amount) && (
                  <div className="border-t pt-3">
                    <div className="text-sm space-y-1">
                      {discount.min_amount && (
                        <div>Min Amount: ₹{discount.min_amount}</div>
                      )}
                      {discount.max_amount && (
                        <div>Max Amount: ₹{discount.max_amount}</div>
                      )}
                      {discount.max_limit && (
                        <div>Max Limit: ₹{discount.max_limit}</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 pt-2">
                  {discount.has_coupon && (
                    <Badge variant="outline" className="text-xs">
                      Coupon Required
                    </Badge>
                  )}
                  {discount.applicable_on && (
                    <Badge variant="outline" className="text-xs">
                      {discount.applicable_on}
                    </Badge>
                  )}
                  {discount.order_types && (
                    <Badge variant="outline" className="text-xs">
                      {discount.order_types}
                    </Badge>
                  )}
                  {discount.discount_days && (
                    <Badge variant="outline" className="text-xs">
                      {discount.discount_days}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreDiscountData;
