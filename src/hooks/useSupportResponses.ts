
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type SupportResponse = Tables<'support_responses'>;
type SupportResponseInsert = TablesInsert<'support_responses'>;
type SupportResponseUpdate = TablesUpdate<'support_responses'>;

export const useSupportResponses = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['support-responses', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('support_responses')
        .select(`
          *,
          support_categories (
            name,
            id
          )
        `)
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (SupportResponse & { support_categories: { name: string; id: string } | null })[];
    },
    enabled: !!restaurantId,
  });
};

export const useCreateSupportResponse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (response: SupportResponseInsert) => {
      const { data, error } = await supabase
        .from('support_responses')
        .insert(response)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['support-responses', data.restaurant_id] });
    },
  });
};

export const useUpdateSupportResponse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SupportResponseUpdate }) => {
      const { data, error } = await supabase
        .from('support_responses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['support-responses', data.restaurant_id] });
    },
  });
};

export const useDeleteSupportResponse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('support_responses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-responses'] });
    },
  });
};
