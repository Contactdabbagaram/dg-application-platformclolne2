
import { supabase } from '@/integrations/supabase/client';
import { CustomerLocation, OutletLocation } from './locationUtils';

/**
 * Database utility functions for location-based features
 */

export const createLocationValidationFunction = async () => {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE OR REPLACE FUNCTION is_location_in_service_area_simple(
        customer_lat NUMERIC,
        customer_lng NUMERIC,
        outlet_id UUID
      ) RETURNS BOOLEAN AS $$
      DECLARE
        outlet_record RECORD;
        distance_km NUMERIC;
      BEGIN
        -- Get outlet details
        SELECT * INTO outlet_record
        FROM outlets
        WHERE id = outlet_id AND is_active = true;
        
        IF NOT FOUND THEN
          RETURN false;
        END IF;
        
        -- Calculate distance using Haversine formula
        distance_km := (
          6371 * acos(
            cos(radians(customer_lat)) * 
            cos(radians(outlet_record.latitude)) * 
            cos(radians(outlet_record.longitude) - radians(customer_lng)) + 
            sin(radians(customer_lat)) * 
            sin(radians(outlet_record.latitude))
          )
        );
        
        -- Check service area type
        IF outlet_record.service_area_type = 'radius' THEN
          RETURN distance_km <= COALESCE(outlet_record.delivery_radius_km, 10.0);
        ELSE
          -- For geofence, we handle this in application layer
          RETURN distance_km <= COALESCE(outlet_record.delivery_radius_km, 10.0);
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `
  });

  return { error };
};

export const findNearestOutletsDB = async (
  customerLat: number,
  customerLng: number,
  limitCount: number = 5
) => {
  const { data, error } = await supabase.rpc('find_nearest_outlets_simple', {
    customer_lat: customerLat,
    customer_lng: customerLng,
    limit_count: limitCount
  });

  return { data, error };
};

export const validateLocationInServiceArea = async (
  customerLat: number,
  customerLng: number,
  outletId: string
) => {
  const { data, error } = await supabase.rpc('is_location_in_service_area_simple', {
    customer_lat: customerLat,
    customer_lng: customerLng,
    outlet_id: outletId
  });

  return { data, error };
};

/**
 * Update outlet service area settings
 */
export const updateOutletServiceArea = async (
  outletId: string,
  settings: {
    serviceAreaType: 'radius' | 'geofence';
    deliveryRadius: number;
    geofenceEnabled: boolean;
    geofenceCoordinates: any[];
    maxDeliveryDistance: number;
    estimatedDeliveryTime: number;
  }
) => {
  const { data, error } = await supabase
    .from('outlets')
    .update({
      service_area_type: settings.serviceAreaType,
      delivery_radius_km: settings.deliveryRadius,
      geofence_enabled: settings.geofenceEnabled,
      geofence_coordinates: settings.geofenceCoordinates,
      max_delivery_distance_km: settings.maxDeliveryDistance,
      estimated_delivery_time_minutes: settings.estimatedDeliveryTime,
      updated_at: new Date().toISOString()
    })
    .eq('id', outletId);

  return { data, error };
};

/**
 * Get outlets with location data
 */
export const getOutletsWithLocation = async () => {
  const { data, error } = await supabase
    .from('outlets')
    .select(`
      id,
      name,
      address,
      latitude,
      longitude,
      delivery_radius_km,
      service_area_type,
      geofence_enabled,
      geofence_coordinates,
      max_delivery_distance_km,
      estimated_delivery_time_minutes,
      is_active
    `)
    .eq('is_active', true)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  return { data, error };
};
