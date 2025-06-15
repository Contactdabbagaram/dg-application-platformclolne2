
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
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const { toast } = useToast();

  // Fetch outlet data and handle restaurant linking
  const fetchOutletData = useCallback(async () => {
    if (!outletId) {
      setOutletData(null);
      setSelectedRestaurantId(null);
      setRestaurantData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Fetching outlet data for ID:', outletId);
    
    try {
      // First fetch the outlet data
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
        
        // Set the selected restaurant ID immediately
        const restaurantId = outlet.restaurant_id || null;
        console.log('Setting selectedRestaurantId to:', restaurantId);
        setSelectedRestaurantId(restaurantId);

        // If outlet has a restaurant_id, fetch the restaurant data separately
        if (outlet.restaurant_id) {
          console.log('Fetching restaurant data for ID:', outlet.restaurant_id);
          
          const { data: restaurant, error: restaurantError } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', outlet.restaurant_id)
            .maybeSingle();

          if (restaurantError) {
            console.error('Error fetching restaurant:', restaurantError);
            toast({
              title: 'Warning',
              description: 'Outlet is linked to a restaurant that no longer exists.',
              variant: 'destructive',
            });
            setRestaurantData(null);
          } else if (restaurant) {
            console.log('Restaurant data:', restaurant);
            setRestaurantData(restaurant);
          } else {
            console.warn('Restaurant not found for ID:', outlet.restaurant_id);
            // Clean up orphaned relationship
            await supabase
              .from('outlets')
              .update({ restaurant_id: null })
              .eq('id', outletId);
            
            setSelectedRestaurantId(null);
            setRestaurantData(null);
            // Update local outlet data
            setOutletData({ ...outlet, restaurant_id: null });
            
            toast({
              title: 'Cleaned up',
              description: 'Removed invalid restaurant link.',
            });
          }
        } else {
          setRestaurantData(null);
        }
      } else {
        console.log('No outlet found for ID:', outletId);
        setOutletData(null);
        setSelectedRestaurantId(null);
        setRestaurantData(null);
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
      setRestaurantData(null);
    } finally {
      setLoading(false);
    }
  }, [outletId, toast]);

  // Initial data fetch when outletId changes
  useEffect(() => {
    fetchOutletData();
  }, [fetchOutletData]);

  // Fetch store data based on selected restaurant
  const {
    storeData,
    loading: storeLoading,
    error: storeError,
    refetch: refetchStoreData,
  } = useStoreData(selectedRestaurantId || '');

  // Get restaurant object from storeData or restaurantData
  const restaurant = storeData?.restaurant || restaurantData || null;

  const handleRestaurantChange = async (newRestaurantId: string) => {
    if (!outletId) return;

    console.log('Changing restaurant to:', newRestaurantId);
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

      // Update the outlet with the new restaurant_id
      const { error: updateError } = await supabase
        .from('outlets')
        .update({
          restaurant_id: newRestaurantId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', outletId);

      if (updateError) {
        console.error('Error updating outlet:', updateError);
        throw updateError;
      }

      console.log('Successfully linked outlet to restaurant');

      // Show success toast
      toast({
        title: 'Restaurant Linked Successfully',
        description: `Outlet has been linked to ${restaurantExists.name}.`,
      });

      // Refetch outlet data to ensure UI is in sync
      await fetchOutletData();
      
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
