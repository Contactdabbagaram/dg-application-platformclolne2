
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RestaurantLinkOptions {
  onLinked?: (newRestaurantId: string) => void | Promise<void>;
}

export const useRestaurantLink = (
  outletId: string | null,
  currentRestaurantId: string | null,
  options?: RestaurantLinkOptions
) => {
  const [saving, setSaving] = useState(false);
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    newRestaurantId: string | null;
    restaurantName?: string;
  }>({ isOpen: false, newRestaurantId: null });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRestaurantChange = async (newRestaurantId: string) => {
    if (!outletId || newRestaurantId === currentRestaurantId) return;

    try {
      const { data: restaurant, error } = await supabase
        .from('restaurants')
        .select('name')
        .eq('id', newRestaurantId)
        .single();
      
      if (error) throw error;

      if (restaurant) {
        setConfirmationState({ isOpen: true, newRestaurantId, restaurantName: restaurant.name });
      } else {
        throw new Error('Selected restaurant not found.');
      }
    } catch (error) {
      console.error('Error fetching restaurant for confirmation:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not find the selected restaurant.',
        variant: 'destructive',
      });
    }
  };

  const cancelRestaurantChange = () => {
    setConfirmationState({ isOpen: false, newRestaurantId: null, restaurantName: undefined });
  };

  const confirmRestaurantChange = async () => {
    const { newRestaurantId } = confirmationState;
    if (!outletId || !newRestaurantId || newRestaurantId === currentRestaurantId) return;

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

      if (updateError) {
        // Detect RLS error for more actionable feedback
        const rlsMessage = "Permission denied: Row Level Security policy prevented updating the outlet. Please check your access rights.";
        if (updateError.message && updateError.message.toLowerCase().includes("row level security")) {
          toast({
            title: 'Permission Denied',
            description: rlsMessage,
            variant: 'destructive',
          });
          console.error('[useRestaurantLink] RLS UPDATE error:', updateError);
        } else {
          toast({
            title: 'Linking Failed',
            description: updateError.message || 'Failed to link outlet to restaurant.',
            variant: 'destructive',
          });
          console.error('[useRestaurantLink] Update error:', updateError);
        }
        throw updateError;
      }

      toast({
        title: 'Restaurant Linked Successfully',
        description: `Outlet has been linked to ${restaurantExists.name}.`,
      });

      console.log(`[useRestaurantLink] Success: Outlet ${outletId} linked to restaurant ${newRestaurantId}`);

      await queryClient.invalidateQueries({ queryKey: ['outletData', outletId] });
      await queryClient.invalidateQueries({ queryKey: ['store-data', newRestaurantId] });

      // Call the user-provided callback after successful link, if it exists
      if (options && typeof options.onLinked === 'function') {
        await options.onLinked(newRestaurantId);
      }

    } catch (error) {
      // If thrown above, error is already handled, just ensure loading is stopped and dialog closed
      if (!(error instanceof Error)) {
        toast({
          title: 'Unknown Error',
          description: 'An unknown error occurred while linking outlet.',
          variant: 'destructive',
        });
        console.error('[useRestaurantLink] Unknown error:', error);
      }
      await queryClient.refetchQueries({ queryKey: ['outletData', outletId] });
    } finally {
      setSaving(false);
      cancelRestaurantChange();
    }
  };

  return {
    saving,
    confirmationState,
    handleRestaurantChange,
    confirmRestaurantChange,
    cancelRestaurantChange,
  };
};

