
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePetpoojaSync } from '@/hooks/usePetpoojaSync';
import { RefreshCw, Database, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface SyncStatus {
  lastSync: string | null;
  status: 'idle' | 'syncing' | 'success' | 'failed';
  message?: string;
}

interface StoreSyncDashboardProps {
  restaurantId: string;
  syncStatus: SyncStatus;
  onSync: (syncType: 'menu' | 'taxes' | 'discounts' | 'all') => void;
  loading: boolean;
}

const StoreSyncDashboard = ({ restaurantId, syncStatus, onSync, loading }: StoreSyncDashboardProps) => {
  const { getSyncLogs } = usePetpoojaSync();
  const [syncLogs, setSyncLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSyncLogs = async () => {
      try {
        const logs = await getSyncLogs(restaurantId);
        setSyncLogs(logs);
      } catch (error) {
        console.error('Failed to fetch sync logs:', error);
      }
    };

    if (restaurantId) {
      fetchSyncLogs();
    }
  }, [restaurantId, getSyncLogs, syncStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(syncStatus.status)}
                  <span className="text-lg font-semibold capitalize">{syncStatus.status}</span>
                </div>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Sync</p>
                <p className="text-lg font-semibold">
                  {syncStatus.lastSync 
                    ? new Date(syncStatus.lastSync).toLocaleString()
                    : 'Never'
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Syncs</p>
                <p className="text-lg font-semibold">{syncLogs.length}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-lg font-semibold">
                  {syncLogs.length > 0 
                    ? Math.round((syncLogs.filter(log => log.status === 'success').length / syncLogs.length) * 100)
                    : 0
                  }%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sync Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => onSync('menu')} 
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Menu
            </Button>
            <Button 
              onClick={() => onSync('taxes')} 
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Taxes
            </Button>
            <Button 
              onClick={() => onSync('discounts')} 
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Discounts
            </Button>
            <Button 
              onClick={() => onSync('all')} 
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync All Data
            </Button>
          </div>
          
          {syncStatus.message && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">{syncStatus.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sync History</CardTitle>
        </CardHeader>
        <CardContent>
          {syncLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sync history available
            </div>
          ) : (
            <div className="space-y-3">
              {syncLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <div className="font-medium">{log.sync_type} sync</div>
                      <div className="text-sm text-gray-600">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(log.status)}
                    {log.data_synced && (
                      <div className="text-sm text-gray-600">
                        {log.data_synced.categories_synced && 
                          `${log.data_synced.categories_synced} categories`
                        }
                        {log.data_synced.items_synced && 
                          `, ${log.data_synced.items_synced} items`
                        }
                        {log.data_synced.orders_synced && 
                          `${log.data_synced.orders_synced} orders`
                        }
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreSyncDashboard;
