
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOutlet } from '@/contexts/OutletContext';
import { MapPin, Clock, Store, Settings, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import RestaurantDropdown from './RestaurantDropdown';
import { RestaurantChangeConfirmationDialog } from './RestaurantChangeConfirmationDialog';

interface OutletDashboardProps {
  outletName: string;
  outletId: string;
}

const OutletDashboard = ({ outletName, outletId }: OutletDashboardProps) => {
  const {
    outletData,
    selectedRestaurantId,
    handleRestaurantChange,
    saving,
    storeData,
    loading: outletLoading,
    storeLoading,
    storeError,
    refetchStoreData,
    restaurant,
  } = useOutlet();
  
  // Remove manual isLinked fallback: always rely on selectedRestaurantId presence
  const isRestaurantLinked = !!selectedRestaurantId;
  const loading = outletLoading || (isRestaurantLinked && storeLoading);
  const error = storeError;
  const refetch = refetchStoreData;

  // If a link operation is in progress, show a global overlay for fast feedback
  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-spin mb-4 text-blue-500">
          <RefreshCw className="w-10 h-10" />
        </div>
        <div className="text-lg font-medium mb-2">Linking restaurant...</div>
        <div className="text-gray-600">Please wait while your outlet is being connected.</div>
      </div>
    );
  }

  console.log('OutletDashboard debug:', {
    selectedRestaurantId,
    isRestaurantLinked,
    restaurant,
    outletData: outletData ? { id: outletData.id, restaurant_id: outletData.restaurant_id } : null
  });

  if (outletLoading && !outletData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{outletName} Outlet Dashboard</h1>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Connected Restaurant</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Immediately display all data if isRestaurantLinked (even if loading refetch)
  return (
    <div className="space-y-6">
      <RestaurantChangeConfirmationDialog />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{outletName} Outlet Dashboard</h1>
          <p className="text-gray-600">
            Status:
            <Badge variant={isRestaurantLinked ? "default" : "secondary"} className="ml-2">
              {isRestaurantLinked ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Linked</>
              ) : (
                <><AlertCircle className="h-3 w-3 mr-1" /> Not Linked</>
              )}
            </Badge>
            {outletData?.petpooja_restaurant_id && (
              <>
                | PetPooja ID:
                <Badge variant="outline" className="ml-2">
                  {outletData.petpooja_restaurant_id}
                </Badge>
              </>
            )}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" disabled={loading || !isRestaurantLinked}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Restaurant Linking Card */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Connection</CardTitle>
          <p className="text-sm text-muted-foreground">
            Link this outlet to a restaurant to manage and view its data.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <Label htmlFor="restaurant-select">Select Restaurant</Label>
              <RestaurantDropdown
                value={selectedRestaurantId}
                onChange={handleRestaurantChange}
                disabled={saving || loading}
                placeholder="Choose a restaurant to link"
              />
            </div>
            {isRestaurantLinked && restaurant && (
              <div className="space-y-2">
                <Label htmlFor="restaurant-name">Linked Restaurant Name</Label>
                <Input id="restaurant-name" value={restaurant.name || ''} readOnly />
              </div>
            )}
          </div>
          {!isRestaurantLinked && !loading && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Please select a restaurant to view the full dashboard.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Always show restaurant linking card and rest of dashboard based on linkage and live context */}
      {isRestaurantLinked && (
        <>
          {loading ? (
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
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading outlet data: {error.message}</p>
              <Button onClick={() => refetch()} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{storeData?.restaurant?.total_orders || 0}</div>
                      <p className="text-sm text-gray-500">Lifetime orders processed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{storeData?.restaurant?.revenue || 0}</div>
                      <p className="text-sm text-gray-500">Total sales revenue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Avg. Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{storeData?.restaurant?.average_order_value || 0}</div>
                      <p className="text-sm text-gray-500">Average amount per order</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Satisfaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{storeData?.restaurant?.customer_satisfaction || 0}%</div>
                      <p className="text-sm text-gray-500">Positive feedback rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Restaurant and Outlet Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Restaurant Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input value={restaurant?.name || 'N/A'} readOnly />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Input value={restaurant?.status || 'N/A'} readOnly />
                        </div>
                        <div>
                          <Label>City</Label>
                          <Input value={restaurant?.city || 'N/A'} readOnly />
                        </div>
                        <div>
                          <Label>Cuisine</Label>
                          <Input value={restaurant?.cuisine || 'N/A'} readOnly />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Outlet Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Address</Label>
                          <Input value={outletData?.address || 'N/A'} readOnly />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input value={outletData?.phone || 'N/A'} readOnly />
                        </div>
                        <div>
                          <Label>Delivery Radius</Label>
                          <Input value={`${outletData?.delivery_radius_km || 0} km`} readOnly />
                        </div>
                        <div>
                          <Label>Delivery Fee</Label>
                          <Input value={`₹${outletData?.delivery_fee || 0}`} readOnly />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Data Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>Menu Items</Label>
                        <Input value={storeData?.items?.length?.toString() || '0'} readOnly />
                      </div>
                      <div>
                        <Label>Categories</Label>
                        <Input value={storeData?.categories?.length?.toString() || '0'} readOnly />
                      </div>
                      <div>
                        <Label>Taxes</Label>
                        <Input value={storeData?.taxes?.length?.toString() || '0'} readOnly />
                      </div>
                      <div>
                        <Label>Discounts</Label>
                        <Input value={storeData?.discounts?.length?.toString() || '0'} readOnly />
                      </div>
                      <div>
                        <Label>Addons</Label>
                        <Input value={storeData?.addons?.length?.toString() || '0'} readOnly />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OutletDashboard;
