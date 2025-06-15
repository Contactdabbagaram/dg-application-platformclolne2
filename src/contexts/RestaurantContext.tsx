import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Restaurant {
  id: string;
  name: string;
  address?: string;
  contact_information?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  petpooja_restaurant_id?: string;
  currency_symbol?: string;
  country?: string;
  city?: string;
  state?: string;
  minimum_order_amount?: number;
  minimum_delivery_time?: string;
  minimum_prep_time?: number;
  delivery_charge?: number;
}

interface RestaurantContextType {
  currentRestaurant: Restaurant | null;
  loading: boolean;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDefaultRestaurant = async () => {
      try {
        // First try to get the sample restaurant we just created
        const { data: sampleRestaurant, error: sampleError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', '00000000-0000-0000-0000-000000000001')
          .single();

        if (sampleRestaurant && !sampleError) {
          setCurrentRestaurant(sampleRestaurant);
          setLoading(false);
          return;
        }

        // Fallback to first active restaurant
        const { data: restaurants, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('status', 'active')
          .limit(1);

        if (error) {
          console.error('Error fetching restaurants:', error);
        } else if (restaurants && restaurants.length > 0) {
          setCurrentRestaurant(restaurants[0]);
        }
      } catch (error) {
        console.error('Error in fetchDefaultRestaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultRestaurant();
  }, []);

  const value = {
    currentRestaurant,
    loading,
    setCurrentRestaurant
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
