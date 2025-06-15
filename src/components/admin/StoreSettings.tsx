import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { usePetpoojaStore } from '@/hooks/usePetpoojaStore';
import { usePetpoojaSync } from '@/hooks/usePetpoojaSync';
import { useStoreData } from '@/hooks/useStoreData';
import { supabase } from '@/integrations/supabase/client';
import StoreOverview from './store/StoreOverview';
import StoreMenuData from './store/StoreMenuData';
import StoreTaxData from './store/StoreTaxData';
import StoreDiscountData from './store/StoreDiscountData';
import StoreSyncDashboard from './store/StoreSyncDashboard';
import { Settings, Database, RefreshCw, Save } from 'lucide-react';
import RestaurantDropdown from './RestaurantDropdown';

interface StoreSettingsProps {
  restaurantId: string;
  outletId: string;
}

const StoreSettings = ({ restaurantId, outletId }: StoreSettingsProps) => {
  const [petpoojaConfig, setPetpoojaConfig] = useState({
    restaurantId: '',
    appKey: '',
    appSecret: '',
    accessToken: ''
  });

  const { toast } = useToast();
  const { saveStoreConfig, loading: configLoading } = usePetpoojaStore();
  const { triggerSync, syncStatus, loading: syncLoading } = usePetpoojaSync();
  
  // Add: State for restaurantId selected (from outlet)
  const [outletRestaurantId, setOutletRestaurantId] = useState<string | null>(restaurantId);
  
  // Refactor: Update fetching to use outlet's linked restaurant
  const { storeData, loading: dataLoading, refetch } = useStoreData(outletRestaurantId || "");

  // Outlet meta state
  const [outletData, setOutletData] = useState<any>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);
  const [outletLoading, setOutletLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For editable Store Code field
  const [storeCode, setStoreCode] = useState('');

  // Refactor: Update fetching to use outlet's linked restaurant
  useEffect(() => {
    // Fetch outlet info to get its mapped restaurant
    const fetchOutlet = async () => {
      setOutletLoading(true);
      const { data: outlet, error } = await supabase
        .from('outlets')
        .select('*')
        .eq('id', outletId)
        .maybeSingle();
      if (!error && outlet) {
        setOutletData(outlet);
        setStoreCode(outlet.store_code ?? '');
        setOutletRestaurantId(outlet.restaurant_id ?? null);
      }
      setOutletLoading(false);
    };
    if (outletId) fetchOutlet();
  }, [outletId]);

  // Add: When mapping changes, update in DB
  const handleMapRestaurant = async (newRestaurantId: string) => {
    setSaving(true);
    try {
      await supabase
        .from('outlets')
        .update({ restaurant_id: newRestaurantId, updated_at: new Date().toISOString() })
        .eq('id', outletId);
      setOutletRestaurantId(newRestaurantId);
      toast({
        title: 'Mapped Successfully',
        description: 'Outlet is now linked to this restaurant.'
      });
    } catch {
      toast({
        title: 'Mapping Error',
        description: 'Failed to map outlet to restaurant.',
        variant: 'destructive'
      });
    }
    setSaving(false);
  };

  useEffect(() => {
    // Fetch restaurant meta when mapping changes
    const fetchRestaurantMeta = async () => {
      if (!outletRestaurantId) {
        setRestaurantInfo(null);
        return;
      }
      const { data: restaurant, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', outletRestaurantId)
        .maybeSingle();
      if (!error && restaurant) setRestaurantInfo(restaurant);
      else setRestaurantInfo(null);
    };
    fetchRestaurantMeta();
  }, [outletRestaurantId]);

  // Load outlet data
  useEffect(() => {
    // Fetch outlet basic info and restaurant info
    const loadOutletAndRestaurant = async () => {
      setOutletLoading(true);
      try {
        const { data: outlet, error } = await supabase
          .from('outlets')
          .select('*')
          .eq('id', outletId)
          .maybeSingle();

        if (error || !outlet) {
          setOutletData(null);
          setRestaurantInfo(null);
          setOutletLoading(false);
          return;
        }

        setOutletData(outlet);
        setStoreCode(outlet.store_code ?? '');

        // Fetch related restaurant details
        if (outlet.restaurant_id) {
          const { data: restaurant, error: errR } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', outlet.restaurant_id)
            .maybeSingle();
          if (!errR && restaurant) setRestaurantInfo(restaurant);
          else setRestaurantInfo(null);
        } else {
          setRestaurantInfo(null);
        }
      } finally {
        setOutletLoading(false);
      }
    };

    if (outletId) loadOutletAndRestaurant();
  }, [outletId]);

  // Update restaurant info if user changes the store code
  useEffect(() => {
    const getByStoreCode = async () => {
      if (!storeCode.trim()) return;
      setOutletLoading(true);
      // Find outlet by store_code
      const { data: outlet, error } = await supabase
        .from('outlets')
        .select('*')
        .eq('store_code', storeCode)
        .maybeSingle();

      if (!error && outlet) {
        setOutletData(outlet);

        // Fetch connected restaurant
        if (outlet.restaurant_id) {
          const { data: restaurant, error: errR } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', outlet.restaurant_id)
            .maybeSingle();
          if (!errR && restaurant) setRestaurantInfo(restaurant);
          else setRestaurantInfo(null);
        } else {
          setRestaurantInfo(null);
        }
      }
      setOutletLoading(false);
    };
    if (storeCode?.length >= 6) getByStoreCode();
  }, [storeCode]);

  useEffect(() => {
    // Fetch outlet-specific PetPooja credentials
    const fetchOutletConfig = async () => {
      const { data: outlet } = await supabase
        .from('outlets')
        .select('petpooja_restaurant_id, petpooja_app_key, petpooja_app_secret, petpooja_access_token')
        .eq('id', outletId)
        .single();

      if (outlet) {
        setPetpoojaConfig({
          restaurantId: outlet.petpooja_restaurant_id || '',
          appKey: outlet.petpooja_app_key || '',
          appSecret: outlet.petpooja_app_secret || '',
          accessToken: outlet.petpooja_access_token || ''
        });
      }
    };

    if (outletId) {
      fetchOutletConfig();
    }
  }, [outletId]);

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

  const handleUpdateStoreCode = async () => {
    if (!outletData?.id || !storeCode.trim()) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('outlets')
        .update({ store_code: storeCode, updated_at: new Date().toISOString() })
        .eq('id', outletData.id);

      if (error) throw error;

      toast({
        title: 'Store Code Updated',
        description: 'Store code has been updated successfully.',
      });
      
      // Refresh outlet data
      setOutletData({ ...outletData, store_code: storeCode });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update store code. Please try again.',
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
      // Refetch data after sync
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

  // Outlet basic info card UI
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
              <Label htmlFor="outlet-store-code">Store Code</Label>
              <div className="flex gap-2">
                <Input 
                  id="outlet-store-code" 
                  value={storeCode} 
                  onChange={e => setStoreCode(e.target.value)} 
                />
                <Button 
                  onClick={handleUpdateStoreCode} 
                  disabled={saving || !storeCode.trim() || storeCode === outletData.store_code}
                  size="sm"
                >
                  {saving ? 'Saving...' : 'Update'}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="outlet-name">Name</Label>
              <Input id="outlet-name" value={outletData.name || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="outlet-id">Outlet ID</Label>
              <Input id="outlet-id" value={outletData.id || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="outlet-address">Address</Label>
              <Input id="outlet-address" value={outletData.address || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="outlet-phone">Phone</Label>
              <Input id="outlet-phone" value={outletData.phone || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="outlet-email">Email</Label>
              <Input id="outlet-email" value={outletData.email || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
              <Input id="delivery-radius" value={outletData.delivery_radius_km || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="delivery-fee">Delivery Fee</Label>
              <Input id="delivery-fee" value={outletData.delivery_fee || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="min-order">Minimum Order</Label>
              <Input id="min-order" value={outletData.min_order_amount || ''} readOnly />
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
              <Label htmlFor="is-active">Active?</Label>
              <Input id="is-active" value={outletData.is_active ? 'Yes' : 'No'} readOnly />
            </div>
            <div>
              <Label htmlFor="restaurant-id">Restaurant ID</Label>
              <Input id="restaurant-id" value={outletData.restaurant_id || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="max-delivery-distance">Max Delivery Distance (km)</Label>
              <Input id="max-delivery-distance" value={outletData.max_delivery_distance_km || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="estimated-delivery-time">Estimated Delivery Time (min)</Label>
              <Input id="estimated-delivery-time" value={outletData.estimated_delivery_time_minutes || ''} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Restaurant meta card UI
  function RestaurantMetaInfo() {
    if (!restaurantInfo) return null;
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Connected Restaurant Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={restaurantInfo.name || ''} readOnly />
            </div>
            <div>
              <Label>Restaurant ID</Label>
              <Input value={restaurantInfo.id || ''} readOnly />
            </div>
            <div>
              <Label>Status</Label>
              <Input value={restaurantInfo.status || ''} readOnly />
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
              <Label>Min Order</Label>
              <Input value={restaurantInfo.minimum_order_amount || ''} readOnly />
            </div>
            <div>
              <Label>Delivery Charges</Label>
              <Input value={restaurantInfo.delivery_charge || ''} readOnly />
            </div>
            <div>
              <Label>Prep Time</Label>
              <Input value={restaurantInfo.minimum_prep_time || ''} readOnly />
            </div>
            <div>
              <Label>Currency Symbol</Label>
              <Input value={restaurantInfo.currency_symbol || ''} readOnly />
            </div>
            <div>
              <Label>Contact Information</Label>
              <Input value={restaurantInfo.contact_information || ''} readOnly />
            </div>
            <div>
              <Label>Landmark</Label>
              <Input value={restaurantInfo.landmark || ''} readOnly />
            </div>
            <div>
              <Label>Latitude</Label>
              <Input value={restaurantInfo.latitude || ''} readOnly />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input value={restaurantInfo.longitude || ''} readOnly />
            </div>
            <div>
              <Label>Packaging Charge</Label>
              <Input value={restaurantInfo.packaging_charge || ''} readOnly />
            </div>
          </div>
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

      {/* New: Restaurant mapping dropdown */}
      <div className="mb-4">
        <RestaurantDropdown
          value={outletRestaurantId}
          onChange={handleMapRestaurant}
          disabled={saving}
        />
      </div>

      {/* Show Outlet details and Restaurant details above tabs */}
      <BasicOutletInfo />
      <RestaurantMetaInfo />

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
            restaurant={storeData?.restaurant} 
            loading={dataLoading}
            onRefresh={refetch}
          />
        </TabsContent>

        <TabsContent value="menu">
          {/* Pass restaurantInfo to Menu tab */}
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
    </div>
  );
};

export default StoreSettings;
