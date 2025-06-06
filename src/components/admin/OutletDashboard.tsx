
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStoreData } from '@/hooks/useStoreData';
import { MapPin, Clock, Phone, Mail, Store, Settings, RefreshCw } from 'lucide-react';

interface OutletDashboardProps {
  outletName: string;
}

const OutletDashboard = ({ outletName }: OutletDashboardProps) => {
  // Map outlet names to restaurant IDs
  const getRestaurantId = (outletName: string) => {
    const mapping = {
      'Airoli': '00000000-0000-0000-0000-000000000001',
      'Andheri (W)': '00000000-0000-0000-0000-000000000002',
      'Bandra': '00000000-0000-0000-0000-000000000003',
    };
    return mapping[outletName] || '00000000-0000-0000-0000-000000000001';
  };

  const restaurantId = getRestaurantId(outletName);
  const { storeData, loading, error, refetch } = useStoreData(restaurantId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading outlet data: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const restaurant = storeData?.restaurant;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{outletName} Outlet Dashboard</h1>
          <p className="text-gray-600">
            Restaurant ID: {restaurantId} | Status: 
            <Badge variant={restaurant?.status === 'active' ? 'default' : 'secondary'} className="ml-2">
              {restaurant?.status || 'Unknown'}
            </Badge>
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menu Categories</p>
                <p className="text-2xl font-bold">{storeData?.categories?.length || 0}</p>
              </div>
              <Store className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menu Items</p>
                <p className="text-2xl font-bold">{storeData?.items?.length || 0}</p>
              </div>
              <Settings className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tax Configurations</p>
                <p className="text-2xl font-bold">{storeData?.taxes?.length || 0}</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Discounts</p>
                <p className="text-2xl font-bold">{storeData?.discounts?.length || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restaurant Details */}
      {restaurant && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Restaurant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span>
                  <p className="text-gray-600">{restaurant.name}</p>
                </div>
                <div>
                  <span className="font-medium">City:</span>
                  <p className="text-gray-600">{restaurant.city || 'Not set'}</p>
                </div>
                <div>
                  <span className="font-medium">State:</span>
                  <p className="text-gray-600">{restaurant.state || 'Not set'}</p>
                </div>
                <div>
                  <span className="font-medium">Country:</span>
                  <p className="text-gray-600">{restaurant.country || 'India'}</p>
                </div>
                <div>
                  <span className="font-medium">Currency:</span>
                  <p className="text-gray-600">{restaurant.currency_symbol || '₹'}</p>
                </div>
                <div>
                  <span className="font-medium">Petpooja ID:</span>
                  <p className="text-gray-600">{restaurant.petpooja_restaurant_id || 'Not configured'}</p>
                </div>
              </div>
              
              {restaurant.address && (
                <div>
                  <span className="font-medium">Address:</span>
                  <p className="text-gray-600 mt-1">{restaurant.address}</p>
                </div>
              )}

              {restaurant.contact_information && (
                <div>
                  <span className="font-medium">Contact:</span>
                  <p className="text-gray-600 mt-1">{restaurant.contact_information}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Operational Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Min Order Amount:</span>
                  <p className="text-gray-600">{restaurant.currency_symbol}{restaurant.minimum_order_amount || 0}</p>
                </div>
                <div>
                  <span className="font-medium">Delivery Charge:</span>
                  <p className="text-gray-600">{restaurant.currency_symbol}{restaurant.delivery_charge || 0}</p>
                </div>
                <div>
                  <span className="font-medium">Min Prep Time:</span>
                  <p className="text-gray-600">{restaurant.minimum_prep_time || 30} mins</p>
                </div>
                <div>
                  <span className="font-medium">Min Delivery Time:</span>
                  <p className="text-gray-600">{restaurant.minimum_delivery_time || 'Not set'}</p>
                </div>
                <div>
                  <span className="font-medium">Packaging Charge:</span>
                  <p className="text-gray-600">{restaurant.currency_symbol}{restaurant.packaging_charge || 0}</p>
                </div>
                <div>
                  <span className="font-medium">Service Charge:</span>
                  <p className="text-gray-600">
                    {restaurant.service_charge_value ? 
                      `${restaurant.currency_symbol}${restaurant.service_charge_value}` : 
                      'Not configured'
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tax on Delivery:</span>
                  <Badge variant={restaurant.calculate_tax_on_delivery ? 'default' : 'secondary'}>
                    {restaurant.calculate_tax_on_delivery ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tax on Packing:</span>
                  <Badge variant={restaurant.calculate_tax_on_packing ? 'default' : 'secondary'}>
                    {restaurant.calculate_tax_on_packing ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tax on Service:</span>
                  <Badge variant={restaurant.tax_on_service_charge ? 'default' : 'secondary'}>
                    {restaurant.tax_on_service_charge ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>

              {restaurant.latitude && restaurant.longitude && (
                <div>
                  <span className="font-medium">Location:</span>
                  <p className="text-gray-600 mt-1">
                    {restaurant.latitude.toFixed(6)}, {restaurant.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Menu Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Categories:</span>
                <span className="font-medium">
                  {storeData?.categories?.filter(cat => cat.is_active).length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Available Items:</span>
                <span className="font-medium">
                  {storeData?.items?.filter(item => item.status === 'available').length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Item Variations:</span>
                <span className="font-medium">{storeData?.variations?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Addon Groups:</span>
                <span className="font-medium">{storeData?.addons?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Taxes:</span>
                <span className="font-medium">{storeData?.taxes?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Taxes:</span>
                <span className="font-medium">
                  {storeData?.taxes?.filter(tax => tax.is_active).length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Tax Rate:</span>
                <span className="font-medium">
                  {storeData?.taxes?.length ? 
                    (storeData.taxes.reduce((sum, tax) => sum + tax.tax_rate, 0) / storeData.taxes.length).toFixed(1) + '%' : 
                    '0%'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Discounts:</span>
                <span className="font-medium">{storeData?.discounts?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Discounts:</span>
                <span className="font-medium">
                  {storeData?.discounts?.filter(discount => discount.is_active).length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Order Types:</span>
                <span className="font-medium">{storeData?.orderTypes?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OutletDashboard;
