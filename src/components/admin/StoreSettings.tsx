import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { usePetpoojaStore } from '@/hooks/usePetpoojaStore';
import { usePetpoojaSync } from '@/hooks/usePetpoojaSync';
import { useOutlet } from '@/contexts/OutletContext';
import StoreOverview from './store/StoreOverview';
import StoreMenuData from './store/StoreMenuData';
import StoreTaxData from './store/StoreTaxData';
import StoreDiscountData from './store/StoreDiscountData';
import StoreSyncDashboard from './store/StoreSyncDashboard';
import { Settings, RefreshCw, Save, CheckCircle, AlertCircle } from 'lucide-react';
import RestaurantDropdown from './RestaurantDropdown';
import { RestaurantChangeConfirmationDialog } from './RestaurantChangeConfirmationDialog';
import { Switch } from '@/components/ui/switch';

interface StoreSettingsProps {
  outletId: string;
}

interface EditableOutletData {
  store_code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  delivery_radius_km: number | string;
  delivery_fee: number | string;
  min_order_amount: number | string;
  is_active: boolean;
  max_delivery_distance_km: number | string;
  estimated_delivery_time_minutes: number | string;
}

const StoreSettings = ({ outletId }: StoreSettingsProps) => {
  const [petpoojaConfig, setPetpoojaConfig] = useState({
    restaurantId: '',
    appKey: '',
    appSecret: '',
    accessToken: ''
  });

  const { toast } = useToast();
  const { saveStoreConfig, loading: configLoading } = usePetpoojaStore();
  const { triggerSync, syncStatus, loading: syncLoading } = usePetpoojaSync();
  
  const {
    outletData,
    selectedRestaurantId,
    handleRestaurantChange,
    saving: contextSaving,
    storeData,
    storeLoading: dataLoading,
    storeError,
    refetchStoreData: refetch,
    restaurant: restaurantInfo,
    loading: outletLoading,
    refetchOutletData,
  } = useOutlet();

  const [editableData, setEditableData] = useState<EditableOutletData>({
    store_code: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    delivery_radius_km: '',
    delivery_fee: '',
    min_order_amount: '',
    is_active: true,
    max_delivery_distance_km: '',
    estimated_delivery_time_minutes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (outletData) {
      setEditableData({
        store_code: outletData.store_code || '',
        name: outletData.name || '',
        address: outletData.address || '',
        phone: outletData.phone || '',
        email: outletData.email || '',
        delivery_radius_km: outletData.delivery_radius_km || '',
        delivery_fee: outletData.delivery_fee || '',
        min_order_amount: outletData.min_order_amount || '',
        is_active: outletData.is_active,
        max_delivery_distance_km: outletData.max_delivery_distance_km || '',
        estimated_delivery_time_minutes: outletData.estimated_delivery_time_minutes || '',
      });
    }
  }, [outletData]);

  // Load outlet-specific PetPooja credentials
  useEffect(() => {
    const fetchOutletConfig = async () => {
      if (!outletId) return;
      
      const { data: outlet } = await supabase
        .from('outlets')
        .select('petpooja_restaurant_id, petpooja_app_key, petpooja_app_secret, petpooja_access_token')
        .eq('id', outletId)
        .maybeSingle();

      if (outlet) {
        setPetpoojaConfig({
          restaurantId: outlet.petpooja_restaurant_id || '',
          appKey: outlet.petpooja_app_key || '',
          appSecret: outlet.petpooja_app_secret || '',
          accessToken: outlet.petpooja_access_token || ''
        });
      }
    };

    fetchOutletConfig();
  }, [outletId]);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setEditableData(prev => ({ ...prev, is_active: checked }));
  };

  const handleSaveConfig = async () => {
    try {
      await saveStoreConfig(outletId, petpoojaConfig);
      toast({
        title: 'Configuration Saved',
        description: 'Petpooja API configuration has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save configuration. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveOutletDetails = async () => {
    if (!outletData?.id) return;
    
    setSaving(true);
    try {
      const updateData = {
        ...editableData,
        delivery_radius_km: editableData.delivery_radius_km ? Number(editableData.delivery_radius_km) : null,
        delivery_fee: editableData.delivery_fee ? Number(editableData.delivery_fee) : null,
        min_order_amount: editableData.min_order_amount ? Number(editableData.min_order_amount) : null,
        max_delivery_distance_km: editableData.max_delivery_distance_km ? Number(editableData.max_delivery_distance_km) : null,
        estimated_delivery_time_minutes: editableData.estimated_delivery_time_minutes ? Number(editableData.estimated_delivery_time_minutes) : null,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('outlets')
        .update(updateData)
        .eq('id', outletData.id);

      if (error) {
          console.error("Error updating outlet:", error);
          throw error;
      }

      toast({
        title: 'Outlet Details Updated',
        description: 'The outlet details have been saved successfully.',
      });
      
      await refetchOutletData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update outlet details.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };


  const handleSync = async (syncType: 'menu' | 'taxes' | 'discounts' | 'all') => {
    try {
      await triggerSync(outletId, syncType);
      toast({
        title: 'Sync Started',
        description: `${syncType === 'all' ? 'Full' : syncType} sync has been initiated.`,
      });
      setTimeout(() => refetch(), 2000);
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Failed to start sync. Please check your configuration.',
        variant: 'destructive',
      });
    }
  };

  const hasValidConfig = petpoojaConfig.restaurantId && petpoojaConfig.appKey && petpoojaConfig.appSecret;
  const isRestaurantLinked = !!selectedRestaurantId;

  console.log('StoreSettings debug:', {
    selectedRestaurantId,
    isRestaurantLinked,
    restaurantInfo,
    outletData: outletData ? { id: outletData.id, restaurant_id: outletData.restaurant_id } : null
  });

  // Outlet basic info component
  function BasicOutletInfo() {
    if (outletLoading) {
      return <p className="p-4 text-gray-600">Loading outlet details...</p>;
    }
    if (!outletData) {
      return <p className="p-4 text-red-600">Outlet not found or not selected.</p>;
    }
    
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Outlet Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="store_code">Store Code</Label>
              <Input
                id="store_code"
                name="store_code"
                value={editableData.store_code}
                onChange={handleDataChange}
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={editableData.name} onChange={handleDataChange} />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={editableData.address} onChange={handleDataChange} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={editableData.phone} onChange={handleDataChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={editableData.email} onChange={handleDataChange} />
            </div>
            <div>
              <Label htmlFor="delivery_radius_km">Delivery Radius (km)</Label>
              <Input id="delivery_radius_km" name="delivery_radius_km" type="number" value={editableData.delivery_radius_km} onChange={handleDataChange} />
            </div>
            <div>
              <Label htmlFor="delivery_fee">Delivery Fee</Label>
              <Input id="delivery_fee" name="delivery_fee" type="number" value={editableData.delivery_fee} onChange={handleDataChange} />
            </div>
            <div>
              <Label htmlFor="min_order_amount">Minimum Order</Label>
              <Input id="min_order_amount" name="min_order_amount" type="number" value={editableData.min_order_amount} onChange={handleDataChange} />
            </div>
             <div>
              <Label htmlFor="max_delivery_distance_km">Max Delivery Distance (km)</Label>
              <Input id="max_delivery_distance_km" name="max_delivery_distance_km" type="number" value={editableData.max_delivery_distance_km} onChange={handleDataChange} />
            </div>
            <div>
              <Label htmlFor="estimated_delivery_time_minutes">Est. Delivery Time (min)</Label>
              <Input id="estimated_delivery_time_minutes" name="estimated_delivery_time_minutes" type="number" value={editableData.estimated_delivery_time_minutes} onChange={handleDataChange} />
            </div>
            <div className="flex flex-col space-y-2 pt-2">
              <Label htmlFor="is_active">Active</Label>
              <Switch id="is_active" checked={editableData.is_active} onCheckedChange={handleSwitchChange} />
            </div>
            <div>
              <Label htmlFor="outlet-id">Outlet ID</Label>
              <Input id="outlet-id" value={outletData.id || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="service-area-type">Service Area Type</Label>
              <Input id="service-area-type" value={outletData.service_area_type || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" value={outletData.latitude || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" value={outletData.longitude || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="restaurant-id">Restaurant ID</Label>
              <Input id="restaurant-id" value={outletData.restaurant_id || ''} readOnly />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveOutletDetails} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Outlet Details'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Connected Restaurant Information component
  function ConnectedRestaurantInfo() {
    return (
      <Card className="mb-4">
        <RestaurantChangeConfirmationDialog />
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Connected Restaurant Information</CardTitle>
            <Badge variant={isRestaurantLinked ? "default" : "secondary"}>
              {isRestaurantLinked ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Linked</>
              ) : (
                <><AlertCircle className="h-3 w-3 mr-1" /> Not Linked</>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              Link this outlet to a restaurant to access menu data, taxes, discounts, and other restaurant-specific settings.
            </p>
          </div>
          
          <RestaurantDropdown
            value={selectedRestaurantId}
            onChange={handleRestaurantChange}
            disabled={contextSaving}
            label="Restaurant Name"
            placeholder="Choose a restaurant to link with this outlet"
          />
          
          {isRestaurantLinked && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-3">Restaurant Details</h4>
              {dataLoading ? (
                <p className="text-gray-600">Loading restaurant data...</p>
              ) : storeError ? (
                <p className="text-red-600">Error loading restaurant data: {storeError.message}</p>
              ) : restaurantInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Restaurant Name</Label>
                    <Input value={restaurantInfo.name || ''} readOnly />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Input value={restaurantInfo.status || ''} readOnly />
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Input value={restaurantInfo.currency_symbol || ''} readOnly />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={restaurantInfo.city || ''} readOnly />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input value={restaurantInfo.state || ''} readOnly />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input value={restaurantInfo.country || ''} readOnly />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input value={restaurantInfo.address || ''} readOnly />
                  </div>
                  <div>
                    <Label>Min Order Amount</Label>
                    <Input value={restaurantInfo.minimum_order_amount || ''} readOnly />
                  </div>
                  <div>
                    <Label>Delivery Charge</Label>
                    <Input value={restaurantInfo.delivery_charge || ''} readOnly />
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No restaurant data available</p>
              )}
            </div>
          )}
          
          {!isRestaurantLinked && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Please select a restaurant to access store management features.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Store Management</h1>
        <Badge variant={hasValidConfig ? "default" : "secondary"}>
          {hasValidConfig ? "Configured" : "Not Configured"}
        </Badge>
      </div>

      {/* Show Outlet details and Restaurant connection */}
      <BasicOutletInfo />
      <ConnectedRestaurantInfo />

      {/* Show warning if no restaurant is linked */}
      {!isRestaurantLinked && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <p>Link a restaurant above to access store management features.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs - only show if restaurant is linked */}
      {isRestaurantLinked && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="menu">Menu Data</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
            <TabsTrigger value="discounts">Discounts</TabsTrigger>
            <TabsTrigger value="sync">Sync Status</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <StoreOverview 
              restaurant={restaurantInfo} 
              loading={dataLoading}
              onRefresh={refetch}
            />
          </TabsContent>

          <TabsContent value="menu">
            <StoreMenuData 
              categories={storeData?.categories || []}
              items={storeData?.items || []}
              variations={storeData?.variations || []}
              addons={storeData?.addons || []}
              loading={dataLoading}
              restaurant={restaurantInfo}
            />
          </TabsContent>

          <TabsContent value="taxes">
            <StoreTaxData 
              taxes={storeData?.taxes || []}
              loading={dataLoading}
            />
          </TabsContent>

          <TabsContent value="discounts">
            <StoreDiscountData 
              discounts={storeData?.discounts || []}
              loading={dataLoading}
            />
          </TabsContent>

          <TabsContent value="sync">
            <StoreSyncDashboard 
              outletId={outletId}
              syncStatus={syncStatus}
              onSync={handleSync}
              loading={syncLoading}
            />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Petpooja API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="restaurantId">Restaurant ID</Label>
                    <Input
                      id="restaurantId"
                      value={petpoojaConfig.restaurantId}
                      onChange={(e) => setPetpoojaConfig(prev => ({ ...prev, restaurantId: e.target.value }))}
                      placeholder="Enter Petpooja Restaurant ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="appKey">App Key</Label>
                    <Input
                      id="appKey"
                      value={petpoojaConfig.appKey}
                      onChange={(e) => setPetpoojaConfig(prev => ({ ...prev, appKey: e.target.value }))}
                      placeholder="Enter App Key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="appSecret">App Secret</Label>
                    <Input
                      id="appSecret"
                      type="password"
                      value={petpoojaConfig.appSecret}
                      onChange={(e) => setPetpoojaConfig(prev => ({ ...prev, appSecret: e.target.value }))}
                      placeholder="Enter App Secret"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accessToken">Access Token</Label>
                    <Input
                      id="accessToken"
                      type="password"
                      value={petpoojaConfig.accessToken}
                      onChange={(e) => setPetpoojaConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                      placeholder="Enter Access Token"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSaveConfig} disabled={configLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleSync('all')} 
                    disabled={syncLoading || !hasValidConfig}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test & Sync All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default StoreSettings;
