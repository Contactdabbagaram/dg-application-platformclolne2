
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, CheckCircle } from 'lucide-react';
import LocationSearch from './LocationSearch';
import { useNearestOutlets, OutletWithDistance } from '@/hooks/useMenu';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';

interface LocationPickerProps {
  onOutletSelect: (outlet: OutletWithDistance) => void;
  selectedOutlet?: OutletWithDistance;
}

declare global {
  interface Window {
    google: any;
  }
}

const LocationPicker = ({ onOutletSelect, selectedOutlet }: LocationPickerProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [outletsWithDistance, setOutletsWithDistance] = useState<OutletWithDistance[]>([]);
  const distanceService = useRef<any>(null);

  const { data: outlets, isLoading } = useNearestOutlets(
    userLocation?.lat,
    userLocation?.lng
  );
  
  const { data: businessSettings } = useBusinessSettings();

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        if (window.google && window.google.maps) {
          initializeServices();
          return;
        }

        const apiKey = businessSettings?.googleMapsApiKey;
        
        if (!apiKey) {
          console.warn('Google Maps API key not configured');
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initializeServices();
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    if (businessSettings) {
      loadGoogleMaps();
    }
  }, [businessSettings]);

  const initializeServices = () => {
    if (window.google && window.google.maps) {
      distanceService.current = new window.google.maps.DistanceMatrixService();
      setGoogleMapsLoaded(true);
    }
  };

  // Calculate distances when user location and outlets change
  useEffect(() => {
    if (userLocation && outlets && googleMapsLoaded && distanceService.current) {
      calculateDistances();
    } else if (userLocation && outlets && !googleMapsLoaded) {
      // Fallback to direct distance calculation if Google Maps not loaded
      const outletsWithDirectDistance = outlets.map(outlet => ({
        ...outlet,
        distance: calculateDirectDistance(userLocation, {
          lat: outlet.latitude,
          lng: outlet.longitude
        }),
        duration: Math.round(calculateDirectDistance(userLocation, {
          lat: outlet.latitude,
          lng: outlet.longitude
        }) * 3) // Approximate 3 minutes per km
      }));
      outletsWithDirectDistance.sort((a, b) => a.distance - b.distance);
      setOutletsWithDistance(outletsWithDirectDistance);
    }
  }, [userLocation, outlets, googleMapsLoaded]);

  const calculateDistances = () => {
    if (!userLocation || !outlets || !distanceService.current) return;

    const origins = [new window.google.maps.LatLng(userLocation.lat, userLocation.lng)];
    const destinations = outlets.map(outlet => 
      new window.google.maps.LatLng(outlet.latitude, outlet.longitude)
    );

    distanceService.current.getDistanceMatrix({
      origins: origins,
      destinations: destinations,
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, (response: any, status: any) => {
      if (status === 'OK') {
        const results = response.rows[0].elements;
        const outletsWithCalculatedDistance = outlets.map((outlet, index) => {
          const element = results[index];
          if (element.status === 'OK') {
            return {
              ...outlet,
              distance: element.distance.value / 1000, // Convert to km
              duration: element.duration.value / 60 // Convert to minutes
            };
          } else {
            // Fallback to direct distance calculation
            return {
              ...outlet,
              distance: calculateDirectDistance(userLocation, {
                lat: outlet.latitude,
                lng: outlet.longitude
              }),
              duration: Math.round(calculateDirectDistance(userLocation, {
                lat: outlet.latitude,
                lng: outlet.longitude
              }) * 3)
            };
          }
        });
        
        // Sort by distance
        outletsWithCalculatedDistance.sort((a, b) => a.distance - b.distance);
        setOutletsWithDistance(outletsWithCalculatedDistance);
      } else {
        console.error('Distance calculation failed:', status);
        // Fallback to direct distance
        const outletsWithDirectDistance = outlets.map(outlet => ({
          ...outlet,
          distance: calculateDirectDistance(userLocation, {
            lat: outlet.latitude,
            lng: outlet.longitude
          }),
          duration: Math.round(calculateDirectDistance(userLocation, {
            lat: outlet.latitude,
            lng: outlet.longitude
          }) * 3)
        }));
        outletsWithDirectDistance.sort((a, b) => a.distance - b.distance);
        setOutletsWithDistance(outletsWithDirectDistance);
      }
    });
  };

  const calculateDirectDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleLocationSelect = async (location: string) => {
    setSelectedLocation(location);
    
    if (googleMapsLoaded) {
      // Geocode the location to get coordinates
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address: location }, (results: any[], status: any) => {
        if (status === 'OK' && results[0]) {
          const coords = results[0].geometry.location;
          setUserLocation({
            lat: coords.lat(),
            lng: coords.lng()
          });
        } else {
          console.error('Geocoding failed:', status);
          // Fallback to Mumbai coordinates
          setUserLocation({ lat: 19.0760, lng: 72.8777 });
        }
      });
    } else {
      // Fallback to Mumbai coordinates
      setUserLocation({ lat: 19.0760, lng: 72.8777 });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setSelectedLocation('Current Location');
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Mumbai
          setUserLocation({ lat: 19.0760, lng: 72.8777 });
          setSelectedLocation('Mumbai, Maharashtra');
        }
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const displayOutlets = outletsWithDistance.length > 0 ? outletsWithDistance : (outlets || []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary-500" />
        <span className="font-medium">Select Delivery Location</span>
      </div>

      <LocationSearch onLocationSelect={handleLocationSelect} />

      {selectedLocation && (
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Selected: </span>
          {selectedLocation}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Finding nearby outlets...</p>
        </div>
      )}

      {displayOutlets && displayOutlets.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Available Outlets</h4>
          {displayOutlets.map((outlet) => (
            <Card 
              key={outlet.id} 
              className={`cursor-pointer transition-all ${
                selectedOutlet?.id === outlet.id 
                  ? 'ring-2 ring-primary-500 bg-primary-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => onOutletSelect(outlet)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium">{outlet.name}</h5>
                      {selectedOutlet?.id === outlet.id && (
                        <CheckCircle className="h-4 w-4 text-primary-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{outlet.address}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📍 {outlet.distance?.toFixed(1) || '5.0'} km away</span>
                      <span>🚚 ₹{outlet.delivery_fee} delivery</span>
                      <span>⏰ {outlet.duration ? Math.round(outlet.duration) : '25-30'} mins</span>
                    </div>
                  </div>
                  {(outlet.distance || 5) <= 2 && (
                    <Badge variant="secondary" className="text-xs">
                      Express
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {displayOutlets && displayOutlets.length === 0 && userLocation && (
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">No outlets nearby</h4>
            <p className="text-sm text-gray-600 mb-4">
              We don't deliver to this location yet. Try searching for a different area.
            </p>
            <Button variant="outline" onClick={getCurrentLocation}>
              <Navigation className="h-4 w-4 mr-2" />
              Use Current Location
            </Button>
          </CardContent>
        </Card>
      )}

      {!googleMapsLoaded && businessSettings?.googleMapsApiKey && (
        <div className="text-xs text-gray-500 text-center py-2">
          Loading Google Maps services...
        </div>
      )}
      
      {!businessSettings?.googleMapsApiKey && (
        <div className="text-xs text-orange-500 text-center py-2">
          Google Maps API not configured. Using fallback location search.
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
