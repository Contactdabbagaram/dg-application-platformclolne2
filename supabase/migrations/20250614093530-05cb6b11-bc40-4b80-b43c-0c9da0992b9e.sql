
-- Remove top bar info fields from frontend_settings table
ALTER TABLE public.frontend_settings
  DROP COLUMN IF EXISTS contact_phone,
  DROP COLUMN IF EXISTS delivery_radius_text,
  DROP COLUMN IF EXISTS order_cutoff_text;
