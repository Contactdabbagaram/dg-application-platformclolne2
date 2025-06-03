
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface PetpoojaMenuResponse {
  success: string;
  restaurants: Array<{
    restaurantid: string;
    active: string;
    details: {
      restaurantname: string;
      address: string;
      contact: string;
      latitude: string;
      longitude: string;
      landmark: string;
      city3: string;
      state: string;
      country: string;
      currency_html: string;
      minimumorderamount: string;
      minimumdeliverytime: string;
      minimum_prep_time: string;
      deliverycharge: string;
      sc_applicable_on: string;
      sc_type: string;
      sc_calculate_on: string;
      sc_value: string;
      tax_on_sc: string;
      calculatetaxonpacking: number;
      pc_taxes_id: string;
      calculatetaxondelivery: number;
      dc_taxes_id: string;
      packaging_applicable_on: string;
      packaging_charge: string;
      packaging_charge_type: string;
    };
  }>;
  ordertypes: Array<{
    ordertypeid: number;
    ordertype: string;
  }>;
  categories: Array<{
    categoryid: string;
    active: string;
    categoryrank: string;
    parent_category_id: string;
    categoryname: string;
    categorytimings: string;
    category_image_url: string;
  }>;
  items: Array<{
    itemid: string;
    itemallowvariation: string;
    itemrank: string;
    item_categoryid: string;
    item_ordertype: string;
    item_tags: string[];
    item_packingcharges: string;
    itemallowaddon: string;
    itemaddonbasedon: string;
    item_favorite: string;
    ignore_taxes: string;
    ignore_discounts: string;
    in_stock: string;
    variation_groupname: string;
    variation: Array<{
      id: string;
      variationid: string;
      name: string;
      groupname: string;
      price: string;
      active: string;
      item_packingcharges: string;
      variationrank: string;
      variationallowaddon: number;
    }>;
    addon: Array<{
      addon_group_id: string;
      addon_item_selection_min: string;
      addon_item_selection_max: string;
    }>;
    itemname: string;
    item_attributeid: string;
    itemdescription: string;
    minimumpreparationtime: string;
    price: string;
    active: string;
    item_image_url: string;
    item_tax: string;
    nutrition: any;
  }>;
  variations: Array<{
    variationid: string;
    name: string;
    groupname: string;
    status: string;
  }>;
  addongroups: Array<{
    addongroupid: string;
    addongroup_rank: string;
    active: string;
    addongroup_name: string;
    addongroupitems: Array<{
      addonitemid: string;
      addonitem_name: string;
      addonitem_price: string;
      active: string;
      attributes: string;
      addonitem_rank: string;
    }>;
  }>;
  attributes: Array<{
    attributeid: string;
    attribute: string;
    active: string;
  }>;
  discounts: Array<{
    discountid: string;
    discountname: string;
    discounttype: string;
    discount: string;
    discountordertype: string;
    discountapplicableon: string;
    discountdays: string;
    active: string;
    discountontotal: string;
    discountstarts: string;
    discountends: string;
    discounttimefrom: string;
    discounttimeto: string;
    discountminamount: string;
    discountmaxamount: string;
    discounthascoupon: string;
    discountcategoryitemids: string;
    discountmaxlimit: string;
  }>;
  taxes: Array<{
    taxid: string;
    taxname: string;
    tax: string;
    taxtype: string;
    tax_ordertype: string;
    active: string;
    tax_coreortotal: string;
    tax_taxtype: string;
    rank: string;
    consider_in_core_amount: string;
    description: string;
  }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { petpoojaData } = await req.json() as { petpoojaData: PetpoojaMenuResponse };

    if (!petpoojaData || petpoojaData.success !== '1') {
      throw new Error('Invalid Petpooja data received');
    }

    console.log('Processing Petpooja menu data...');

    // Process restaurants
    for (const restaurant of petpoojaData.restaurants) {
      const restaurantData = {
        petpooja_restaurant_id: restaurant.restaurantid,
        name: restaurant.details.restaurantname,
        address: restaurant.details.address,
        contact_information: restaurant.details.contact,
        latitude: parseFloat(restaurant.details.latitude) || null,
        longitude: parseFloat(restaurant.details.longitude) || null,
        landmark: restaurant.details.landmark,
        city: restaurant.details.city3,
        state: restaurant.details.state,
        country: restaurant.details.country,
        currency_symbol: restaurant.details.currency_html,
        minimum_order_amount: parseFloat(restaurant.details.minimumorderamount) || 0,
        minimum_delivery_time: restaurant.details.minimumdeliverytime,
        minimum_prep_time: parseInt(restaurant.details.minimum_prep_time) || 30,
        delivery_charge: parseFloat(restaurant.details.deliverycharge) || 0,
        service_charge_applicable_on: restaurant.details.sc_applicable_on,
        service_charge_type: parseInt(restaurant.details.sc_type) || null,
        service_charge_calculate_on: parseInt(restaurant.details.sc_calculate_on) || null,
        service_charge_value: parseFloat(restaurant.details.sc_value) || null,
        tax_on_service_charge: restaurant.details.tax_on_sc === '1',
        calculate_tax_on_packing: restaurant.details.calculatetaxonpacking === 1,
        packing_charge_taxes_id: restaurant.details.pc_taxes_id,
        calculate_tax_on_delivery: restaurant.details.calculatetaxondelivery === 1,
        delivery_charge_taxes_id: restaurant.details.dc_taxes_id,
        packaging_applicable_on: restaurant.details.packaging_applicable_on,
        packaging_charge: parseFloat(restaurant.details.packaging_charge) || 0,
        packaging_charge_type: restaurant.details.packaging_charge_type,
        status: restaurant.active === '1' ? 'active' : 'inactive',
        updated_at: new Date().toISOString()
      };

      const { data: existingRestaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('petpooja_restaurant_id', restaurant.restaurantid)
        .single();

      let restaurantId;
      if (existingRestaurant) {
        const { data: updatedRestaurant } = await supabase
          .from('restaurants')
          .update(restaurantData)
          .eq('petpooja_restaurant_id', restaurant.restaurantid)
          .select('id')
          .single();
        restaurantId = updatedRestaurant?.id;
      } else {
        const { data: newRestaurant } = await supabase
          .from('restaurants')
          .insert(restaurantData)
          .select('id')
          .single();
        restaurantId = newRestaurant?.id;
      }

      console.log(`Processed restaurant: ${restaurant.details.restaurantname}`);

      // Process order types
      for (const orderType of petpoojaData.ordertypes) {
        await supabase
          .from('petpooja_order_types')
          .upsert({
            petpooja_order_type_id: orderType.ordertypeid,
            order_type_name: orderType.ordertype,
            restaurant_id: restaurantId,
            updated_at: new Date().toISOString()
          }, { onConflict: 'petpooja_order_type_id,restaurant_id' });
      }

      // Process attributes
      for (const attribute of petpoojaData.attributes) {
        await supabase
          .from('petpooja_attributes')
          .upsert({
            petpooja_attribute_id: attribute.attributeid,
            attribute_name: attribute.attribute,
            is_active: attribute.active === '1',
            restaurant_id: restaurantId,
            updated_at: new Date().toISOString()
          }, { onConflict: 'petpooja_attribute_id,restaurant_id' });
      }

      // Process variations
      for (const variation of petpoojaData.variations) {
        await supabase
          .from('petpooja_variations')
          .upsert({
            petpooja_variation_id: variation.variationid,
            name: variation.name,
            group_name: variation.groupname,
            status: parseInt(variation.status) || 1,
            restaurant_id: restaurantId,
            updated_at: new Date().toISOString()
          }, { onConflict: 'petpooja_variation_id,restaurant_id' });
      }

      // Process addon groups
      for (const addonGroup of petpoojaData.addongroups) {
        const { data: createdAddonGroup } = await supabase
          .from('petpooja_addon_groups')
          .upsert({
            petpooja_addon_group_id: addonGroup.addongroupid,
            name: addonGroup.addongroup_name,
            rank: parseInt(addonGroup.addongroup_rank) || 0,
            is_active: addonGroup.active === '1',
            restaurant_id: restaurantId,
            updated_at: new Date().toISOString()
          }, { onConflict: 'petpooja_addon_group_id,restaurant_id' })
          .select('id')
          .single();

        // Process addon items
        for (const addonItem of addonGroup.addongroupitems) {
          await supabase
            .from('petpooja_addon_items')
            .upsert({
              petpooja_addon_item_id: addonItem.addonitemid,
              name: addonItem.addonitem_name,
              price: parseFloat(addonItem.addonitem_price) || 0,
              attribute_id: addonItem.attributes,
              rank: parseInt(addonItem.addonitem_rank) || 0,
              is_active: addonItem.active === '1',
              addon_group_id: createdAddonGroup?.id,
              restaurant_id: restaurantId,
              updated_at: new Date().toISOString()
            }, { onConflict: 'petpooja_addon_item_id,restaurant_id' });
        }
      }

      // Process taxes
      for (const tax of petpoojaData.taxes) {
        await supabase
          .from('petpooja_taxes')
          .upsert({
            petpooja_tax_id: tax.taxid,
            tax_name: tax.taxname,
            tax_rate: parseFloat(tax.tax) || 0,
            tax_type: parseInt(tax.taxtype) || 1,
            order_types: tax.tax_ordertype,
            is_active: tax.active === '1',
            core_or_total: parseInt(tax.tax_coreortotal) || 2,
            tax_tax_type: parseInt(tax.tax_taxtype) || 1,
            rank: parseInt(tax.rank) || 0,
            consider_in_core_amount: tax.consider_in_core_amount === '1',
            description: tax.description,
            restaurant_id: restaurantId,
            updated_at: new Date().toISOString()
          }, { onConflict: 'petpooja_tax_id,restaurant_id' });
      }

      // Process discounts
      for (const discount of petpoojaData.discounts) {
        await supabase
          .from('petpooja_discounts')
          .upsert({
            petpooja_discount_id: discount.discountid,
            discount_name: discount.discountname,
            discount_type: parseInt(discount.discounttype) || 1,
            discount_value: parseFloat(discount.discount) || 0,
            order_types: discount.discountordertype,
            applicable_on: discount.discountapplicableon,
            discount_days: discount.discountdays,
            is_active: discount.active === '1',
            on_total: discount.discountontotal === '1',
            starts_at: discount.discountstarts ? new Date(discount.discountstarts).toISOString() : null,
            ends_at: discount.discountends ? new Date(discount.discountends).toISOString() : null,
            time_from: discount.discounttimefrom || null,
            time_to: discount.discounttimeto || null,
            min_amount: parseFloat(discount.discountminamount) || null,
            max_amount: parseFloat(discount.discountmaxamount) || null,
            has_coupon: discount.discounthascoupon === '1',
            category_item_ids: discount.discountcategoryitemids,
            max_limit: parseFloat(discount.discountmaxlimit) || null,
            restaurant_id: restaurantId,
            updated_at: new Date().toISOString()
          }, { onConflict: 'petpooja_discount_id,restaurant_id' });
      }

      // Process categories
      for (const category of petpoojaData.categories) {
        await supabase
          .from('menu_categories')
          .upsert({
            petpooja_category_id: category.categoryid,
            name: category.categoryname,
            description: '',
            image_url: category.category_image_url || null,
            parent_category_id: category.parent_category_id === '0' ? null : category.parent_category_id,
            rank: parseInt(category.categoryrank) || 0,
            sort_order: parseInt(category.categoryrank) || 0,
            category_timings: category.categorytimings || null,
            is_active: category.active === '1',
            restaurant_id: restaurantId,
            updated_at: new Date().toISOString()
          }, { onConflict: 'petpooja_category_id,restaurant_id' });
      }

      // Process items
      for (const item of petpoojaData.items) {
        // Find category
        const { data: category } = await supabase
          .from('menu_categories')
          .select('id')
          .eq('petpooja_category_id', item.item_categoryid)
          .eq('restaurant_id', restaurantId)
          .single();

        const itemData = {
          petpooja_item_id: item.itemid,
          name: item.itemname,
          description: item.itemdescription || '',
          price: parseFloat(item.price) || 0,
          base_price: parseFloat(item.price) || 0,
          image_url: item.item_image_url || null,
          is_vegetarian: item.item_attributeid === '1',
          is_popular: false,
          status: item.active === '1' ? 'available' : 'unavailable',
          preparation_time: parseInt(item.minimumpreparationtime) || 15,
          minimum_prep_time: parseInt(item.minimumpreparationtime) || null,
          calories: null,
          rating: 0,
          sort_order: parseInt(item.itemrank) || 0,
          rank: parseInt(item.itemrank) || 0,
          in_stock: parseInt(item.in_stock) || 2,
          allow_addon: item.itemallowaddon === '1',
          allow_variation: item.itemallowvariation === '1',
          addon_based_on: parseInt(item.itemaddonbasedon) || 0,
          is_favorite: item.item_favorite === '1',
          packing_charges: parseFloat(item.item_packingcharges) || 0,
          ignore_taxes: item.ignore_taxes === '1',
          ignore_discounts: item.ignore_discounts === '1',
          order_types: item.item_ordertype,
          variation_group_name: item.variation_groupname || null,
          item_taxes: item.item_tax,
          item_tags: item.item_tags,
          attribute_id: item.item_attributeid,
          nutrition: item.nutrition,
          category_id: category?.id,
          restaurant_id: restaurantId,
          updated_at: new Date().toISOString()
        };

        const { data: createdItem } = await supabase
          .from('menu_items')
          .upsert(itemData, { onConflict: 'petpooja_item_id,restaurant_id' })
          .select('id')
          .single();

        // Process item variations
        for (const variation of item.variation) {
          await supabase
            .from('petpooja_item_variations')
            .upsert({
              petpooja_item_variation_id: variation.id,
              petpooja_variation_id: variation.variationid,
              name: variation.name,
              group_name: variation.groupname,
              price: parseFloat(variation.price) || 0,
              packing_charges: parseFloat(variation.item_packingcharges) || 0,
              rank: parseInt(variation.variationrank) || 0,
              allow_addon: variation.variationallowaddon === 1,
              is_active: variation.active === '1',
              menu_item_id: createdItem?.id,
              updated_at: new Date().toISOString()
            }, { onConflict: 'petpooja_item_variation_id' });
        }

        // Process item addon group mappings
        for (const addon of item.addon) {
          const { data: addonGroup } = await supabase
            .from('petpooja_addon_groups')
            .select('id')
            .eq('petpooja_addon_group_id', addon.addon_group_id)
            .eq('restaurant_id', restaurantId)
            .single();

          if (addonGroup) {
            await supabase
              .from('petpooja_item_addon_groups')
              .upsert({
                menu_item_id: createdItem?.id,
                addon_group_id: addonGroup.id,
                selection_min: parseInt(addon.addon_item_selection_min) || 0,
                selection_max: parseInt(addon.addon_item_selection_max) || 1,
                created_at: new Date().toISOString()
              }, { onConflict: 'menu_item_id,addon_group_id' });
          }
        }
      }

      console.log(`Completed processing restaurant: ${restaurant.details.restaurantname}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Menu data synced successfully',
        processed: {
          restaurants: petpoojaData.restaurants.length,
          categories: petpoojaData.categories.length,
          items: petpoojaData.items.length,
          variations: petpoojaData.variations.length,
          addonGroups: petpoojaData.addongroups.length,
          taxes: petpoojaData.taxes.length,
          discounts: petpoojaData.discounts.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing Petpooja menu data:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
