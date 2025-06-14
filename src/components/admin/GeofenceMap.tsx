
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface GeofencePoint {
  lat: number;
  lng: number;
}

interface GeofenceMapProps {
  outletLatitude?: number;
  outletLongitude?: number;
  geofenceCoordinates?: GeofencePoint[];
  deliveryRadius?: number;
  onGeofenceChange?: (coordinates: GeofencePoint[]) => void;
  onRadiusChange?: (radius: number) => void;
  serviceAreaType: 'radius' | 'geofence';
}

const GeofenceMap = ({
  outletLatitude = 19.1568,
  outletLongitude = 72.9940,
  geofenceCoordinates = [],
  deliveryRadius = 10,
  onGeofenceChange,
  onRadiusChange,
  serviceAreaType
}: GeofenceMapProps) => {
  const [coordinates, setCoordinates] = useState<GeofencePoint[]>(geofenceCoordinates);
  const [radius, setRadius] = useState(deliveryRadius);
  const [showPreview, setShowPreview] = useState(true);
  const [newPoint, setNewPoint] = useState({ lat: '', lng: '' });

  useEffect(() => {
    setCoordinates(geofenceCoordinates);
  }, [geofenceCoordinates]);

  useEffect(() => {
    setRadius(deliveryRadius);
  }, [deliveryRadius]);

  const addPoint = () => {
    if (newPoint.lat && newPoint.lng) {
      const point = {
        lat: parseFloat(newPoint.lat),
        lng: parseFloat(newPoint.lng)
      };
      const updatedCoordinates = [...coordinates, point];
      setCoordinates(updatedCoordinates);
      onGeofenceChange?.(updatedCoordinates);
      setNewPoint({ lat: '', lng: '' });
    }
  };

  const removePoint = (index: number) => {
    const updatedCoordinates = coordinates.filter((_, i) => i !== index);
    setCoordinates(updatedCoordinates);
    onGeofenceChange?.(updatedCoordinates);
  };

  const handleRadiusChange = (value: number) => {
    setRadius(value);
    onRadiusChange?.(value);
  };

  const generateCirclePoints = () => {
    const points: GeofencePoint[] = [];
    const numPoints = 16;
    const radiusInDegrees = radius / 111; // Approximate conversion from km to degrees

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints;
      const lat = outletLatitude + radiusInDegrees * Math.cos(angle);
      const lng = outletLongitude + radiusInDegrees * Math.sin(angle);
      points.push({ lat, lng });
    }
    
    setCoordinates(points);
    onGeofenceChange?.(points);
  };

  return (
    <div className="space-y-6">
      {/* Map Placeholder - In production, integrate with Google Maps or similar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Service Area Visualization
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
            <div className="space-y-4">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <h3 className="font-medium text-gray-900">Interactive Map</h3>
                <p className="text-sm text-gray-600">
                  Map integration with Google Maps will be displayed here
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <div>
                    <Badge variant="outline">Outlet Location</Badge>
                    <span className="ml-2">{outletLatitude}, {outletLongitude}</span>
                  </div>
                  {serviceAreaType === 'radius' && (
                    <div>
                      <Badge variant="secondary">Delivery Radius</Badge>
                      <span className="ml-2">{radius} km</span>
                    </div>
                  )}
                  {serviceAreaType === 'geofence' && coordinates.length > 0 && (
                    <div>
                      <Badge variant="default">Geofence Points</Badge>
                      <span className="ml-2">{coordinates.length} points defined</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {serviceAreaType === 'radius' && (
        <Card>
          <CardHeader>
            <CardTitle>Radius Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
              <Input
                id="delivery-radius"
                type="number"
                value={radius}
                onChange={(e) => handleRadiusChange(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
              />
            </div>
            <Button onClick={generateCirclePoints} variant="outline" className="w-full">
              Generate Circle Geofence from Radius
            </Button>
          </CardContent>
        </Card>
      )}

      {serviceAreaType === 'geofence' && (
        <Card>
          <CardHeader>
            <CardTitle>Geofence Points</CardTitle>
            <p className="text-sm text-gray-600">
              Define custom polygon boundaries for your delivery area
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-lat">Latitude</Label>
                <Input
                  id="new-lat"
                  type="number"
                  placeholder="19.1568"
                  value={newPoint.lat}
                  onChange={(e) => setNewPoint({ ...newPoint, lat: e.target.value })}
                  step="0.000001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-lng">Longitude</Label>
                <Input
                  id="new-lng"
                  type="number"
                  placeholder="72.9940"
                  value={newPoint.lng}
                  onChange={(e) => setNewPoint({ ...newPoint, lng: e.target.value })}
                  step="0.000001"
                />
              </div>
            </div>
            <Button onClick={addPoint} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Point
            </Button>

            {coordinates.length > 0 && (
              <div className="space-y-2">
                <Label>Current Points ({coordinates.length})</Label>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {coordinates.map((point, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-mono">
                        {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePoint(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeofenceMap;
