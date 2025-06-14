
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SyncStatus {
  lastSync: string | null;
  status: 'idle' | 'syncing' | 'success' | 'failed';
  message?: string;
}

export const usePetpoojaSync = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    status: 'idle'
  });
  const [loading, setLoading] = useState(false);

  const triggerSync = async (outletId: string, syncType: 'menu' | 'taxes' | 'discounts' | 'all') => {
    setLoading(true);
    setSyncStatus(prev => ({ ...prev, status: 'syncing' }));

    try {
      const { data, error } = await supabase.functions.invoke('petpooja-sync', {
        body: {
          outlet_id: outletId,
          sync_type: syncType === 'all' ? 'menu' : syncType
        }
      });

      if (error) throw error;

      setSyncStatus({
        lastSync: new Date().toISOString(),
        status: 'success',
        message: data.message
      });
    } catch (error) {
      setSyncStatus({
        lastSync: null,
        status: 'failed',
        message: error.message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSyncLogs = async (outletId: string) => {
    // Get restaurant_id from outlet first
    const { data: outlet } = await supabase
      .from('outlets')
      .select('restaurant_id')
      .eq('id', outletId)
      .single();

    if (!outlet) throw new Error('Outlet not found');

    const { data, error } = await supabase
      .from('sync_logs')
      .select('*')
      .eq('restaurant_id', outlet.restaurant_id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  };

  return {
    triggerSync,
    getSyncLogs,
    syncStatus,
    loading
  };
};
