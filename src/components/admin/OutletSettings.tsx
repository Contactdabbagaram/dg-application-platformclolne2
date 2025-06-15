
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import GeofenceMap from './GeofenceMap';
import { GeofencePoint } from '@/utils/locationUtils';
import { updateOutletServiceArea } from '@/utils/databaseUtils';
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Clock, 
  DollarSign, 
  Package,
  CreditCard,
  Truck,
  Settings,
  RefreshCw,
  Key,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Shield,
  Globe
} from 'lucide-react';
import PetpoojaSettings from './PetpoojaSettings';

interface OutletSettingsProps {
  outletName: string;
  onBack?: () => void;
}

const OutletSettings = ({ outletName, onBack }: OutletSettingsProps) => {
  const [openSections, setOpenSections] = useState<string[]>(['basic']);
  const [outletData, setOutletData] = useState<any>(null);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Consolidated editable fields - all outlet data in one state
  const [editableFields, setEditableFields] = useState({
    name: '',
    store_code: '',
    address: '',
    phone: '',
    email: '',
    delivery_radius_km: 0,
    delivery_fee: 0,
    min_order_amount: 0,
    is_active: true,
    latitude: 0,
    longitude: 0,
    service_area_type: 'radius' as 'radius' | 'geofence',
    geofence_coordinates: [] as GeofencePoint[],
    max_delivery_distance_km: 10,
    estimated_delivery_time_minutes: 30,
    delivery_fee_type: 'flat' as 'flat' | 'tiered',
    base_delivery_distance_km: 0,
    base_delivery_fee: 0,
    per_km_delivery_fee: 0,
  });

  const [editableRestaurantFields, setEditableRestaurantFields] = useState({
    minimum_prep_time: 30,
    minimum_delivery_time: '',
    packaging_charge: 0,
    service_charge_value: 0,
  });

  // Load outlet data
  useEffect(() => {
    const loadOutletData = async () => {
      setLoading(true);
      try {
        console.log('Loading outlet data for:', outletName);
        
        // Use maybeSingle() instead of single() to handle cases where no row or multiple rows exist
        const { data, error } = await supabase
          .from('outlets')
          .select('*')
          .eq('name', outletName)
          .maybeSingle();

        if (error) {
          console.error('Error loading outlet data:', error);
          throw error;
        }

        if (!data) {
          console.error('No outlet found with name:', outletName);
          toast.error('Outlet not found. Please check the outlet name.');
          return;
        }

        console.log('Loaded outlet data:', data);
        setOutletData(data);
        
        // Update all editable fields from database
        setEditableFields({
          name: data.name || '',
          store_code: data.store_code || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          delivery_radius_km: data.delivery_radius_km || 0,
          delivery_fee: data.delivery_fee || 0,
          min_order_amount: data.min_order_amount || 0,
          is_active: data.is_active || true,
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          service_area_type: (data.service_area_type as 'radius' | 'geofence') || 'radius',
          geofence_coordinates: (data.geofence_coordinates as unknown as GeofencePoint[]) || [],
          max_delivery_distance_km: data.max_delivery_distance_km || 10,
          estimated_delivery_time_minutes: data.estimated_delivery_time_minutes || 30,
          delivery_fee_type: (data.delivery_fee_type as 'flat' | 'tiered') || 'flat',
          base_delivery_distance_km: data.base_delivery_distance_km || 0,
          base_delivery_fee: data.base_delivery_fee || 0,
          per_km_delivery_fee: data.per_km_delivery_fee || 0,
        });

        // Load restaurant data if available
        if (data.restaurant_id) {
          console.log('Loading restaurant data for ID:', data.restaurant_id);
          const { data: restaurant, error: restaurantError } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', data.restaurant_id)
            .maybeSingle();

          if (!restaurantError && restaurant) {
            console.log('Loaded restaurant data:', restaurant);
            setRestaurantData(restaurant);
            setEditableRestaurantFields({
              minimum_prep_time: restaurant.minimum_prep_time || 30,
              minimum_delivery_time: restaurant.minimum_delivery_time || '',
              packaging_charge: restaurant.packaging_charge || 0,
              service_charge_value: restaurant.service_charge_value || 0,
            });
          } else if (restaurantError) {
            console.error('Error loading restaurant data:', restaurantError);
          }
        }
      } catch (error) {
        console.error('Error loading outlet data:', error);
        toast.error('Failed to load outlet data');
      } finally {
        setLoading(false);
      }
    };

    loadOutletData();
  }, [outletName]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Consolidated field change handler
  const handleFieldChange = (field: string, value: any) => {
    console.log('Field change:', field, value);
    setEditableFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRestaurantFieldChange = (field: string, value: any) => {
    console.log('Restaurant field change:', field, value);
    setEditableRestaurantFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveBasicSettings = async () => {
    if (!outletData) {
      console.error("Cannot save settings: outlet data is not loaded yet.");
      toast.error("Cannot save settings: outlet data is not loaded yet.");
      return;
    }

    setSaving(true);
    console.log('Saving basic settings for outlet:', outletData.id);
    console.log('Data to save:', editableFields);

    try {
      const updateData = {
        name: editableFields.name,
        store_code: editableFields.store_code,
        address: editableFields.address,
        phone: editableFields.phone,
        email: editableFields.email,
        delivery_radius_km: Number(editableFields.delivery_radius_km),
        delivery_fee: Number(editableFields.delivery_fee),
        min_order_amount: Number(editableFields.min_order_amount),
        is_active: editableFields.is_active,
        latitude: Number(editableFields.latitude),
        longitude: Number(editableFields.longitude),
        updated_at: new Date().toISOString(),
        delivery_fee_type: editableFields.delivery_fee_type,
        base_delivery_distance_km: Number(editableFields.base_delivery_distance_km),
        base_delivery_fee: Number(editableFields.base_delivery_fee),
        per_km_delivery_fee: Number(editableFields.per_km_delivery_fee),
      };

      console.log('Sending update data to database:', updateData);

      // Use update with select() which returns an array, avoiding the 'limit' error
      const { data: updatedData, error } = await supabase
        .from('outlets')
        .update(updateData)
        .eq('id', outletData.id)
        .select();

      if (error) {
        console.error('Database error during save:', error);
        throw error;
      }

      if (!updatedData || updatedData.length === 0) {
        throw new Error('No data returned from update operation');
      }

      console.log('Successfully saved data:', updatedData[0]);
      toast.success('Basic settings updated successfully');
      
      // Update local state with saved data
      setOutletData({ ...outletData, ...updatedData[0] });
    } catch (error: any) {
      console.error('Error saving basic settings:', error);
      toast.error(`Failed to save basic settings: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const saveRestaurantSettings = async () => {
    if (!restaurantData) {
      toast.error("Cannot save: restaurant data not loaded.");
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        minimum_prep_time: Number(editableRestaurantFields.minimum_prep_time),
        minimum_delivery_time: editableRestaurantFields.minimum_delivery_time,
        packaging_charge: Number(editableRestaurantFields.packaging_charge),
        service_charge_value: Number(editableRestaurantFields.service_charge_value),
        updated_at: new Date().toISOString(),
      };

      const { data: updatedData, error } = await supabase
        .from('restaurants')
        .update(updateData)
        .eq('id', restaurantData.id)
        .select();

      if (error) {
        throw error;
      }
      
      if (!updatedData || updatedData.length === 0) {
        throw new Error('No data returned from update operation');
      }

      toast.success('Restaurant settings updated successfully');
      setRestaurantData({ ...restaurantData, ...updatedData[0] });

    } catch (error: any) {
      console.error('Error saving restaurant settings:', error);
      toast.error(`Failed to save restaurant settings: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const saveServiceAreaSettings = async () => {
    if (!outletData) {
      console.error("Cannot save settings: outlet data is not loaded yet.");
      toast.error("Cannot save settings: outlet data is not loaded yet.");
      return;
    }

    setLoading(true);
    console.log('Saving service area settings for outlet:', outletData.id);
    console.log('Service area data to save:', {
      serviceAreaType: editableFields.service_area_type,
      deliveryRadius: editableFields.delivery_radius_km,
      geofenceCoordinates: editableFields.geofence_coordinates,
      maxDeliveryDistance: editableFields.max_delivery_distance_km,
      estimatedDeliveryTime: editableFields.estimated_delivery_time_minutes
    });

    try {
      const settingsToSave = {
        serviceAreaType: editableFields.service_area_type,
        deliveryRadius: Number(editableFields.delivery_radius_km),
        geofenceCoordinates: editableFields.geofence_coordinates,
        maxDeliveryDistance: Number(editableFields.max_delivery_distance_km),
        estimatedDeliveryTime: Number(editableFields.estimated_delivery_time_minutes)
      };

      const { data, error } = await updateOutletServiceArea(outletData.id, settingsToSave);

      if (error) {
        console.error('Database error during service area save:', error);
        throw error;
      }

      console.log('Successfully saved service area settings:', data);
      toast.success('Service area settings updated successfully');
      
      // Update local outlet data with saved settings
      setOutletData({ ...outletData, ...data });

    } catch (error: any) {
      console.error('Error saving service area settings:', error);
      toast.error(`Failed to save service area settings: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const sectionConfig = [
    { id: 'basic', title: 'Basic Details', icon: Settings },
    { id: 'address', title: 'Store Address', icon: MapPin },
    { id: 'service-area', title: 'Service Area & Geofencing', icon: Shield },
    { id: 'ordering', title: 'Order Value & Delivery Fees', icon: Package },
    { id: 'payments', title: 'Payments', icon: CreditCard },
    { id: 'menu-automation', title: 'Menu Automation', icon: RefreshCw },
  ];

  if (loading && !outletData) {
    return <div className="p-6 text-gray-500">Loading outlet settings...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Store Settings - {outletName}</h2>
      
      {/* error handling for outletData */}
      {outletData === null && !loading && (
        <div className="p-4 bg-red-50 border border-red-300 rounded text-red-700 mb-4">
          Failed to load outlet data. Please check that the outlet exists in the database and reload this page.
        </div>
      )}

      {/* Show Restaurant Info if available */}
      {restaurantData && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Connected Restaurant Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Restaurant Name</Label>
                <Input value={restaurantData.name || ''} readOnly />
              </div>
              <div>
                <Label>Status</Label>
                <Input value={restaurantData.status || ''} readOnly />
              </div>
              <div>
                <Label>Currency</Label>
                <Input value={restaurantData.currency_symbol || '₹'} readOnly />
              </div>
              <div>
                <Label>City</Label>
                <Input value={restaurantData.city || ''} readOnly />
              </div>
              <div>
                <Label>State</Label>
                <Input value={restaurantData.state || ''} readOnly />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={restaurantData.country || ''} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {sectionConfig.map((section) => {
        const Icon = section.icon;
        const isOpen = openSections.includes(section.id);
        
        return (
          <Collapsible key={section.id} open={isOpen} onOpenChange={() => toggleSection(section.id)}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="p-6">
                  {section.id === 'basic' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="store-name">Store Name</Label>
                          <Input 
                            id="store-name" 
                            value={editableFields.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="store-code">Store Code</Label>
                          <Input 
                            id="store-code" 
                            value={editableFields.store_code}
                            onChange={(e) => handleFieldChange('store_code', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="active">Store Active</Label>
                        <Switch 
                          id="active" 
                          checked={editableFields.is_active}
                          onCheckedChange={(checked) => handleFieldChange('is_active', checked)}
                        />
                      </div>

                      <Button onClick={saveBasicSettings} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Basic Settings'}
                      </Button>
                    </div>
                  )}

                  {section.id === 'address' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Complete Address</Label>
                        <Textarea 
                          id="address" 
                          value={editableFields.address}
                          onChange={(e) => handleFieldChange('address', e.target.value)}
                          placeholder="Enter complete address"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            value={editableFields.phone}
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={editableFields.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input 
                            id="latitude" 
                            type="number"
                            step="any"
                            value={editableFields.latitude}
                            onChange={(e) => handleFieldChange('latitude', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input 
                            id="longitude" 
                            type="number"
                            step="any"
                            value={editableFields.longitude}
                            onChange={(e) => handleFieldChange('longitude', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      <Button onClick={saveBasicSettings} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Address Settings'}
                      </Button>
                    </div>
                  )}

                  {section.id === 'service-area' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Service Area Configuration</h4>
                        <p className="text-sm text-blue-800">
                          Define your delivery boundaries using either a simple radius or a custom geofence polygon. 
                          Customers outside this area will see your menu but cannot place orders.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Service Area Type</Label>
                          <Select value={editableFields.service_area_type} onValueChange={(value: 'radius' | 'geofence') => handleFieldChange('service_area_type', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="radius">
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4" />
                                  <span>Radius - Simple circular delivery area</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="geofence">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  <span>Geofence - Custom polygon boundary</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
                            <Input
                              id="delivery-radius"
                              type="number"
                              value={editableFields.delivery_radius_km}
                              onChange={(e) => handleFieldChange('delivery_radius_km', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="max-distance">Max Distance (km)</Label>
                            <Input
                              id="max-distance"
                              type="number"
                              value={editableFields.max_delivery_distance_km}
                              onChange={(e) => handleFieldChange('max_delivery_distance_km', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="delivery-time">Base Delivery Time (min)</Label>
                            <Input
                              id="delivery-time"
                              type="number"
                              value={editableFields.estimated_delivery_time_minutes}
                              onChange={(e) => handleFieldChange('estimated_delivery_time_minutes', parseInt(e.target.value) || 30)}
                              min="10"
                            />
                          </div>
                        </div>
                      </div>

                      <GeofenceMap
                        outletLatitude={editableFields.latitude || 19.1568}
                        outletLongitude={editableFields.longitude || 72.9940}
                        geofenceCoordinates={editableFields.geofence_coordinates}
                        deliveryRadius={editableFields.delivery_radius_km}
                        onGeofenceChange={(coordinates) => handleFieldChange('geofence_coordinates', coordinates)}
                        onRadiusChange={(radius) => handleFieldChange('delivery_radius_km', radius)}
                        serviceAreaType={editableFields.service_area_type}
                      />

                      <div className="flex gap-2">
                        <Button 
                          onClick={saveServiceAreaSettings} 
                          disabled={loading || !outletData}
                        >
                          {outletData ? (loading ? 'Saving...' : 'Save Service Area Settings') : 'Loading Outlet Data...'}
                        </Button>
                        <Button variant="outline">Test Location</Button>
                      </div>
                      {!outletData && (
                        <p className="text-sm text-gray-500 mt-1">
                          Outlet details are loading. Please wait before saving.
                        </p>
                      )}
                    </div>
                  )}

                  {section.id === 'ordering' && (
                    <div className="space-y-6">
                      {/* Order Value Limits */}
                      <div>
                        <h4 className="text-lg font-medium mb-4">Order Value & Delivery Fees</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="min-order">Minimum Order Value (₹)</Label>
                            <Input
                              id="min-order"
                              type="number"
                              value={editableFields.min_order_amount}
                              onChange={(e) => handleFieldChange('min_order_amount', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="delivery_fee_type">Delivery Fee Type</Label>
                            <Select
                              value={editableFields.delivery_fee_type}
                              onValueChange={(value: 'flat' | 'tiered') => handleFieldChange('delivery_fee_type', value)}
                            >
                              <SelectTrigger id="delivery_fee_type">
                                <SelectValue placeholder="Select fee type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="flat">Flat</SelectItem>
                                <SelectItem value="tiered">Tiered</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {editableFields.delivery_fee_type === 'flat' ? (
                          <div className="mt-4 space-y-2">
                            <Label htmlFor="delivery_fee">Delivery Fee (Flat) (₹)</Label>
                            <Input
                              id="delivery_fee"
                              type="number"
                              value={editableFields.delivery_fee}
                              onChange={(e) => handleFieldChange('delivery_fee', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="base_delivery_distance_km">Base Distance (km)</Label>
                              <Input
                                id="base_delivery_distance_km"
                                type="number"
                                value={editableFields.base_delivery_distance_km}
                                onChange={(e) => handleFieldChange('base_delivery_distance_km', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="base_delivery_fee">Base Fee (₹)</Label>
                              <Input
                                id="base_delivery_fee"
                                type="number"
                                value={editableFields.base_delivery_fee}
                                onChange={(e) => handleFieldChange('base_delivery_fee', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="per_km_delivery_fee">Fee Per km (₹)</Label>
                              <Input
                                id="per_km_delivery_fee"
                                type="number"
                                value={editableFields.per_km_delivery_fee}
                                onChange={(e) => handleFieldChange('per_km_delivery_fee', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        )}

                        <div className="mt-4">
                          <Button onClick={saveBasicSettings} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Order Settings'}
                          </Button>
                        </div>
                      </div>

                      {/* Service Type from restaurant data */}
                      {restaurantData && (
                        <div>
                          <h4 className="text-lg font-medium mb-4">Restaurant Settings</h4>
                           <p className="text-sm text-gray-600 mb-4">
                              These settings are applied across all outlets for this restaurant.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="min-prep-time">Minimum Prep Time (mins)</Label>
                              <Input
                                id="min-prep-time"
                                type="number"
                                value={editableRestaurantFields.minimum_prep_time}
                                onChange={(e) => handleRestaurantFieldChange('minimum_prep_time', parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="min-delivery-time">Minimum Delivery Time</Label>
                              <Input
                                id="min-delivery-time"
                                value={editableRestaurantFields.minimum_delivery_time}
                                onChange={(e) => handleRestaurantFieldChange('minimum_delivery_time', e.target.value)}
                                placeholder="e.g. 60Minutes"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="packaging-charge">Packaging Charge (₹)</Label>
                              <Input
                                id="packaging-charge"
                                type="number"
                                value={editableRestaurantFields.packaging_charge}
                                onChange={(e) => handleRestaurantFieldChange('packaging_charge', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="service-charge">Service Charge Value (₹)</Label>
                              <Input
                                id="service-charge"
                                type="number"
                                value={editableRestaurantFields.service_charge_value}
                                onChange={(e) => handleRestaurantFieldChange('service_charge_value', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                           <div className="mt-4">
                              <Button onClick={saveRestaurantSettings} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Restaurant Settings'}
                              </Button>
                            </div>
                        </div>
                      )}
                    </div>
                  )}

                  {section.id === 'payments' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium mb-4">Payment Configuration</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Payment settings are configured at the restaurant level. Contact system administrator to modify payment options.
                        </p>
                        
                        {restaurantData && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Currency Symbol</Label>
                              <Input value={restaurantData.currency_symbol || '₹'} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label>Tax on Service Charge</Label>
                              <Input value={restaurantData.tax_on_service_charge ? 'Yes' : 'No'} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label>Calculate Tax on Packing</Label>
                              <Input value={restaurantData.calculate_tax_on_packing ? 'Yes' : 'No'} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label>Calculate Tax on Delivery</Label>
                              <Input value={restaurantData.calculate_tax_on_delivery ? 'Yes' : 'No'} readOnly />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {section.id === 'menu-automation' && (
                    <div className="space-y-6">
                      {/* Use new PetpoojaSettings component */}
                      <div>
                        <PetpoojaSettings outletId={outletData?.id} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default OutletSettings;
