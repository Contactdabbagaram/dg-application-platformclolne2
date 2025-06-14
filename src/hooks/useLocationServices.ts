
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CustomerLocation, OutletLocation, findNearestOutlets } from '@/utils/locationUtils';

export const useLocationServices = () => {
  const [customerLocation, setCustomerLocation] = useState<CustomerLocation | null>(null);
  const [nearestOutlets, setNearestOutlets] = useState<OutletLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = (): Promise<CustomerLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Location access denied: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const searchLocationByAddress = async (address: string): Promise<CustomerLocation[]> => {
    // This would integrate with Google Maps Geocoding API in production
    // For now, return mock data
    console.log('Searching for address:', address);
    
    // Mock geocoding results
    const mockResults: CustomerLocation[] = [
      {
        latitude: 19.1568,
        longitude: 72.9940,
        address: `${address}, Mumbai, Maharashtra`
      }
    ];
    
    return mockResults;
  };

  const fetchOutlets = async (): Promise<OutletLocation[]> => {
    const { data, error } = await supabase
      .from('outlets')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    return data.map(outlet => ({
      id: outlet.id,
      name: outlet.name,
      latitude: outlet.latitude || 0,
      longitude: outlet.longitude || 0,
      deliveryRadius: outlet.delivery_radius_km || 10,
      serviceAreaType: (outlet as any).service_area_type || 'radius',
      geofenceCoordinates: (outlet as any).geofence_coordinates || [],
      isActive: outlet.is_active,
      estimatedDeliveryTime: (outlet as any).estimated_delivery_time_minutes || 30
    }));
  };

  const findNearestOutletsForLocation = async (location: CustomerLocation) => {
    try {
      setLoading(true);
      setError(null);
      
      const outlets = await fetchOutlets();
      const nearest = findNearestOutlets(location, outlets, 5);
      
      setNearestOutlets(nearest);
      setCustomerLocation(location);
      
      return nearest;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to find outlets';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomerLocation = async (location: CustomerLocation) => {
    await findNearestOutletsForLocation(location);
  };

  return {
    customerLocation,
    nearestOutlets,
    loading,
    error,
    getCurrentLocation,
    searchLocationByAddress,
    findNearestOutletsForLocation,
    updateCustomerLocation,
    setCustomerLocation
  };
};
