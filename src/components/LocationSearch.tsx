import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyASu7HI6LlX0fwcRRfkm4JUbrGtvrJ8c4c';

const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [isLoadingMaps, setIsLoadingMaps] = useState(false);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const { toast } = useToast();

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps && window.google.maps.places) {
          initializeServices();
          return;
        }

        console.log('Loading Google Maps...');
        setIsLoadingMaps(true);

        // Remove any existing Google Maps scripts
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          existingScript.remove();
        }

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
        script.async = true;
        script.defer = true;
        
        // Create global callback
        window.initGoogleMaps = () => {
          console.log('Google Maps loaded successfully');
          initializeServices();
          setIsLoadingMaps(false);
        };

        script.onerror = () => {
          console.error('Error loading Google Maps');
          toast({
            title: "Google Maps API Error",
            description: "The Google Maps API key is not properly configured. Please ensure all required APIs are enabled in the Google Cloud Console.",
            variant: "destructive",
          });
          setIsLoadingMaps(false);
        };

        // Add error handler for API authorization issues
        script.onload = () => {
          if (window.google && window.google.maps) {
            try {
              // Test if the API is properly authorized
              new window.google.maps.places.AutocompleteService();
              console.log('Google Maps loaded successfully');
              initializeServices();
            } catch (error) {
              console.error('Google Maps API authorization error:', error);
              toast({
                title: "API Configuration Error",
                description: "Please enable Places API, Geocoding API, and Maps JavaScript API in your Google Cloud Console.",
                variant: "destructive",
              });
            }
          }
          setIsLoadingMaps(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error setting up Google Maps:', error);
        toast({
          title: "Error",
          description: "Could not initialize location search. Please try again later.",
          variant: "destructive",
        });
        setIsLoadingMaps(false);
      }
    };

    loadGoogleMaps();
  }, [toast]);

  const initializeServices = () => {
    if (window.google && window.google.maps && window.google.maps.places) {
      // Initialize the Places service with a map instance
      const map = new window.google.maps.Map(document.createElement('div'));
      placesService.current = new window.google.maps.places.PlacesService(map);
      
      // Initialize Autocomplete
      const searchBox = new window.google.maps.places.SearchBox(
        document.createElement('input'),
        {
          componentRestrictions: { country: 'in' },
          types: ['geocode', 'establishment']
        }
      );
      
      autocompleteService.current = searchBox;
      setGoogleMapsLoaded(true);
      console.log('Google Maps services initialized with new Places API');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 2 && googleMapsLoaded && placesService.current) {
      setIsLoading(true);
      
      // Use textSearch instead of getPlacePredictions
      placesService.current.textSearch(
        {
          query: query,
          region: 'in'
        },
        (results: any[], status: any) => {
          setIsLoading(false);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            const suggestions = results.map(result => ({
              place_id: result.place_id,
              description: result.formatted_address || result.name
            }));
            setSuggestions(suggestions);
          } else {
            setSuggestions([]);
            if (status === "ZERO_RESULTS") {
              toast({
                title: "No results found",
                description: "Try a different search term",
                variant: "default",
              });
            }
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

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
                toast({
                  title: "Location found",
                  description: "Using your current location",
                  variant: "default",
                });
              } else {
                console.error('Geocoding failed:', status);
                toast({
                  title: "Error",
                  description: "Could not determine your location",
                  variant: "destructive",
                });
              }
            });
          } else {
            setIsLoading(false);
            toast({
              title: "Error",
              description: "Location service is not available",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error getting location:', error);
          setIsLoading(false);
          toast({
            title: "Error",
            description: "Could not get your location",
            variant: "destructive",
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: error.message || "Could not get your location",
          variant: "destructive",
        });
      }
    );
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
            disabled={isLoadingMaps}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={getCurrentLocation}
          disabled={isLoadingMaps || isLoading}
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full max-w-md bg-white rounded-md shadow-lg border mt-1">
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{suggestion.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoadingMaps && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading location service...</span>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
