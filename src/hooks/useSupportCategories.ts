
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type SupportCategory = Tables<'support_categories'>;
type SupportCategoryInsert = TablesInsert<'support_categories'>;
type SupportCategoryUpdate = TablesUpdate<'support_categories'>;

export const useSupportCategories = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['support-categories', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('support_categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('sort_order');
      
      if (error) throw error;
      return data as SupportCategory[];
    },
    enabled: !!restaurantId,
  });
};

export const useCreateSupportCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category: SupportCategoryInsert) => {
      const { data, error } = await supabase
        .from('support_categories')
        .insert(category)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['support-categories', data.restaurant_id] });
    },
  });
};

export const useUpdateSupportCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SupportCategoryUpdate }) => {
      const { data, error } = await supabase
        .from('support_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['support-categories', data.restaurant_id] });
    },
  });
};

export const useDeleteSupportCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('support_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-categories'] });
    },
  });
};
