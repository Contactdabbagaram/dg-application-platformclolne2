
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BusinessSettings {
  googleMapsApiKey?: string;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  distanceCalculationMethod?: string;
}

const fetchBusinessSettings = async (): Promise<BusinessSettings> => {
  const { data, error } = await supabase.functions.invoke('admin-business-settings', {
    method: 'GET'
  });

  if (error) {
    console.error('Error fetching business settings:', error);
    throw error;
  }

  return data;
};

const updateBusinessSettings = async (settings: BusinessSettings): Promise<BusinessSettings> => {
  const { data, error } = await supabase.functions.invoke('admin-business-settings', {
    method: 'POST',
    body: settings
  });

  if (error) {
    console.error('Error updating business settings:', error);
    throw error;
  }

  return data;
};

export const useBusinessSettings = () => {
  return useQuery({
    queryKey: ['business-settings'],
    queryFn: fetchBusinessSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateBusinessSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBusinessSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-settings'] });
    },
  });
};
