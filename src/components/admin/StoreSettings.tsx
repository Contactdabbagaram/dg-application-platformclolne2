
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
  const { storeData, loading: dataLoading, refetch } = useStoreData(restaurantId);

  // Outlet meta state
  const [outletData, setOutletData] = useState<any>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);
  const [outletLoading, setOutletLoading] = useState(true);

  // For editable Store Code field
  const [storeCode, setStoreCode] = useState('');

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
    // Only if user changes storeCode independently, not initial mount
    // eslint-disable-next-line
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
              <Input id="outlet-store-code" value={storeCode} onChange={e => setStoreCode(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="outlet-name">Name</Label>
              <Input id="outlet-name" value={outletData.name} readOnly />
            </div>
            <div>
              <Label htmlFor="outlet-id">Outlet ID</Label>
              <Input id="outlet-id" value={outletData.id} readOnly />
            </div>
            <div>
              <Label htmlFor="outlet-address">Address</Label>
              <Input id="outlet-address" value={outletData.address} readOnly />
            </div>
            <div>
              <Label htmlFor="outlet-phone">Phone</Label>
              <Input id="outlet-phone" value={outletData.phone ?? ''} readOnly />
            </div>
            <div>
              <Label htmlFor="outlet-email">Email</Label>
              <Input id="outlet-email" value={outletData.email ?? ''} readOnly />
            </div>
            <div>
              <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
              <Input id="delivery-radius" value={outletData.delivery_radius_km ?? ''} readOnly />
            </div>
            <div>
              <Label htmlFor="delivery-fee">Delivery Fee</Label>
              <Input id="delivery-fee" value={outletData.delivery_fee ?? ''} readOnly />
            </div>
            <div>
              <Label htmlFor="min-order">Minimum Order</Label>
              <Input id="min-order" value={outletData.min_order_amount ?? ''} readOnly />
            </div>
            <div>
              <Label htmlFor="service-area-type">Service Area Type</Label>
              <Input id="service-area-type" value={outletData.service_area_type} readOnly />
            </div>
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" value={outletData.latitude ?? ''} readOnly />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" value={outletData.longitude ?? ''} readOnly />
            </div>
            <div>
              <Label htmlFor="is-active">Active?</Label>
              <Input id="is-active" value={outletData.is_active ? 'Yes' : 'No'} readOnly />
            </div>
            <div>
              <Label htmlFor="restaurant-id">Restaurant ID</Label>
              <Input id="restaurant-id" value={outletData.restaurant_id ?? ''} readOnly />
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
              <Input value={restaurantInfo.name} readOnly />
            </div>
            <div>
              <Label>Restaurant ID</Label>
              <Input value={restaurantInfo.id} readOnly />
            </div>
            <div>
              <Label>Status</Label>
              <Input value={restaurantInfo.status} readOnly />
            </div>
            <div>
              <Label>City</Label>
              <Input value={restaurantInfo.city ?? ''} readOnly />
            </div>
            <div>
              <Label>State</Label>
              <Input value={restaurantInfo.state ?? ''} readOnly />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={restaurantInfo.country ?? 'India'} readOnly />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={restaurantInfo.address ?? ''} readOnly />
            </div>
            <div>
              <Label>Min Order</Label>
              <Input value={restaurantInfo.minimum_order_amount ?? ''} readOnly />
            </div>
            <div>
              <Label>Delivery Charges</Label>
              <Input value={restaurantInfo.delivery_charge ?? ''} readOnly />
            </div>
            <div>
              <Label>Prep Time</Label>
              <Input value={restaurantInfo.minimum_prep_time ?? ''} readOnly />
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
