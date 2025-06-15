
-- Revert the column type for minimum_delivery_time back to TEXT
ALTER TABLE public.restaurants
ALTER COLUMN minimum_delivery_time TYPE TEXT USING (minimum_delivery_time::text);

-- Remove the default value from the column
ALTER TABLE public.restaurants
ALTER COLUMN minimum_delivery_time DROP DEFAULT;

-- Remove the comment from the column
COMMENT ON COLUMN public.restaurants.minimum_delivery_time IS NULL;
