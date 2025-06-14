
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

const GLOBAL_RESTAURANT_ID = '00000000-0000-0000-0000-000000000001'; // For global business settings

const fetchBusinessSettings = async (): Promise<BusinessSettings> => {
  const { data, error } = await supabase
    .from('business_settings')
    .select('google_maps_api_key, business_name, business_address, business_phone, business_email, distance_calculation_method')
    .eq('restaurant_id', GLOBAL_RESTAURANT_ID)
    .maybeSingle(); // Use maybeSingle to handle case where settings might not exist yet

  if (error) {
    console.error('Error fetching business settings:', error);
    throw error;
  }

  // Return mapped data or default values if not found
  return {
    googleMapsApiKey: data?.google_maps_api_key || '',
    businessName: data?.business_name || 'DabbaGaram',
    businessAddress: data?.business_address || '',
    businessPhone: data?.business_phone || '',
    businessEmail: data?.business_email || '',
    distanceCalculationMethod: data?.distance_calculation_method || 'route',
  };
};

const updateBusinessSettings = async (settings: BusinessSettings): Promise<BusinessSettings> => {
  const updates = {
    restaurant_id: GLOBAL_RESTAURANT_ID,
    google_maps_api_key: settings.googleMapsApiKey,
    business_name: settings.businessName,
    business_address: settings.businessAddress,
    business_phone: settings.businessPhone,
    business_email: settings.businessEmail,
    distance_calculation_method: settings.distanceCalculationMethod,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('business_settings')
    .upsert(updates, { onConflict: 'restaurant_id' })
    .select('google_maps_api_key, business_name, business_address, business_phone, business_email, distance_calculation_method')
    .single();

  if (error) {
    console.error('Error updating business settings:', error);
    throw error;
  }

  return {
    googleMapsApiKey: data.google_maps_api_key || '',
    businessName: data.business_name || 'DabbaGaram',
    businessAddress: data.business_address || '',
    businessPhone: data.business_phone || '',
    businessEmail: data.business_email || '',
    distanceCalculationMethod: data.distance_calculation_method || 'route',
  };
};

export const useBusinessSettings = () => {
  return useQuery({
    queryKey: ['business-settings', GLOBAL_RESTAURANT_ID],
    queryFn: fetchBusinessSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateBusinessSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBusinessSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['business-settings', GLOBAL_RESTAURANT_ID], data);
      queryClient.invalidateQueries({ queryKey: ['business-settings', GLOBAL_RESTAURANT_ID] });
    },
  });
};
