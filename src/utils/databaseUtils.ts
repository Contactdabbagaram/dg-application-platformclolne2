
import { supabase } from '@/integrations/supabase/client';
import { CustomerLocation, OutletLocation } from './locationUtils';

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
      .select('*')
      .eq('id', outletId)
      .eq('is_active', true)
      .single();

    if (error || !outlet) {
      return { data: false, error };
    }

    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in kilometers
    const dLat = (customerLat - outlet.latitude) * Math.PI / 180;
    const dLon = (customerLng - outlet.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(outlet.latitude * Math.PI / 180) * Math.cos(customerLat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Check if within delivery radius
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

      const deliveryRadius = outlet.delivery_radius_km || 10.0;
      const isInServiceArea = distance <= deliveryRadius;
      const estimatedTime = (outlet.estimated_delivery_time_minutes || 30) + Math.round(distance * 2);

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
    geofenceEnabled: boolean;
    geofenceCoordinates: any[];
    maxDeliveryDistance: number;
    estimatedDeliveryTime: number;
  }
) => {
  // For now, only update the delivery_radius_km field since that exists in the current schema
  const updateData = {
    delivery_radius_km: settings.deliveryRadius,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('outlets')
    .update(updateData)
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
      is_active
    `)
    .eq('is_active', true)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  return { data, error };
};
