
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStoreData } from '@/hooks/useStoreData';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
}

const OutletContext = createContext<OutletContextType | undefined>(undefined);

export const OutletProvider = ({
  outletId,
  children,
}: { outletId: string | null; children: ReactNode }) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch outlet data using React Query for better state management and caching
  const {
    data: outletData,
    isLoading: loading,
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
      
      // Auto-cleanup for orphaned restaurant links
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
    onSuccess: (data) => {
      // This is the source of truth for the linked restaurant ID
      setSelectedRestaurantId(data?.restaurant_id || null);
    },
    onError: (error) => {
      console.error("Error fetching outlet data:", error);
      toast({ title: 'Error', description: 'Could not fetch outlet data.', variant: 'destructive' });
      setSelectedRestaurantId(null);
    },
    enabled: !!outletId,
  });

  // Fetch store data based on selected restaurant
  const {
    storeData,
    loading: storeLoading,
    error: storeError,
    refetch: refetchStoreData,
  } = useStoreData(selectedRestaurantId || '');

  const restaurant = storeData?.restaurant || null;
  
  // Handle linking a restaurant to the outlet
  const handleRestaurantChange = async (newRestaurantId: string) => {
    if (!outletId || newRestaurantId === selectedRestaurantId) return;

    setSaving(true);
    try {
      const { data: restaurantExists, error: validateError } = await supabase
        .from('restaurants')
        .select('id, name')
        .eq('id', newRestaurantId)
        .maybeSingle();

      if (validateError) throw validateError;
      if (!restaurantExists) throw new Error('Selected restaurant does not exist');

      const { error: updateError } = await supabase
        .from('outlets')
        .update({ restaurant_id: newRestaurantId, updated_at: new Date().toISOString() })
        .eq('id', outletId);

      if (updateError) throw updateError;

      toast({
        title: 'Restaurant Linked Successfully',
        description: `Outlet has been linked to ${restaurantExists.name}.`,
      });
      
      // Optimistically update the UI and then invalidate query to refetch in background
      setSelectedRestaurantId(newRestaurantId);
      queryClient.invalidateQueries({ queryKey: ['outletData', outletId] });

    } catch (error) {
      console.error('Error linking restaurant:', error);
      toast({
        title: 'Linking Failed',
        description: error instanceof Error ? error.message : 'Failed to link outlet to restaurant.',
        variant: 'destructive',
      });
      // On failure, refetch to revert to the correct state from DB
      await queryClient.refetchQueries({ queryKey: ['outletData', outletId] });
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
    refetchOutletData, // Now from useQuery
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
