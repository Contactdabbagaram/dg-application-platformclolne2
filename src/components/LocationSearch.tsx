
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
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
  const [isLoadingMaps, setIsLoadingMaps] = useState(false);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  
  const { data: businessSettings, isLoading: settingsLoading } = useBusinessSettings();

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps && window.google.maps.places) {
          initializeServices();
          return;
        }

        // Get API key from business settings
        const apiKey = businessSettings?.googleMapsApiKey;
        
        if (!apiKey || apiKey.trim() === '') {
          console.warn('Google Maps API key not configured in business settings');
          setApiKeyError(true);
          setIsLoadingMaps(false);
          return;
        }

        console.log('Loading Google Maps with API key...');
        setIsLoadingMaps(true);
        setApiKeyError(false);

        // Remove any existing Google Maps scripts
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          existingScript.remove();
        }

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;
        
        // Create global callback
        (window as any).initGoogleMaps = () => {
          console.log('Google Maps loaded successfully');
          initializeServices();
          setIsLoadingMaps(false);
        };

        script.onerror = (error) => {
          console.error('Error loading Google Maps:', error);
          setApiKeyError(true);
          setIsLoadingMaps(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error setting up Google Maps:', error);
        setApiKeyError(true);
        setIsLoadingMaps(false);
      }
    };

    if (businessSettings && !settingsLoading) {
      loadGoogleMaps();
    }
  }, [businessSettings, settingsLoading]);

  const initializeServices = () => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
      setGoogleMapsLoaded(true);
      console.log('Google Maps services initialized');
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
            console.log('Found predictions:', predictions.length);
          } else {
            setSuggestions([]);
            console.log('No predictions found, status:', status);
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
            
            if (googleMapsLoaded && window.google.maps.Geocoder) {
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

  const hasApiKey = businessSettings?.googleMapsApiKey && businessSettings.googleMapsApiKey.trim() !== '';

  return (
    <div className="w-full max-w-md">
      <div className="flex gap-2 mb-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Search for your location..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-10"
            disabled={!hasApiKey && googleMapsLoaded}
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLoading}
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
      
      {suggestions.length > 0 && (
        <div className="bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto z-50 relative">
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
      
      {!hasApiKey && (
        <div className="flex items-center gap-2 text-xs text-orange-600 mt-2 p-2 bg-orange-50 rounded border border-orange-200">
          <AlertCircle className="h-4 w-4" />
          <span>
            Google Maps API not configured. Using fallback search. Contact admin for better experience.
          </span>
        </div>
      )}
      
      {isLoadingMaps && hasApiKey && (
        <div className="text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded border border-blue-200">
          Loading Google Maps services...
        </div>
      )}

      {apiKeyError && hasApiKey && (
        <div className="flex items-center gap-2 text-xs text-red-600 mt-2 p-2 bg-red-50 rounded border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <span>
            Google Maps API error. Please check your API key configuration.
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
