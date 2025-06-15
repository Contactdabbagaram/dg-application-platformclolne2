
ALTER TABLE public.outlets
ADD COLUMN delivery_fee_type TEXT NOT NULL DEFAULT 'flat',
ADD COLUMN base_delivery_distance_km NUMERIC DEFAULT 0,
ADD COLUMN base_delivery_fee NUMERIC DEFAULT 0,
ADD COLUMN per_km_delivery_fee NUMERIC DEFAULT 0;

COMMENT ON COLUMN public.outlets.delivery_fee_type IS 'Type of delivery fee calculation: flat or tiered.';
COMMENT ON COLUMN public.outlets.base_delivery_distance_km IS 'For tiered pricing, the base distance in km for the base fee.';
COMMENT ON COLUMN public.outlets.base_delivery_fee IS 'For tiered pricing, the fixed fee for distances up to base_delivery_distance_km.';
COMMENT ON COLUMN public.outlets.per_km_delivery_fee IS 'For tiered pricing, the fee charged per km beyond the base distance.';
