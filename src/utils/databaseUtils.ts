
import { supabase } from '@/integrations/supabase/client';
import { CustomerLocation, GeofencePoint, OutletLocation, isPointInPolygon } from './locationUtils';

/**
 * Database utility functions for location-based features
 */

export const validateLocationInServiceArea = async (
  customerLat: number,
  customerLng: number,
  outletId: string
) => {
  try {
    // Get outlet details
    const { data: outlet, error } = await supabase
      .from('outlets')
      .select('latitude, longitude, delivery_radius_km, service_area_type, geofence_coordinates')
      .eq('id', outletId)
      .eq('is_active', true)
      .single();

    if (error || !outlet) {
      return { data: false, error };
    }

    if (outlet.service_area_type === 'geofence' && Array.isArray(outlet.geofence_coordinates) && outlet.geofence_coordinates.length > 2) {
      const customerPoint = { lat: customerLat, lng: customerLng };
      const isInServiceArea = isPointInPolygon(customerPoint, outlet.geofence_coordinates as GeofencePoint[]);
      return { data: isInServiceArea, error: null };
    }
    
    // Fallback to radius check
    const R = 6371; // Earth's radius in kilometers
    const dLat = (customerLat - (outlet.latitude || 0)) * Math.PI / 180;
    const dLon = (customerLng - (outlet.longitude || 0)) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((outlet.latitude || 0) * Math.PI / 180) * Math.cos(customerLat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const deliveryRadius = outlet.delivery_radius_km || 10.0;
    const isInServiceArea = distance <= deliveryRadius;

    return { data: isInServiceArea, error: null };
  } catch (error) {
    return { data: false, error };
  }
};

export const findNearestOutletsDB = async (
  customerLat: number,
  customerLng: number,
  limitCount: number = 5
) => {
  try {
    const { data: outlets, error } = await supabase
      .from('outlets')
      .select('*')
      .eq('is_active', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (error) {
      return { data: null, error };
    }

    // Calculate distances and sort
    const outletsWithDistance = outlets.map(outlet => {
      const R = 6371; // Earth's radius in kilometers
      const dLat = (customerLat - outlet.latitude) * Math.PI / 180;
      const dLon = (customerLng - outlet.longitude) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(outlet.latitude * Math.PI / 180) * Math.cos(customerLat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      let isInServiceArea = false;
      if (outlet.service_area_type === 'geofence' && Array.isArray(outlet.geofence_coordinates) && outlet.geofence_coordinates.length > 2) {
        isInServiceArea = isPointInPolygon({ lat: customerLat, lng: customerLng }, outlet.geofence_coordinates as GeofencePoint[]);
      } else {
        const deliveryRadius = outlet.delivery_radius_km || 10.0;
        isInServiceArea = distance <= deliveryRadius;
      }
      
      const baseDeliveryTime = outlet.estimated_delivery_time_minutes || 30;
      const estimatedTime = baseDeliveryTime + Math.round(distance * 2);

      return {
        ...outlet,
        distance_km: distance,
        is_in_service_area: isInServiceArea,
        estimated_delivery_minutes: estimatedTime
      };
    });

    // Sort by distance and limit results
    const sortedOutlets = outletsWithDistance
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, limitCount);

    return { data: sortedOutlets, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

/**
 * Update outlet service area settings
 */
export const updateOutletServiceArea = async (
  outletId: string,
  settings: {
    serviceAreaType: 'radius' | 'geofence';
    deliveryRadius: number;
    geofenceCoordinates: any[];
    maxDeliveryDistance: number;
    estimatedDeliveryTime: number;
  }
) => {
  const updateData = {
    service_area_type: settings.serviceAreaType,
    delivery_radius_km: settings.deliveryRadius,
    geofence_coordinates: settings.geofenceCoordinates,
    max_delivery_distance_km: settings.maxDeliveryDistance,
    estimated_delivery_time_minutes: settings.estimatedDeliveryTime,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('outlets')
    .update(updateData)
    .eq('id', outletId)
    .select()
    .single();

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
      is_active,
      service_area_type,
      geofence_coordinates,
      estimated_delivery_time_minutes
    `)
    .eq('is_active', true)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  return { data, error };
};
