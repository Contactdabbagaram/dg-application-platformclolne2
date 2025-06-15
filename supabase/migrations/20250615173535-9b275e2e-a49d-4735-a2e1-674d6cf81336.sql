
ALTER TABLE public.outlets
ADD COLUMN minimum_prep_time INTEGER DEFAULT 30,
ADD COLUMN minimum_delivery_time INTEGER DEFAULT 30,
ADD COLUMN packaging_charge NUMERIC DEFAULT 0,
ADD COLUMN service_charge_value NUMERIC;

COMMENT ON COLUMN public.outlets.minimum_prep_time IS 'Minimum time in minutes to prepare an order at this outlet.';
COMMENT ON COLUMN public.outlets.minimum_delivery_time IS 'Minimum delivery time in minutes from this outlet.';
COMMENT ON COLUMN public.outlets.packaging_charge IS 'Packaging charge for orders from this outlet.';
COMMENT ON COLUMN public.outlets.service_charge_value IS 'Service charge value for orders from this outlet.';
