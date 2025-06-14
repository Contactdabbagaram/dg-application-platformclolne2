
-- Step 1: Add PetPooja API credentials to outlets table
ALTER TABLE public.outlets 
ADD COLUMN petpooja_app_key text,
ADD COLUMN petpooja_app_secret text,
ADD COLUMN petpooja_access_token text,
ADD COLUMN petpooja_restaurant_id text;

-- Step 2: Migrate existing PetPooja credentials from restaurants to outlets
UPDATE public.outlets 
SET 
  petpooja_app_key = r.petpooja_app_key,
  petpooja_app_secret = r.petpooja_app_secret,
  petpooja_access_token = r.petpooja_access_token,
  petpooja_restaurant_id = r.petpooja_restaurant_id
FROM public.restaurants r 
WHERE outlets.restaurant_id = r.id;

-- Step 3: Remove PetPooja credentials from restaurants table (keep API data fields)
ALTER TABLE public.restaurants 
DROP COLUMN IF EXISTS petpooja_app_key,
DROP COLUMN IF EXISTS petpooja_app_secret,
DROP COLUMN IF EXISTS petpooja_access_token,
DROP COLUMN IF EXISTS petpooja_restaurant_id;

-- Add comments to document the separation
COMMENT ON TABLE public.restaurants IS 'Contains restaurant data from PetPooja API - business rules, settings, and core restaurant information';
COMMENT ON TABLE public.outlets IS 'Contains outlet-specific operational data including PetPooja API credentials for menu sync';

-- Add comments to new outlet fields
COMMENT ON COLUMN public.outlets.petpooja_app_key IS 'PetPooja API key for this specific outlet';
COMMENT ON COLUMN public.outlets.petpooja_app_secret IS 'PetPooja API secret for this specific outlet';
COMMENT ON COLUMN public.outlets.petpooja_access_token IS 'PetPooja access token for this specific outlet';
COMMENT ON COLUMN public.outlets.petpooja_restaurant_id IS 'PetPooja restaurant ID for this specific outlet';
