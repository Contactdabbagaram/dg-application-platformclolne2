
-- Add columns to support geofencing, service area types, and other related settings in the outlets table
ALTER TABLE public.outlets
ADD COLUMN IF NOT EXISTS service_area_type TEXT NOT NULL DEFAULT 'radius',
ADD COLUMN IF NOT EXISTS geofence_coordinates JSONB,
ADD COLUMN IF NOT EXISTS estimated_delivery_time_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS max_delivery_distance_km NUMERIC;
