
import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';
import { MapPin, Trash2, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface GeofencePoint {
  lat: number;
  lng: number;
}

interface InteractiveGeofenceMapProps {
  outletLatitude?: number;
  outletLongitude?: number;
  geofenceCoordinates?: GeofencePoint[];
  deliveryRadius?: number;
  onGeofenceChange?: (coordinates: GeofencePoint[]) => void;
  onRadiusChange?: (radius: number) => void;
  serviceAreaType: 'radius' | 'geofence';
}

const InteractiveGeofenceMap = ({
  outletLatitude = 19.1568,
  outletLongitude = 72.9940,
  geofenceCoordinates = [],
  deliveryRadius = 10,
  onGeofenceChange,
  onRadiusChange,
  serviceAreaType
}: InteractiveGeofenceMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const drawingManager = useRef<google.maps.drawing.DrawingManager | null>(null);
  const polygon = useRef<google.maps.Polygon | null>(null);
  const circle = useRef<google.maps.Circle | null>(null);
  const outletMarker = useRef<google.maps.Marker | null>(null);
  
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const { data: businessSettings } = useBusinessSettings();

  const clearDrawings = useCallback(() => {
    if (polygon.current) {
      polygon.current.setMap(null);
      polygon.current = null;
    }
    if (circle.current) {
      circle.current.setMap(null);
      circle.current = null;
    }
  }, []);

  const setupPolygon = useCallback((coordinates: GeofencePoint[]) => {
    if (!mapInstance.current || coordinates.length === 0) return;

    clearDrawings();

    const polygonCoords = coordinates.map(coord => ({
      lat: coord.lat,
      lng: coord.lng
    }));

    polygon.current = new google.maps.Polygon({
      paths: polygonCoords,
      fillColor: '#3b82f6',
      fillOpacity: 0.2,
      strokeColor: '#3b82f6',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      editable: true,
      draggable: false
    });

    polygon.current.setMap(mapInstance.current);

    // Listen for polygon changes
    polygon.current.getPath().addListener('set_at', () => {
      updateGeofenceFromPolygon();
    });

    polygon.current.getPath().addListener('insert_at', () => {
      updateGeofenceFromPolygon();
    });

    polygon.current.getPath().addListener('remove_at', () => {
      updateGeofenceFromPolygon();
    });
  }, []);

  const setupCircle = useCallback((radius: number) => {
    if (!mapInstance.current) return;

    clearDrawings();

    circle.current = new google.maps.Circle({
      center: { lat: outletLatitude, lng: outletLongitude },
      radius: radius * 1000, // Convert km to meters
      fillColor: '#10b981',
      fillOpacity: 0.2,
      strokeColor: '#10b981',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      editable: true,
      draggable: false
    });

    circle.current.setMap(mapInstance.current);

    // Listen for radius changes
    circle.current.addListener('radius_changed', () => {
      if (circle.current && onRadiusChange) {
        const newRadius = circle.current.getRadius() / 1000; // Convert meters to km
        onRadiusChange(Number(newRadius.toFixed(1)));
      }
    });
  }, [outletLatitude, outletLongitude, onRadiusChange]);

  const updateGeofenceFromPolygon = useCallback(() => {
    if (!polygon.current || !onGeofenceChange) return;

    const path = polygon.current.getPath();
    const coordinates: GeofencePoint[] = [];

    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push({
        lat: point.lat(),
        lng: point.lng()
      });
    }

    onGeofenceChange(coordinates);
  }, [onGeofenceChange]);

  const initializeMap = useCallback(async () => {
    if (!mapRef.current || !businessSettings?.googleMapsApiKey) return;

    try {
      const loader = new Loader({
        apiKey: businessSettings.googleMapsApiKey,
        version: 'weekly',
        libraries: ['drawing', 'geometry']
      });

      await loader.load();

      // Initialize map
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: outletLatitude, lng: outletLongitude },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      });

      // Add outlet marker
      outletMarker.current = new google.maps.Marker({
        position: { lat: outletLatitude, lng: outletLongitude },
        map: mapInstance.current,
        title: 'Outlet Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ef4444"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      });

      // Initialize drawing manager
      drawingManager.current = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.POLYGON]
        },
        polygonOptions: {
          fillColor: '#3b82f6',
          fillOpacity: 0.2,
          strokeColor: '#3b82f6',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          editable: true
        }
      });

      drawingManager.current.setMap(mapInstance.current);

      // Handle polygon completion
      drawingManager.current.addListener('polygoncomplete', (newPolygon: google.maps.Polygon) => {
        // Remove old polygon if exists
        if (polygon.current) {
          polygon.current.setMap(null);
        }

        polygon.current = newPolygon;
        drawingManager.current?.setDrawingMode(null);

        // Set up listeners for the new polygon
        polygon.current.getPath().addListener('set_at', updateGeofenceFromPolygon);
        polygon.current.getPath().addListener('insert_at', updateGeofenceFromPolygon);
        polygon.current.getPath().addListener('remove_at', updateGeofenceFromPolygon);

        updateGeofenceFromPolygon();
      });

      setIsMapLoaded(true);

      // Setup initial drawings based on service area type
      if (serviceAreaType === 'radius') {
        setupCircle(deliveryRadius);
      } else if (serviceAreaType === 'geofence' && geofenceCoordinates.length > 0) {
        setupPolygon(geofenceCoordinates);
      }

    } catch (error) {
      console.error('Error loading Google Maps:', error);
      toast.error('Failed to load Google Maps. Please check your API key.');
    }
  }, [businessSettings?.googleMapsApiKey, outletLatitude, outletLongitude, serviceAreaType, deliveryRadius, geofenceCoordinates, setupCircle, setupPolygon, updateGeofenceFromPolygon]);

  // Update drawings when service area type changes
  useEffect(() => {
    if (!isMapLoaded) return;

    if (serviceAreaType === 'radius') {
      setupCircle(deliveryRadius);
      if (drawingManager.current) {
        drawingManager.current.setOptions({
          drawingControl: false
        });
      }
    } else {
      if (geofenceCoordinates.length > 0) {
        setupPolygon(geofenceCoordinates);
      } else {
        clearDrawings();
      }
      if (drawingManager.current) {
        drawingManager.current.setOptions({
          drawingControl: true
        });
      }
    }
  }, [serviceAreaType, deliveryRadius, geofenceCoordinates, isMapLoaded, setupCircle, setupPolygon, clearDrawings]);

  // Initialize map when component mounts
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  const resetDrawings = () => {
    clearDrawings();
    if (onGeofenceChange) {
      onGeofenceChange([]);
    }
  };

  if (!businessSettings?.googleMapsApiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Google Maps Integration Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Please configure your Google Maps API key in Business Settings to enable interactive geofencing.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Interactive Service Area Map
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? 'Hide' : 'Show'} Map
              </Button>
              {serviceAreaType === 'geofence' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetDrawings}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {showPreview && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Outlet Location</span>
                </div>
                {serviceAreaType === 'radius' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full opacity-50"></div>
                    <span>Delivery Radius</span>
                  </div>
                )}
                {serviceAreaType === 'geofence' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full opacity-50"></div>
                    <span>Geofence Area</span>
                  </div>
                )}
              </div>
              
              <div
                ref={mapRef}
                className="w-full h-96 border border-gray-300 rounded-lg"
                style={{ minHeight: '400px' }}
              />

              {serviceAreaType === 'geofence' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">How to use Geofencing</h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Click the polygon tool in the map toolbar</li>
                    <li>Click on the map to create points for your delivery area</li>
                    <li>Close the polygon by clicking on the first point</li>
                    <li>Drag the points to adjust the boundary</li>
                    <li>Use the "Reset" button to start over</li>
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <div>
                    <Badge variant="outline">Outlet</Badge>
                    <span className="ml-2">{outletLatitude.toFixed(6)}, {outletLongitude.toFixed(6)}</span>
                  </div>
                  {serviceAreaType === 'radius' && (
                    <div>
                      <Badge variant="secondary">Radius</Badge>
                      <span className="ml-2">{deliveryRadius} km</span>
                    </div>
                  )}
                  {serviceAreaType === 'geofence' && geofenceCoordinates.length > 0 && (
                    <div>
                      <Badge variant="default">Geofence</Badge>
                      <span className="ml-2">{geofenceCoordinates.length} points defined</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default InteractiveGeofenceMap;
