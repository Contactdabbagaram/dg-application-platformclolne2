
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStoreData } from '@/hooks/useStoreData';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useRestaurantLink } from '@/hooks/useRestaurantLink';

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
  refetchOutletData: () => void;
  confirmRestaurantChange: () => Promise<void>;
  cancelRestaurantChange: () => void;
  confirmationState: {
    isOpen: boolean;
    newRestaurantId: string | null;
    restaurantName?: string;
  };
}

// ... OutletContext creation stays the same

export const OutletProvider = ({
  outletId,
  children,
}: { outletId: string | null; children: ReactNode }) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const { toast } = useToast();
  const lastUpdateRef = useRef<number>(0);

  // Query for outlet data
  const {
    data: outletData,
    isLoading: loading,
    isError,
    error: outletQueryError,
    refetch: refetchOutletData,
  } = useQuery({
    queryKey: ['outletData', outletId],
    queryFn: async () => {
      if (!outletId) return null;
      const { data: outlet, error: outletError } = await supabase
        .from('outlets')
        .select('*')
        .eq('id', outletId)
        .maybeSingle();
      if (outletError) {
        console.error('Error fetching outlet:', outletError);
        throw outletError;
      }
      // orphaned link cleanup
      if (outlet?.restaurant_id) {
        const { data: restaurantExists } = await supabase
          .from('restaurants')
          .select('id')
          .eq('id', outlet.restaurant_id)
          .maybeSingle();

        if (!restaurantExists) {
          console.warn('Restaurant not found for ID:', outlet.restaurant_id, 'cleaning up.');
          await supabase.from('outlets').update({ restaurant_id: null }).eq('id', outletId);
          toast({ title: 'Cleaned up', description: 'Removed invalid restaurant link.' });
          return { ...outlet, restaurant_id: null };
        }
      }

      return outlet;
    },
    enabled: !!outletId,
  });

  // PROPER: Always set selectedRestaurantId from latest server data.
  useEffect(() => {
    if (outletData) {
      setSelectedRestaurantId(outletData.restaurant_id || null);
      console.log('[OutletContext] Set selectedRestaurantId from outletData:', outletData.restaurant_id);
    } else {
      setSelectedRestaurantId(null); // explicit null if orphaned
    }
  }, [outletData]);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching outlet data:", outletQueryError);
      toast({ title: 'Error', description: 'Could not fetch outlet data.', variant: 'destructive' });
      setSelectedRestaurantId(null);
    }
  }, [isError, outletQueryError, toast]);

  // Fetch store data based on selected restaurant
  const {
    storeData,
    loading: storeLoading,
    error: storeError,
    refetch: refetchStoreData,
  } = useStoreData(selectedRestaurantId || '');

  const restaurant = storeData?.restaurant || null;

  // Linking logic
  const {
    saving,
    confirmationState,
    handleRestaurantChange,
    confirmRestaurantChange,
    cancelRestaurantChange,
  } = useRestaurantLink(outletId, selectedRestaurantId, {
    onLinked: async (newRestaurantId: string) => {
      lastUpdateRef.current = Date.now();
      // After link, refetch outlet and store data
      await refetchOutletData();
      await refetchStoreData();
      // Context's useEffect on outletData will sync selectedRestaurantId!
      console.log('[OutletContext] Restaurant linked, forced outlet data + store data refetch.');
    }
  });

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
    refetchOutletData,
    confirmRestaurantChange,
    cancelRestaurantChange,
    confirmationState,
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
