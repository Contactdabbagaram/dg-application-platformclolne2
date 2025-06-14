
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Package, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface PetpoojaSettingsProps {
  outletId: string | undefined;
}

const PetpoojaSettings = ({ outletId }: PetpoojaSettingsProps) => {
  const [petpoojaConfig, setPetpoojaConfig] = useState({
    petpooja_restaurant_id: '',
    petpooja_app_key: '',
    petpooja_app_secret: '',
    petpooja_access_token: ''
  });
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    if (!outletId) { setLoading(false); return; }
    setLoading(true);
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('outlets')
          .select('petpooja_restaurant_id,petpooja_app_key,petpooja_app_secret,petpooja_access_token')
          .eq('id', outletId)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setPetpoojaConfig({
            petpooja_restaurant_id: data.petpooja_restaurant_id || '',
            petpooja_app_key: data.petpooja_app_key || '',
            petpooja_app_secret: data.petpooja_app_secret || '',
            petpooja_access_token: data.petpooja_access_token || ''
          });
          setConnected(!!(data.petpooja_app_key && data.petpooja_app_secret));
        }
      } catch (err) {
        toast.error('Failed to load Petpooja config');
        setConnected(false);
      }
      setLoading(false);
    };
    fetchConfig();
  }, [outletId]);

  useEffect(() => {
    // Fetch last sync from sync_logs
    const fetchLastSync = async () => {
      if (!outletId) return;
      const { data: outlet } = await supabase.from('outlets').select('restaurant_id').eq('id', outletId).maybeSingle();
      if (outlet?.restaurant_id) {
        const { data: logs } = await supabase
          .from('sync_logs')
          .select('created_at')
          .eq('restaurant_id', outlet.restaurant_id)
          .eq('status', 'success')
          .order('created_at', { ascending: false })
          .limit(1);
        if (logs && logs[0]?.created_at) setLastSync(new Date(logs[0].created_at).toLocaleString());
      }
    };
    fetchLastSync();
  }, [outletId, connected]); // Update when config changes

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPetpoojaConfig(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!outletId) return;
    setLoading(true);
    try {
      const updateData: any = {
        petpooja_restaurant_id: petpoojaConfig.petpooja_restaurant_id,
        petpooja_app_key: petpoojaConfig.petpooja_app_key,
        petpooja_app_secret: petpoojaConfig.petpooja_app_secret,
        petpooja_access_token: petpoojaConfig.petpooja_access_token,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from('outlets')
        .update(updateData)
        .eq('id', outletId);

      if (error) throw error;
      toast.success('Petpooja configuration saved');
      setConnected(!!(petpoojaConfig.petpooja_app_key && petpoojaConfig.petpooja_app_secret));
    } catch (err) {
      toast.error('Failed to save config');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading menu automation settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium">Petpooja Integration</h4>
              <p className="text-sm text-gray-600">Menu and order management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {connected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-600" />
                <Badge variant="destructive">Disconnected</Badge>
              </>
            )}
          </div>
        </div>
        {connected && !!petpoojaConfig.petpooja_restaurant_id && (
          <div className="text-sm text-gray-600">
            <p>Restaurant ID: {petpoojaConfig.petpooja_restaurant_id}</p>
            <p>Last sync: {lastSync || 'Never'}</p>
          </div>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Petpooja API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="petpooja_restaurant_id">Petpooja Restaurant ID</Label>
              <Input
                id="petpooja_restaurant_id"
                value={petpoojaConfig.petpooja_restaurant_id}
                onChange={handleConfigChange}
                placeholder="Enter Petpooja Restaurant ID"
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="petpooja_app_key">App Key</Label>
              <Input
                id="petpooja_app_key"
                value={petpoojaConfig.petpooja_app_key}
                onChange={handleConfigChange}
                placeholder="Enter App Key"
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="petpooja_app_secret">App Secret</Label>
              <Input
                id="petpooja_app_secret"
                type="password"
                value={petpoojaConfig.petpooja_app_secret}
                onChange={handleConfigChange}
                placeholder="Enter App Secret"
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="petpooja_access_token">Access Token</Label>
              <Input
                id="petpooja_access_token"
                type="password"
                value={petpoojaConfig.petpooja_access_token}
                onChange={handleConfigChange}
                placeholder="Enter Access Token"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>Save Petpooja Config</Button>
            {/* In the future: Test Connection or Trigger Sync */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PetpoojaSettings;
