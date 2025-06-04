
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
import StoreOverview from './store/StoreOverview';
import StoreMenuData from './store/StoreMenuData';
import StoreTaxData from './store/StoreTaxData';
import StoreDiscountData from './store/StoreDiscountData';
import StoreSyncDashboard from './store/StoreSyncDashboard';
import { Settings, Database, RefreshCw, Save } from 'lucide-react';

interface StoreSettingsProps {
  restaurantId: string;
}

const StoreSettings = ({ restaurantId }: StoreSettingsProps) => {
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

  useEffect(() => {
    if (storeData?.restaurant) {
      setPetpoojaConfig({
        restaurantId: storeData.restaurant.petpooja_restaurant_id || '',
        appKey: storeData.restaurant.petpooja_app_key || '',
        appSecret: storeData.restaurant.petpooja_app_secret || '',
        accessToken: storeData.restaurant.petpooja_access_token || ''
      });
    }
  }, [storeData?.restaurant]);

  const handleSaveConfig = async () => {
    try {
      await saveStoreConfig(restaurantId, petpoojaConfig);
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
      await triggerSync(restaurantId, syncType);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Store Management</h1>
        <Badge variant={storeData?.restaurant ? "default" : "secondary"}>
          {storeData?.restaurant ? "Configured" : "Not Configured"}
        </Badge>
      </div>

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
          <StoreMenuData 
            categories={storeData?.categories || []}
            items={storeData?.items || []}
            variations={storeData?.variations || []}
            addons={storeData?.addons || []}
            loading={dataLoading}
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
            restaurantId={restaurantId}
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
                  disabled={syncLoading || !petpoojaConfig.restaurantId}
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
