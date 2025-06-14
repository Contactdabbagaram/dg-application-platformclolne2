
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PetpoojaMenuItem {
  itemid: string;
  itemname: string;
  itemdescription: string;
  price: number;
  categoryid: string;
  categoryname: string;
  itemimage: string;
  active: number;
  isveg: number;
}

interface PetpoojaCategory {
  categoryid: string;
  categoryname: string;
  categorydesc: string;
  categoryrank: number;
  active: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { outlet_id, sync_type = 'menu' } = await req.json()

    // Get outlet with its restaurant information and PetPooja credentials
    const { data: outlet, error: outletError } = await supabaseClient
      .from('outlets')
      .select(`
        *,
        restaurants!inner(*)
      `)
      .eq('id', outlet_id)
      .single()

    if (outletError || !outlet) {
      throw new Error('Outlet not found')
    }

    if (!outlet.petpooja_app_key || !outlet.petpooja_app_secret) {
      throw new Error('PetPooja credentials not configured for this outlet')
    }

    // Create sync log entry using restaurant_id
    const { data: syncLog, error: syncLogError } = await supabaseClient
      .from('sync_logs')
      .insert({
        restaurant_id: outlet.restaurant_id,
        sync_type,
        status: 'pending'
      })
      .select()
      .single()

    if (syncLogError) {
      throw new Error('Failed to create sync log')
    }

    try {
      if (sync_type === 'menu') {
        await syncMenuFromPetpooja(supabaseClient, outlet, syncLog.id)
      } else if (sync_type === 'orders') {
        await syncOrdersToPetpooja(supabaseClient, outlet, syncLog.id)
      }

      // Update sync log as successful
      await supabaseClient
        .from('sync_logs')
        .update({ status: 'success' })
        .eq('id', syncLog.id)

      return new Response(
        JSON.stringify({ success: true, message: `${sync_type} sync completed for outlet ${outlet.name}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (syncError) {
      // Update sync log as failed
      await supabaseClient
        .from('sync_logs')
        .update({ 
          status: 'failed', 
          error_message: syncError.message 
        })
        .eq('id', syncLog.id)

      throw syncError
    }

  } catch (error) {
    console.error('Error in petpooja-sync:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function syncMenuFromPetpooja(supabaseClient: any, outlet: any, syncLogId: string) {
  const petpoojaBaseUrl = 'https://www.petpooja.com/api/';
  
  // Fetch categories from PetPooja using outlet credentials
  const categoriesResponse = await fetch(`${petpoojaBaseUrl}get_menu_categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_key: outlet.petpooja_app_key,
      app_secret: outlet.petpooja_app_secret,
      access_token: outlet.petpooja_access_token,
      restaurant_id: outlet.petpooja_restaurant_id
    })
  });

  const categoriesData = await categoriesResponse.json();
  
  if (!categoriesData.success) {
    throw new Error(`PetPooja API error: ${categoriesData.message}`);
  }

  // Sync categories to restaurant (shared across outlets)
  for (const category of categoriesData.data as PetpoojaCategory[]) {
    await supabaseClient
      .from('menu_categories')
      .upsert({
        restaurant_id: outlet.restaurant_id,
        petpooja_category_id: category.categoryid,
        name: category.categoryname,
        description: category.categorydesc,
        sort_order: category.categoryrank,
        is_active: category.active === 1
      }, {
        onConflict: 'restaurant_id,petpooja_category_id'
      });
  }

  // Fetch menu items from PetPooja using outlet credentials
  const itemsResponse = await fetch(`${petpoojaBaseUrl}get_menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_key: outlet.petpooja_app_key,
      app_secret: outlet.petpooja_app_secret,
      access_token: outlet.petpooja_access_token,
      restaurant_id: outlet.petpooja_restaurant_id
    })
  });

  const itemsData = await itemsResponse.json();
  
  if (!itemsData.success) {
    throw new Error(`PetPooja API error: ${itemsData.message}`);
  }

  // Get category mappings for this restaurant
  const { data: categories } = await supabaseClient
    .from('menu_categories')
    .select('id, petpooja_category_id')
    .eq('restaurant_id', outlet.restaurant_id);

  const categoryMap = new Map(
    categories?.map((cat: any) => [cat.petpooja_category_id, cat.id]) || []
  );

  // Sync menu items to restaurant (shared across outlets)
  for (const item of itemsData.data as PetpoojaMenuItem[]) {
    const categoryId = categoryMap.get(item.categoryid);
    
    if (categoryId) {
      await supabaseClient
        .from('menu_items')
        .upsert({
          restaurant_id: outlet.restaurant_id,
          category_id: categoryId,
          petpooja_item_id: item.itemid,
          name: item.itemname,
          description: item.itemdescription,
          price: item.price,
          image_url: item.itemimage,
          is_vegetarian: item.isveg === 1,
          status: item.active === 1 ? 'available' : 'unavailable'
        }, {
          onConflict: 'restaurant_id,petpooja_item_id'
        });
    }
  }

  // Update sync log with synced data
  await supabaseClient
    .from('sync_logs')
    .update({
      data_synced: {
        categories_synced: categoriesData.data.length,
        items_synced: itemsData.data.length,
        outlet_name: outlet.name
      }
    })
    .eq('id', syncLogId);
}

async function syncOrdersToPetpooja(supabaseClient: any, outlet: any, syncLogId: string) {
  // Get pending orders for this specific outlet
  const { data: orders, error } = await supabaseClient
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        order_item_addons (*)
      )
    `)
    .is('petpooja_order_id', null)
    .eq('outlet_id', outlet.id)
    .eq('status', 'confirmed');

  if (error) {
    throw new Error('Failed to fetch orders for sync');
  }

  const petpoojaBaseUrl = 'https://www.petpooja.com/api/';
  let syncedOrdersCount = 0;

  for (const order of orders || []) {
    try {
      // Format order for PetPooja using outlet credentials
      const petpoojaOrder = {
        app_key: outlet.petpooja_app_key,
        app_secret: outlet.petpooja_app_secret,
        access_token: outlet.petpooja_access_token,
        restaurant_id: outlet.petpooja_restaurant_id,
        order: {
          order_id: order.order_number,
          customer_name: `Customer ${order.id.slice(-8)}`,
          customer_phone: '9999999999',
          delivery_address: order.delivery_address,
          total_amount: order.total_amount,
          items: order.order_items.map((item: any) => ({
            item_name: item.item_name,
            quantity: item.quantity,
            price: item.item_price,
            addons: item.order_item_addons.map((addon: any) => ({
              name: addon.addon_name,
              price: addon.addon_price
            }))
          }))
        }
      };

      const response = await fetch(`${petpoojaBaseUrl}orderpush`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petpoojaOrder)
      });

      const result = await response.json();
      
      if (result.success) {
        // Update order with PetPooja order ID
        await supabaseClient
          .from('orders')
          .update({
            petpooja_order_id: result.data.order_id,
            status: 'preparing'
          })
          .eq('id', order.id);
        
        syncedOrdersCount++;
      } else {
        console.error(`Failed to sync order ${order.order_number}:`, result.message);
      }
    } catch (orderError) {
      console.error(`Error syncing order ${order.order_number}:`, orderError);
    }
  }

  // Update sync log
  await supabaseClient
    .from('sync_logs')
    .update({
      data_synced: {
        orders_synced: syncedOrdersCount,
        outlet_name: outlet.name
      }
    })
    .eq('id', syncLogId);
}
