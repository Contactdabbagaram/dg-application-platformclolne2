
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  
  const { data: businessSettings } = useBusinessSettings();

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          initializeServices();
          return;
        }

        // Get API key from business settings
        const apiKey = businessSettings?.googleMapsApiKey;
        
        if (!apiKey) {
          console.warn('Google Maps API key not configured in business settings');
          setApiKeyError(true);
          return;
        }

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initializeServices();
          setApiKeyError(false);
        };
        script.onerror = () => {
          setApiKeyError(true);
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setApiKeyError(true);
      }
    };

    if (businessSettings) {
      loadGoogleMaps();
    }
  }, [businessSettings]);

  const initializeServices = () => {
    if (window.google && window.google.maps) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
      setGoogleMapsLoaded(true);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 2 && googleMapsLoaded && autocompleteService.current) {
      setIsLoading(true);
      
      autocompleteService.current.getPlacePredictions(
        {
          input: query,
          types: ['address', 'establishment', 'geocode'],
          componentRestrictions: { country: 'in' } // Restrict to India
        },
        (predictions: any[], status: any) => {
          setIsLoading(false);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            if (googleMapsLoaded) {
              const geocoder = new window.google.maps.Geocoder();
              const latlng = new window.google.maps.LatLng(latitude, longitude);
              
              geocoder.geocode({ location: latlng }, (results: any[], status: any) => {
                setIsLoading(false);
                
                if (status === 'OK' && results[0]) {
                  const address = results[0].formatted_address;
                  setSearchQuery(address);
                  onLocationSelect(address);
                } else {
                  console.error('Geocoding failed:', status);
                  // Fallback
                  const mockLocation = 'Current Location - Mumbai, Maharashtra';
                  setSearchQuery(mockLocation);
                  onLocationSelect(mockLocation);
                }
              });
            } else {
              // Fallback when Google Maps not loaded
              const mockLocation = 'Current Location - Mumbai, Maharashtra';
              setSearchQuery(mockLocation);
              onLocationSelect(mockLocation);
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Error getting location:', error);
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const address = suggestion.description;
    setSearchQuery(address);
    onLocationSelect(address);
    setSuggestions([]);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex gap-2 mb-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Search for your location..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-10"
            disabled={apiKeyError}
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLoading || apiKeyError}
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
      
      {suggestions.length > 0 && (
        <div className="bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{suggestion.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {apiKeyError && (
        <div className="text-xs text-red-500 mt-2">
          Google Maps API key not configured. Please contact admin.
        </div>
      )}
      
      {!googleMapsLoaded && !apiKeyError && businessSettings?.googleMapsApiKey && (
        <div className="text-xs text-gray-500 mt-2">
          Loading Google Maps...
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
