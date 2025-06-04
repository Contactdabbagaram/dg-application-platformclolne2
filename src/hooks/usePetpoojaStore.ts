
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PetpoojaConfig {
  restaurantId: string;
  appKey: string;
  appSecret: string;
  accessToken: string;
}

export const usePetpoojaStore = () => {
  const [loading, setLoading] = useState(false);

  const saveStoreConfig = async (restaurantId: string, config: PetpoojaConfig) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          petpooja_restaurant_id: config.restaurantId,
          petpooja_app_key: config.appKey,
          petpooja_app_secret: config.appSecret,
          petpooja_access_token: config.accessToken,
          updated_at: new Date().toISOString()
        })
        .eq('id', restaurantId);

      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStoreConfig = async (restaurantId: string) => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('petpooja_restaurant_id, petpooja_app_key, petpooja_app_secret, petpooja_access_token')
      .eq('id', restaurantId)
      .single();

    if (error) throw error;
    return data;
  };

  return {
    saveStoreConfig,
    getStoreConfig,
    loading
  };
};
