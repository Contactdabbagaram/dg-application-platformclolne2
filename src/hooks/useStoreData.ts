
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useStoreData = (restaurantId: string) => {
  const query = useQuery({
    queryKey: ['store-data', restaurantId],
    queryFn: async () => {
      if (!restaurantId) {
        return null;
      }

      console.log('Fetching comprehensive store data for restaurant:', restaurantId);

      // First validate restaurant exists
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .maybeSingle();

      if (restaurantError) {
        console.error('Error fetching restaurant:', restaurantError);
        throw new Error(`Failed to fetch restaurant: ${restaurantError.message}`);
      }

      if (!restaurant) {
        console.error('Restaurant not found for ID:', restaurantId);
        throw new Error('Restaurant not found');
      }

      // Fetch menu categories
      const { data: categories, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('sort_order');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      }

      // Fetch menu items
      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('sort_order');

      if (itemsError) {
        console.error('Error fetching items:', itemsError);
      }

      // Fetch variations
      const { data: variations, error: variationsError } = await supabase
        .from('petpooja_item_variations')
        .select(`
          *,
          menu_items!inner(restaurant_id)
        `)
        .eq('menu_items.restaurant_id', restaurantId);

      if (variationsError) {
        console.error('Error fetching variations:', variationsError);
      }

      // Fetch addon groups and items
      const { data: addonGroups, error: addonError } = await supabase
        .from('petpooja_addon_groups')
        .select(`
          *,
          petpooja_addon_items(*)
        `)
        .eq('restaurant_id', restaurantId);

      if (addonError) {
        console.error('Error fetching addons:', addonError);
      }

      // Fetch taxes
      const { data: taxes, error: taxesError } = await supabase
        .from('petpooja_taxes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('rank');

      if (taxesError) {
        console.error('Error fetching taxes:', taxesError);
      }

      // Fetch discounts
      const { data: discounts, error: discountsError } = await supabase
        .from('petpooja_discounts')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true);

      if (discountsError) {
        console.error('Error fetching discounts:', discountsError);
      }

      // Fetch order types
      const { data: orderTypes, error: orderTypesError } = await supabase
        .from('petpooja_order_types')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (orderTypesError) {
        console.error('Error fetching order types:', orderTypesError);
      }

      // Fetch attributes
      const { data: attributes, error: attributesError } = await supabase
        .from('petpooja_attributes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true);

      if (attributesError) {
        console.error('Error fetching attributes:', attributesError);
      }

      return {
        restaurant,
        categories: categories || [],
        items: items || [],
        variations: variations || [],
        addons: addonGroups || [],
        taxes: taxes || [],
        discounts: discounts || [],
        orderTypes: orderTypes || [],
        attributes: attributes || []
      };
    },
    enabled: !!restaurantId,
  });

  return {
    storeData: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
};
