import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStoreData } from '@/hooks/useStoreData';
import { useToast } from '@/hooks/use-toast';

interface OutletContextType {
  outletId: string | null;
  outletData: any | null;
  selectedRestaurantId: string | null;
  handleRestaurantChange: (newRestaurantId: string) => Promise<void>;
  loading: boolean;
  saving: boolean;
  storeData: any;
  storeLoading: boolean;
  storeError: Error | null;
  refetchStoreData: () => void;
  restaurant: any | null;
  refetchOutletData: () => Promise<void>;
}

const OutletContext = createContext<OutletContextType | undefined>(undefined);

export const OutletProvider = ({ outletId, children }: { outletId: string | null, children: ReactNode }) => {
  const [outletData, setOutletData] = useState<any>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const {
    storeData,
    loading: storeLoading,
    error: storeError,
    refetch: refetchStoreData,
  } = useStoreData(selectedRestaurantId || '');

  const restaurant = storeData?.restaurant;

  const fetchOutletData = useCallback(async () => {
    if (!outletId) {
        setOutletData(null);
        setSelectedRestaurantId(null);
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const { data: outlet, error } = await supabase
        .from('outlets')
        .select('*, restaurants(*)')
        .eq('id', outletId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Ignore "exact one row" error if no row found
          throw error;
      }
      
      setOutletData(outlet);
      if (outlet?.restaurant_id) {
        setSelectedRestaurantId(outlet.restaurant_id);
      } else {
        setSelectedRestaurantId(null);
      }
    } catch (error) {
      console.error("Error fetching outlet data:", error);
      toast({
        title: 'Error',
        description: 'Could not fetch outlet data.',
        variant: 'destructive',
      });
      setOutletData(null);
      setSelectedRestaurantId(null);
    } finally {
      setLoading(false);
    }
  }, [outletId, toast]);

  useEffect(() => {
    fetchOutletData();
  }, [fetchOutletData]);

  const handleRestaurantChange = async (newRestaurantId: string) => {
    if (!outletId) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('outlets')
        .update({
          restaurant_id: newRestaurantId,
          updated_at: new Date().toISOString()
        })
        .eq('id', outletId);

      if (error) throw error;
      
      // Update state locally for immediate feedback before refetch
      setSelectedRestaurantId(newRestaurantId);
      
      // Refetch all data to ensure consistency
      await fetchOutletData();
      
      toast({
        title: 'Restaurant Linked Successfully',
        description: 'Outlet has been linked to the selected restaurant.',
      });
    } catch (error) {
      toast({
        title: 'Linking Failed',
        description: 'Failed to link outlet to restaurant.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const value = {
    outletId,
    outletData,
    selectedRestaurantId,
    handleRestaurantChange,
    loading,
    saving,
    storeData,
    storeLoading,
    storeError,
    refetchStoreData,
    restaurant,
    refetchOutletData: fetchOutletData,
  };

  return (
    <OutletContext.Provider value={value}>
      {children}
    </OutletContext.Provider>
  );
};

export const useOutlet = () => {
  const context = useContext(OutletContext);
  if (context === undefined) {
    throw new Error('useOutlet must be used within an OutletProvider');
  }
  return context;
};
