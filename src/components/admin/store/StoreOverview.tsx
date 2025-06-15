import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, MapPin, Clock, Phone, Mail, RefreshCw } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  address?: string;
  contact_information?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  petpooja_restaurant_id?: string;
  currency_symbol?: string;
  country?: string;
  city?: string;
  state?: string;
  minimum_order_amount?: number;
  minimum_prep_time?: number;
  delivery_charge?: number;
}

interface StoreOverviewProps {
  restaurant?: Restaurant;
  loading: boolean;
  onRefresh: () => void;
}

const StoreOverview = ({ restaurant, loading, onRefresh }: StoreOverviewProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!restaurant) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Restaurant Data</h3>
          <p className="text-gray-500 mb-4">No restaurant is linked to this outlet. Please link a restaurant to view data.</p>
          <Button onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Restaurant Overview</h2>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Name:</span> {restaurant.name || 'Not set'}
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <Badge variant={restaurant.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                {restaurant.status || 'Unknown'}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Petpooja ID:</span> {restaurant.petpooja_restaurant_id || 'Not set'}
            </div>
            <div>
              <span className="font-medium">Currency:</span> {restaurant.currency_symbol || 'Not set'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Address:</span> {restaurant.address || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">City:</span> {restaurant.city || 'Not set'}
            </div>
            <div>
              <span className="font-medium">State:</span> {restaurant.state || 'Not set'}
            </div>
            <div>
              <span className="font-medium">Country:</span> {restaurant.country || 'Not set'}
            </div>
            {restaurant.latitude && restaurant.longitude && (
              <div>
                <span className="font-medium">Coordinates:</span> {restaurant.latitude.toFixed(4)}, {restaurant.longitude.toFixed(4)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operational Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Min Order Amount:</span> {restaurant.currency_symbol || ''}{restaurant.minimum_order_amount || 'Not set'}
            </div>
            <div>
              <span className="font-medium">Min Prep Time:</span> {restaurant.minimum_prep_time ? `${restaurant.minimum_prep_time} mins` : 'Not set'}
            </div>
            <div>
              <span className="font-medium">Delivery Charge:</span> {restaurant.currency_symbol || ''}{restaurant.delivery_charge || 'Not set'}
            </div>
          </CardContent>
        </Card>

        {restaurant.contact_information && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{restaurant.contact_information}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StoreOverview;
