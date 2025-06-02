
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNearestOutlets } from '@/hooks/useMenu';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';

const OutletManagement = () => {
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const { data: outlets, isLoading } = useNearestOutlets();

  if (isLoading) {
    return <div>Loading outlets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Outlet Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Outlet
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outlets List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Outlets</h3>
          {outlets?.map((outlet) => (
            <Card 
              key={outlet.id} 
              className={`cursor-pointer transition-all ${
                selectedOutlet === outlet.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setSelectedOutlet(outlet.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{outlet.name}</h4>
                      <Badge variant={outlet.is_active ? "default" : "secondary"}>
                        {outlet.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{outlet.address}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <span>📞 {outlet.phone}</span>
                      <span>📧 {outlet.email}</span>
                      <span>🚚 ₹{outlet.delivery_fee} delivery</span>
                      <span>📍 {outlet.delivery_radius_km}km radius</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Outlet Details/Edit Form */}
        <div className="space-y-4">
          {selectedOutlet ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Outlet Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="outlet-name">Outlet Name</Label>
                  <Input id="outlet-name" defaultValue="DabbaGaram Central - MG Road" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="outlet-address">Address</Label>
                  <Input id="outlet-address" defaultValue="MG Road, Bangalore, Karnataka 560001" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" defaultValue="12.9716" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" defaultValue="77.5946" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+91-9876543210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="mgroad@dabbagaram.com" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delivery-fee">Delivery Fee</Label>
                    <Input id="delivery-fee" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-order">Min Order</Label>
                    <Input id="min-order" type="number" defaultValue="200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="radius">Delivery Radius (km)</Label>
                    <Input id="radius" type="number" defaultValue="10" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Active Status</Label>
                  <Switch id="active" defaultChecked />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Operating Hours</h4>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-24 text-sm">{day}</div>
                      <Input type="time" defaultValue="09:00" className="w-32" />
                      <span className="text-sm">to</span>
                      <Input type="time" defaultValue="22:00" className="w-32" />
                      <Switch defaultChecked={index < 6} />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Select an outlet</h3>
                <p className="text-sm text-gray-600">
                  Choose an outlet from the list to view and edit its details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutletManagement;
