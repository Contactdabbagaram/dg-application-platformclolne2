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

export const OutletProvider = ({
  outletId,
  children,
}: { outletId: string | null; children: ReactNode }) => {
  const [outletData, setOutletData] = useState<any>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch outlet data and handle restaurant linking
  const fetchOutletData = useCallback(async () => {
    if (!outletId) {
      setOutletData(null);
      setSelectedRestaurantId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Fetching outlet data for ID:', outletId);
    
    try {
      const { data: outlet, error: outletError } = await supabase
        .from('outlets')
        .select('*')
        .eq('id', outletId)
        .maybeSingle();

      if (outletError) {
        console.error('Error fetching outlet:', outletError);
        throw outletError;
      }

      console.log('Outlet data:', outlet);

      if (outlet) {
        setOutletData(outlet);
        
        // Set the selected restaurant ID - this will trigger useStoreData
        const restaurantId = outlet.restaurant_id || null;
        console.log('Setting selectedRestaurantId to:', restaurantId);
        setSelectedRestaurantId(restaurantId);

        // If outlet has a restaurant_id but restaurant doesn't exist, clean up
        if (outlet.restaurant_id) {
          const { data: restaurantExists } = await supabase
            .from('restaurants')
            .select('id')
            .eq('id', outlet.restaurant_id)
            .maybeSingle();

          if (!restaurantExists) {
            console.warn('Restaurant not found for ID:', outlet.restaurant_id);
            // Clean up orphaned relationship
            await supabase
              .from('outlets')
              .update({ restaurant_id: null })
              .eq('id', outletId);
            
            setSelectedRestaurantId(null);
            setOutletData({ ...outlet, restaurant_id: null });
            
            toast({
              title: 'Cleaned up',
              description: 'Removed invalid restaurant link.',
            });
          }
        }
      } else {
        console.log('No outlet found for ID:', outletId);
        setOutletData(null);
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

  // Initial data fetch when outletId changes
  useEffect(() => {
    fetchOutletData();
  }, [fetchOutletData]);

  // Fetch store data based on selected restaurant - this is now the single source of truth
  const {
    storeData,
    loading: storeLoading,
    error: storeError,
    refetch: refetchStoreData,
  } = useStoreData(selectedRestaurantId || '');

  // Get restaurant object only from storeData - no fallbacks
  const restaurant = storeData?.restaurant || null;

  // MODIFICATION: After successfully mapping restaurant, immediately update state and trigger all relevant refetches
  const handleRestaurantChange = async (newRestaurantId: string) => {
    if (!outletId) return;

    setSaving(true);
    try {
      // Validate that the restaurant exists before linking
      const { data: restaurantExists, error: validateError } = await supabase
        .from('restaurants')
        .select('id, name')
        .eq('id', newRestaurantId)
        .maybeSingle();

      if (validateError) {
        console.error('Error validating restaurant:', validateError);
        throw validateError;
      }

      if (!restaurantExists) {
        throw new Error('Selected restaurant does not exist');
      }

      // Update outlet in DB
      const { error: updateError } = await supabase
        .from('outlets')
        .update({
          restaurant_id: newRestaurantId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', outletId);

      if (updateError) throw updateError;

      toast({
        title: 'Restaurant Linked Successfully',
        description: `Outlet has been linked to ${restaurantExists.name}.`,
      });

      // NEW: Synchronize state and force refetch on all relevant stores and hooks
      setSelectedRestaurantId(newRestaurantId);
      setOutletData((prev: any) =>
        prev ? { ...prev, restaurant_id: newRestaurantId } : prev
      );
      fetchOutletData(); // Immediate fetch to sync everything
      refetchStoreData(); // Force hook to refetch
    } catch (error) {
      console.error('Error linking restaurant:', error);
      toast({
        title: 'Linking Failed',
        description: error instanceof Error ? error.message : 'Failed to link outlet to restaurant.',
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

  return <OutletContext.Provider value={value}>{children}</OutletContext.Provider>;
};

export const useOutlet = () => {
  const context = useContext(OutletContext);
  if (context === undefined) {
    throw new Error('useOutlet must be used within an OutletProvider');
  }
  return context;
};
