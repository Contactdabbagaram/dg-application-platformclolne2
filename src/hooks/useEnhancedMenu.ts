
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  base_price?: number;
  image_url: string;
  is_vegetarian: boolean;
  is_popular: boolean;
  status: 'available' | 'unavailable' | 'out_of_stock';
  preparation_time: number;
  minimum_prep_time?: number;
  calories: number;
  rating: number;
  category_id: string;
  restaurant_id: string;
  attribute_id?: string;
  rank: number;
  in_stock: boolean;
  allow_addon: boolean;
  allow_variation: boolean;
  addon_based_on?: number;
  favorite: boolean;
  packing_charges: number;
  ignore_taxes: boolean;
  ignore_discounts: boolean;
  order_types?: string;
  variation_group_name?: string;
  nutrition?: any;
  timing_schedule?: any;
  created_at: string;
  updated_at: string;
}

export interface EnhancedMenuCategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  parent_category_id?: string;
  rank: number;
  sort_order: number;
  is_active: boolean;
  restaurant_id: string;
  timing_schedule?: any;
  created_at: string;
  updated_at: string;
}

export const useEnhancedMenuCategories = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['enhanced-menu-categories', restaurantId],
    queryFn: async () => {
      console.log('Enhanced menu categories - using existing menu_categories table');
      
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
        console.error('Error fetching enhanced categories:', error);
        throw error;
      }
      
      return data.map(item => ({
        ...item,
        rank: item.sort_order || 0,
        timing_schedule: null
      })) as EnhancedMenuCategory[];
    },
  });
};

export const useEnhancedMenuItems = (categoryId?: string, restaurantId?: string) => {
  return useQuery({
    queryKey: ['enhanced-menu-items', categoryId, restaurantId],
    queryFn: async () => {
      console.log('Enhanced menu items - using existing menu_items table with defaults');
      
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('status', 'available')
        .order('sort_order');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching enhanced menu items:', error);
        throw error;
      }
      
      return data.map(item => ({
        ...item,
        base_price: item.price,
        rank: item.sort_order || 0,
        in_stock: true,
        allow_addon: false,
        allow_variation: false,
        favorite: false,
        packing_charges: 0,
        ignore_taxes: false,
        ignore_discounts: false,
        minimum_prep_time: item.preparation_time,
        nutrition: null,
        timing_schedule: null
      })) as EnhancedMenuItem[];
    },
  });
};

export const useMenuItemWithDetails = (itemId: string) => {
  return useQuery({
    queryKey: ['menu-item-details', itemId],
    queryFn: async () => {
      console.log('Menu item details - using basic menu_items for now');
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (error) {
        console.error('Error fetching menu item details:', error);
        throw error;
      }

      // Return with default values for new fields until schema is updated
      return {
        ...data,
        base_price: data.price,
        rank: data.sort_order || 0,
        in_stock: true,
        allow_addon: false,
        allow_variation: false,
        favorite: false,
        packing_charges: 0,
        ignore_taxes: false,
        ignore_discounts: false,
        minimum_prep_time: data.preparation_time,
        item_variations: [],
        item_add_on_groups: [],
        item_tags: [],
        item_nutrition: [],
        item_allergens: []
      };
    },
    enabled: !!itemId,
  });
};

export const useActiveDiscounts = (restaurantId: string, itemIds?: string[]) => {
  return useQuery({
    queryKey: ['active-discounts', restaurantId, itemIds],
    queryFn: async () => {
      console.log('Active discounts - waiting for discounts table');
      return [];
    },
    enabled: !!restaurantId,
  });
};

export const useActiveTaxes = (restaurantId: string) => {
  return useQuery({
    queryKey: ['active-taxes', restaurantId],
    queryFn: async () => {
      console.log('Active taxes - waiting for taxes table');
      return [];
    },
    enabled: !!restaurantId,
  });
};
