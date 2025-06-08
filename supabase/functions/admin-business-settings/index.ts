
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    if (req.method === 'GET') {
      // Get business settings
      const { data: settings, error } = await supabaseClient
        .from('business_settings')
        .select('*')
        .eq('restaurant_id', '00000000-0000-0000-0000-000000000001')
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching business settings:', error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Return settings or default values if not found
      const businessSettings = settings || {
        googleMapsApiKey: '',
        businessName: 'DabbaGaram',
        businessAddress: 'Mumbai, Maharashtra',
        businessPhone: '+91 98765 43210',
        businessEmail: 'contact@dabbagaram.com'
      }

      return new Response(JSON.stringify(businessSettings), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'POST') {
      // Update business settings
      const body = await req.json()
      
      const { data, error } = await supabaseClient
        .from('business_settings')
        .upsert({
          restaurant_id: '00000000-0000-0000-0000-000000000001',
          google_maps_api_key: body.googleMapsApiKey,
          business_name: body.businessName,
          business_address: body.businessAddress,
          business_phone: body.businessPhone,
          business_email: body.businessEmail,
          distance_calculation_method: body.distanceCalculationMethod || 'route',
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error updating business settings:', error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    })
  } catch (error) {
    console.error('Error in business settings function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
