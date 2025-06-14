
-- Create the business_settings table
CREATE TABLE public.business_settings (
  restaurant_id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  google_maps_api_key TEXT NULL,
  business_name TEXT NULL,
  business_address TEXT NULL,
  business_phone TEXT NULL,
  business_email TEXT NULL,
  distance_calculation_method TEXT NULL DEFAULT 'route',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the table
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read settings
CREATE POLICY "Allow authenticated read access to business settings"
ON public.business_settings
FOR SELECT
TO authenticated
USING (true);

-- Allow service_role (e.g., for admin functions) to manage settings
CREATE POLICY "Allow service_role to manage business settings"
ON public.business_settings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Insert a default row for global business settings
-- The Google Maps API key 'AIzaSyASu7HI6LlX0fwcRRfkm4JUbrGtvrJ8c4c' is the one currently hardcoded in LocationSearch.tsx
INSERT INTO public.business_settings (
  restaurant_id,
  google_maps_api_key,
  business_name,
  business_address,
  business_phone,
  business_email,
  distance_calculation_method
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'AIzaSyASu7HI6LlX0fwcRRfkm4JUbrGtvrJ8c4c', -- Using the hardcoded key as a default for now
  'DabbaGaram',
  'Mumbai, Maharashtra',
  '+91 98765 43210',
  'contact@dabbagaram.com',
  'route'
) ON CONFLICT (restaurant_id) DO NOTHING;

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_business_settings_updated_at
BEFORE UPDATE ON public.business_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

