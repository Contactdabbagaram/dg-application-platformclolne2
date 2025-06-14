import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [isLoadingMapsScript, setIsLoadingMapsScript] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(null);
  
  const { toast } = useToast();
  const { data: businessSettings, isLoading: isLoadingSettings } = useBusinessSettings();

  useEffect(() => {
    if (businessSettings?.googleMapsApiKey) {
      setApiKey(businessSettings.googleMapsApiKey);
    } else if (!isLoadingSettings && !businessSettings?.googleMapsApiKey) {
      console.warn('Google Maps API Key is not configured in business settings.');
      setIsLoadingMapsScript(false);
    }
  }, [businessSettings, isLoadingSettings]);

  useEffect(() => {
    if (!apiKey) {
      if (!isLoadingSettings) {
        setIsLoadingMapsScript(false);
      }
      return;
    }

    const loadGoogleMaps = async () => {
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          initializeServices();
          setIsLoadingMapsScript(false);
          return;
        }

        console.log('Loading Google Maps with key:', apiKey ? '******' : 'undefined');
        setIsLoadingMapsScript(true);

        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          existingScript.remove();
          console.log('Removed existing Google Maps script.');
        }

        const callbackName = `initGoogleMaps_${Date.now()}`;
        window[callbackName] = () => {
          console.log('Google Maps loaded via dynamic callback');
          initializeServices();
          setIsLoadingMapsScript(false);
          delete window[callbackName];
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&callback=${callbackName}`;
        script.async = true;
        script.onerror = () => {
          console.error('Error loading Google Maps script');
          toast({
            title: "Google Maps API Error",
            description: "Could not load the Google Maps script. Please check your internet connection and API key configuration.",
            variant: "destructive",
          });
          setIsLoadingMapsScript(false);
          delete window[callbackName];
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error setting up Google Maps:', error);
        toast({
          title: "Error",
          description: "Could not initialize location search. Please try again later.",
          variant: "destructive",
        });
        setIsLoadingMapsScript(false);
      }
    };

    loadGoogleMaps();
    
    return () => {
      // const scriptToRemove = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js?key=${apiKey}"]`);
      // if (scriptToRemove) {
      //     scriptToRemove.remove();
      //     console.log('Cleaned up Google Maps script.');
      // }
      // It's generally safer not to remove the script if other components might use it,
      // unless you have a global script loading manager.
      // For now, focus on callback cleanup.
      Object.keys(window).forEach(key => {
        if (key.startsWith('initGoogleMaps_')) {
          delete window[key];
        }
      });
    };
  }, [apiKey, toast]);

  const initializeServices = () => {
    if (window.google && window.google.maps && window.google.maps.places) {
      // Initialize AutocompleteService
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      
      // Initialize PlacesService
      // PlacesService requires a map instance or an HTMLDivElement to attach to, even if not displayed.
      const mapDiv = document.createElement('div'); 
      document.body.appendChild(mapDiv);
      placesService.current = new window.google.maps.places.PlacesService(mapDiv);
      mapDiv.remove();
      
      setGoogleMapsLoaded(true);
      console.log('Google Maps Autocomplete and Places services initialized.');
      
      // Generate initial session token
      if (window.google.maps.places.AutocompleteSessionToken) {
        setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
      }
    } else {
      console.error("Cannot initialize Google Maps services: google.maps.places is not available.");
      toast({
        title: "Initialization Error",
        description: "Google Maps services could not be initialized. Try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!autocompleteService.current || !googleMapsLoaded) {
      setSuggestions([]);
      return;
    }

    if (query.length > 2) {
      setIsLoading(true);
      
      let currentToken = sessionToken;
      if (!currentToken && window.google.maps.places.AutocompleteSessionToken) {
        currentToken = new window.google.maps.places.AutocompleteSessionToken();
        setSessionToken(currentToken);
      }

      autocompleteService.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'in' }, // Restrict to India
          types: ['geocode', 'establishment'], // Suggest addresses and business names
          sessionToken: currentToken,
        },
        (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
          setIsLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
            if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              // Do not toast for zero results, it's normal behavior
            } else if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
              console.error('AutocompleteService error:', status);
              // Optionally toast for other errors, but be mindful of API rate limits or transient issues.
            }
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    if (!placesService.current || !suggestion.place_id) return;

    setIsLoading(true);
    placesService.current.getDetails(
      {
        placeId: suggestion.place_id,
        fields: ['name', 'formatted_address', 'geometry'], // Fetch address and optionally geometry
        sessionToken: sessionToken // Use the same session token
      },
      (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
        setIsLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.formatted_address) {
          setSearchQuery(place.formatted_address);
          onLocationSelect(place.formatted_address);
          setSuggestions([]);
        } else {
          console.error('PlacesService getDetails error:', status);
          toast({
            title: "Error",
            description: "Could not fetch location details.",
            variant: "destructive",
          });
        }
        // A new session token should be generated for the next autocomplete session.
        if (window.google.maps.places.AutocompleteSessionToken) {
          setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
        } else {
          setSessionToken(null);
        }
      }
    );
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

  return (
    <div className="w-full max-w-md">
      <div className="flex gap-2 mb-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Search for your location in India..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-10"
            disabled={isLoadingMapsScript || !googleMapsLoaded || isLoadingSettings || !apiKey}
          />
          {isLoading && !isLoadingMapsScript && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={getCurrentLocation}
          disabled={isLoadingMapsScript || isLoading || !googleMapsLoaded || isLoadingSettings || !apiKey}
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

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

      {(isLoadingSettings || isLoadingMapsScript) && !googleMapsLoaded && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading location service...</span>
        </div>
      )}
       {!isLoadingSettings && !apiKey && !isLoadingMapsScript && (
        <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
          <AlertCircle className="h-4 w-4" />
          <span>Google Maps API Key not configured. Please set it in Business Settings.</span>
        </div>
      )}
       {!isLoadingMapsScript && !googleMapsLoaded && apiKey && (
        <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
          <AlertCircle className="h-4 w-4" />
          <span>Location service failed to load. Check API key or try refreshing.</span>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
