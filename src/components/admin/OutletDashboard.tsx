import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOutlet } from '@/contexts/OutletContext';
import { MapPin, Clock, Store, Settings, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import RestaurantDropdown from './RestaurantDropdown';

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
            // ... keep existing code displaying actual dashboard, pure context-driven ...
            // ... (Key Metrics, Restaurant and Outlet Details, Data Summary) ...
            // ... keep existing code for these dashboard sections ...
            <>
              {/* ... keep existing dashboard UI, nothing removed except blocking fallbacks ... */}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OutletDashboard;
