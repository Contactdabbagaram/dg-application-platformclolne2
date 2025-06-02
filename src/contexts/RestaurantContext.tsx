
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Restaurant {
  id: string;
  name: string;
  status: string;
}

interface RestaurantContextType {
  currentRestaurant: Restaurant | null;
  setCurrentRestaurant: (restaurant: Restaurant) => void;
  loading: boolean;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll automatically set the first active restaurant
    // In the future, this could be based on user authentication and permissions
    const fetchDefaultRestaurant = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('status', 'active')
          .order('created_at')
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching restaurant:', error);
        } else if (data) {
          setCurrentRestaurant(data);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultRestaurant();
  }, []);

  return (
    <RestaurantContext.Provider value={{
      currentRestaurant,
      setCurrentRestaurant,
      loading
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};
