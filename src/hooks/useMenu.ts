import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_vegetarian: boolean;
  is_popular: boolean;
  status: 'available' | 'unavailable' | 'out_of_stock';
  preparation_time: number;
  calories: number;
  rating: number;
  category_id: string;
}

export interface MenuAddon {
  id: string;
  name: string;
  price: number;
  is_required: boolean;
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  is_active: boolean;
  delivery_radius_km: number;
  min_order_amount: number;
  delivery_fee: number;
  restaurant_id: string;
  created_at: string;
  updated_at: string;
}

export interface OutletWithDistance extends Outlet {
  distance: number;
  duration?: number; // Duration in minutes
}

export const useMenuCategories = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['menu-categories', restaurantId],
    queryFn: async () => {
      let query = supabase
        .from('menu_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data as MenuCategory[];
    },
  });
};

export const useMenuItems = (categoryId?: string) => {
  return useQuery({
    queryKey: ['menu-items', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('status', 'available')
        .order('sort_order');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching menu items:', error);
        throw error;
      }
      
      return data as MenuItem[];
    },
  });
};

export const useNearestOutlets = (latitude?: number, longitude?: number) => {
  return useQuery({
    queryKey: ['nearest-outlets', latitude, longitude],
    queryFn: async (): Promise<OutletWithDistance[]> => {
      const { data, error } = await supabase
        .from('outlets')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching outlets:', error);
        throw error;
      }
      
      // Calculate distance and sort by nearest
      if (latitude && longitude) {
        const outletsWithDistance: OutletWithDistance[] = data.map(outlet => {
          const distance = calculateDistance(
            latitude,
            longitude,
            outlet.latitude,
            outlet.longitude
          );
          return { ...outlet, distance };
        });
        
        return outletsWithDistance
          .filter(outlet => outlet.distance <= outlet.delivery_radius_km)
          .sort((a, b) => a.distance - b.distance);
      }
      
      // If no coordinates provided, add distance as 0
      return data.map(outlet => ({ ...outlet, distance: 0 }));
    },
    enabled: !!latitude && !!longitude,
  });
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
