
-- Add store_code column to outlets table
ALTER TABLE public.outlets ADD COLUMN store_code text;

-- Create the Airoli outlet based on the existing Koramangala outlet
INSERT INTO public.outlets (
  name,
  store_code,
  address,
  latitude,
  longitude,
  phone,
  email,
  delivery_radius_km,
  delivery_fee,
  min_order_amount,
  service_area_type,
  estimated_delivery_time_minutes,
  is_active,
  restaurant_id
) VALUES (
  'Airoli',
  'DG-AIR-001',
  'Shop No. 15, Ground Floor, Sector 8, Airoli, Navi Mumbai, Maharashtra 400708',
  19.1568,
  72.9940,
  '+91-9876543210',
  'airoli@dabbagaram.com',
  10.0,
  30,
  200,
  'radius',
  30,
  true,
  (SELECT restaurant_id FROM outlets WHERE name LIKE '%Koramangala%' LIMIT 1)
);
