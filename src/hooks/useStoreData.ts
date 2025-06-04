
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useStoreData = (restaurantId: string) => {
  const query = useQuery({
    queryKey: ['store-data', restaurantId],
    queryFn: async () => {
      console.log('Fetching comprehensive store data for restaurant:', restaurantId);

      // Fetch restaurant details
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (restaurantError && restaurantError.code !== 'PGRST116') {
        throw restaurantError;
      }

      // Fetch menu categories
      const { data: categories, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('sort_order');

      // Fetch menu items
      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('sort_order');

      // Fetch variations
      const { data: variations, error: variationsError } = await supabase
        .from('petpooja_item_variations')
        .select(`
          *,
          menu_items!inner(restaurant_id)
        `)
        .eq('menu_items.restaurant_id', restaurantId);

      // Fetch addon groups and items
      const { data: addonGroups, error: addonError } = await supabase
        .from('petpooja_addon_groups')
        .select(`
          *,
          petpooja_addon_items(*)
        `)
        .eq('restaurant_id', restaurantId);

      // Fetch taxes
      const { data: taxes, error: taxesError } = await supabase
        .from('petpooja_taxes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('rank');

      // Fetch discounts
      const { data: discounts, error: discountsError } = await supabase
        .from('petpooja_discounts')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true);

      // Fetch order types
      const { data: orderTypes, error: orderTypesError } = await supabase
        .from('petpooja_order_types')
        .select('*')
        .eq('restaurant_id', restaurantId);

      // Fetch attributes
      const { data: attributes, error: attributesError } = await supabase
        .from('petpooja_attributes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true);

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
