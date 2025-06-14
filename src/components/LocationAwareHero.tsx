
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocationServices } from '@/hooks/useLocationServices';
import { CustomerLocation } from '@/utils/locationUtils';
import { MapPin, Search, Navigation, Clock, Check, X } from 'lucide-react';

interface LocationAwareHeroProps {
  onOutletSelected?: (outletId: string) => void;
  onLocationConfirmed?: (location: CustomerLocation) => void;
}

const LocationAwareHero = ({ onOutletSelected, onLocationConfirmed }: LocationAwareHeroProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOutlets, setShowOutlets] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  
  const {
    customerLocation,
    nearestOutlets,
    loading,
    error,
    getCurrentLocation,
    searchLocationByAddress,
    findNearestOutletsForLocation
  } = useLocationServices();

  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const locations = await searchLocationByAddress(searchQuery);
      if (locations.length > 0) {
        await findNearestOutletsForLocation(locations[0]);
        setShowOutlets(true);
        onLocationConfirmed?.(locations[0]);
      }
    } catch (err) {
      console.error('Location search failed:', err);
    }
  };

  const handleCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      await findNearestOutletsForLocation(location);
      setShowOutlets(true);
      onLocationConfirmed?.(location);
    } catch (err) {
      console.error('Current location failed:', err);
    }
  };

  const handleOutletSelect = (outletId: string) => {
    setSelectedOutlet(outletId);
    onOutletSelected?.(outletId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLocationSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Search */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Find Food Near You</h2>
              <p className="text-gray-600">
                Enter your location to discover nearby restaurants and check delivery availability
              </p>
            </div>
            
            <div className="flex gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Enter your address or area"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleLocationSearch} disabled={loading || !searchQuery.trim()}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>or</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCurrentLocation}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Use Current Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Location Display */}
      {customerLocation && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Location Detected</p>
                <p className="text-sm text-green-700">
                  {customerLocation.address || `${customerLocation.latitude.toFixed(4)}, ${customerLocation.longitude.toFixed(4)}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nearby Outlets */}
      {showOutlets && nearestOutlets.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Available Restaurants</h3>
          <div className="grid gap-4">
            {nearestOutlets.map((outlet) => (
              <Card 
                key={outlet.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedOutlet === outlet.id ? 'ring-2 ring-primary' : ''
                } ${!outlet.isInServiceArea ? 'opacity-60' : ''}`}
                onClick={() => outlet.isInServiceArea && handleOutletSelect(outlet.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{outlet.name}</h4>
                        {outlet.isInServiceArea ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <X className="h-3 w-3 mr-1" />
                            Out of Area
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{outlet.distance.toFixed(1)} km away</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{outlet.estimatedDeliveryTime} mins</span>
                        </div>
                      </div>

                      {!outlet.isInServiceArea && (
                        <p className="text-xs text-red-600 mt-2">
                          Outside delivery area (max {outlet.deliveryRadius}km)
                        </p>
                      )}
                    </div>
                    
                    {outlet.isInServiceArea && (
                      <Button size="sm">
                        View Menu
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Outlets Found */}
      {showOutlets && nearestOutlets.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-sm text-gray-600">
              We don't have any active restaurants in your area yet. Please try a different location.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationAwareHero;
