
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define a type for business settings to ensure consistency
interface BusinessSettings {
  restaurant_id: string;
  google_maps_api_key?: string;
  business_name?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  distance_calculation_method?: string;
  created_at?: string;
  updated_at?: string;
}

const GLOBAL_RESTAURANT_ID = '00000000-0000-0000-0000-000000000001';

async function getBusinessSettings(supabaseClient: SupabaseClient): Promise<Response> {
  const { data, error } = await supabaseClient
    .from('business_settings')
    .select('google_maps_api_key, business_name, business_address, business_phone, business_email, distance_calculation_method')
    .eq('restaurant_id', GLOBAL_RESTAURANT_ID)
    .maybeSingle();

  if (error) {
    console.error('Error fetching business settings from function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const settingsResponse = {
    googleMapsApiKey: data?.google_maps_api_key || '',
    businessName: data?.business_name || 'DabbaGaram',
    businessAddress: data?.business_address || 'Mumbai, Maharashtra',
    businessPhone: data?.business_phone || '+91 98765 43210',
    businessEmail: data?.business_email || 'contact@dabbagaram.com',
    distanceCalculationMethod: data?.distance_calculation_method || 'route',
  };

  return new Response(JSON.stringify(settingsResponse), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function updateBusinessSettings(supabaseClient: SupabaseClient, body: any): Promise<Response> {
  const updates: Partial<BusinessSettings> = {
    restaurant_id: GLOBAL_RESTAURANT_ID, // Ensure this is always set
    updated_at: new Date().toISOString(),
  };

  if (body.googleMapsApiKey !== undefined) updates.google_maps_api_key = body.googleMapsApiKey;
  if (body.businessName !== undefined) updates.business_name = body.businessName;
  if (body.businessAddress !== undefined) updates.business_address = body.businessAddress;
  if (body.businessPhone !== undefined) updates.business_phone = body.businessPhone;
  if (body.businessEmail !== undefined) updates.business_email = body.businessEmail;
  if (body.distanceCalculationMethod !== undefined) updates.distance_calculation_method = body.distanceCalculationMethod;
  
  const { data, error } = await supabaseClient
    .from('business_settings')
    .upsert(updates, { onConflict: 'restaurant_id' })
    .select('google_maps_api_key, business_name, business_address, business_phone, business_email, distance_calculation_method')
    .single();

  if (error) {
    console.error('Error updating business settings from function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const settingsResponse = {
    googleMapsApiKey: data?.google_maps_api_key,
    businessName: data?.business_name,
    businessAddress: data?.business_address,
    businessPhone: data?.business_phone,
    businessEmail: data?.business_email,
    distanceCalculationMethod: data?.distance_calculation_method,
  };

  return new Response(JSON.stringify(settingsResponse), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role key for admin operations
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    if (req.method === 'GET') {
      return await getBusinessSettings(supabaseClient);
    }

    if (req.method === 'POST') {
      const body = await req.json();
      return await updateBusinessSettings(supabaseClient, body);
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Error in business settings function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
