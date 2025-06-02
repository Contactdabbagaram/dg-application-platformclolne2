
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';

type SupportSettings = Tables<'support_settings'>;
type SupportSettingsUpdate = TablesUpdate<'support_settings'>;

export const useSupportSettings = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['support-settings', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      
      const { data, error } = await supabase
        .from('support_settings')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as SupportSettings | null;
    },
    enabled: !!restaurantId,
  });
};

export const useUpdateSupportSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ restaurantId, updates }: { restaurantId: string; updates: SupportSettingsUpdate }) => {
      const { data, error } = await supabase
        .from('support_settings')
        .upsert({ restaurant_id: restaurantId, ...updates })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['support-settings', data.restaurant_id] });
    },
  });
};
