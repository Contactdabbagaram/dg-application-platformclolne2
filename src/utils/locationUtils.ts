export interface GeofencePoint {
  lat: number;
  lng: number;
}

export interface OutletLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  deliveryRadius: number;
  serviceAreaType: 'radius' | 'geofence';
  geofenceCoordinates?: GeofencePoint[];
  isActive: boolean;
  estimatedDeliveryTime?: number;
  // Add missing properties that are computed dynamically
  distance?: number;
  isInServiceArea?: boolean;
}

export interface CustomerLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * Calculate tiered delivery fee
 */
export const calculateDeliveryFee = (outlet: {
    delivery_fee_type?: string | null;
    delivery_fee?: number | null;
    base_delivery_distance_km?: number | null;
    base_delivery_fee?: number | null;
    per_km_delivery_fee?: number | null;
  }, distance: number): number => {
    if (outlet.delivery_fee_type === 'tiered' && 
        outlet.base_delivery_distance_km != null && outlet.base_delivery_fee != null && outlet.per_km_delivery_fee != null &&
        outlet.base_delivery_distance_km >= 0 && outlet.base_delivery_fee >= 0 && outlet.per_km_delivery_fee >= 0
    ) {
      if (distance <= outlet.base_delivery_distance_km) {
        return outlet.base_delivery_fee;
      } else {
        const extraDistance = distance - outlet.base_delivery_distance_km;
        const extraFee = extraDistance * outlet.per_km_delivery_fee;
        const totalFee = outlet.base_delivery_fee + extraFee;
        return Math.round(totalFee * 100) / 100; // Round to 2 decimal places
      }
    }
    
    return outlet.delivery_fee || 0;
  };

/**
 * Calculate distance between two points using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
export const isPointInPolygon = (
  point: GeofencePoint,
  polygon: GeofencePoint[]
): boolean => {
  if (polygon.length < 3) return false;

  let inside = false;
  const { lat: x, lng: y } = point;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const { lat: xi, lng: yi } = polygon[i];
    const { lat: xj, lng: yj } = polygon[j];

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
};

/**
 * Check if customer location is within outlet's service area
 */
export const isLocationInServiceArea = (
  customerLocation: CustomerLocation,
  outlet: OutletLocation
): boolean => {
  if (!outlet.isActive) return false;

  const distance = calculateDistance(
    customerLocation.latitude,
    customerLocation.longitude,
    outlet.latitude,
    outlet.longitude
  );

  if (outlet.serviceAreaType === 'radius') {
    return distance <= outlet.deliveryRadius;
  }

  if (outlet.serviceAreaType === 'geofence' && outlet.geofenceCoordinates) {
    return isPointInPolygon(
      { lat: customerLocation.latitude, lng: customerLocation.longitude },
      outlet.geofenceCoordinates
    );
  }

  // Fallback to radius check
  return distance <= outlet.deliveryRadius;
};

/**
 * Find nearest outlets to customer location
 */
export const findNearestOutlets = (
  customerLocation: CustomerLocation,
  outlets: OutletLocation[],
  limit: number = 5
): (OutletLocation & { distance: number; isInServiceArea: boolean; estimatedDeliveryTime: number })[] => {
  return outlets
    .filter(outlet => outlet.isActive)
    .map(outlet => {
      const distance = calculateDistance(
        customerLocation.latitude,
        customerLocation.longitude,
        outlet.latitude,
        outlet.longitude
      );

      const isInServiceArea = isLocationInServiceArea(customerLocation, outlet);
      
      const estimatedDeliveryTime = (outlet.estimatedDeliveryTime || 30) + 
        Math.round(distance * 2); // Add 2 minutes per km

      return {
        ...outlet,
        distance,
        isInServiceArea,
        estimatedDeliveryTime
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};

/**
 * Get delivery time estimate based on distance
 */
export const getDeliveryTimeEstimate = (
  customerLocation: CustomerLocation,
  outlet: OutletLocation
): number => {
  const distance = calculateDistance(
    customerLocation.latitude,
    customerLocation.longitude,
    outlet.latitude,
    outlet.longitude
  );

  const baseTime = outlet.estimatedDeliveryTime || 30;
  const travelTime = Math.round(distance * 2); // 2 minutes per km
  
  return baseTime + travelTime;
};

/**
 * Validate if order can be placed from customer location
 */
export const validateOrderLocation = (
  customerLocation: CustomerLocation,
  outlet: OutletLocation
): {
  canOrder: boolean;
  reason?: string;
  distance: number;
  estimatedDeliveryTime: number;
} => {
  const distance = calculateDistance(
    customerLocation.latitude,
    customerLocation.longitude,
    outlet.latitude,
    outlet.longitude
  );

  const estimatedDeliveryTime = getDeliveryTimeEstimate(customerLocation, outlet);
  
  if (!outlet.isActive) {
    return {
      canOrder: false,
      reason: 'This outlet is currently closed',
      distance,
      estimatedDeliveryTime
    };
  }

  const isInServiceArea = isLocationInServiceArea(customerLocation, outlet);
  
  if (!isInServiceArea) {
    return {
      canOrder: false,
      reason: `Delivery not available at this location. We deliver within ${outlet.deliveryRadius}km radius.`,
      distance,
      estimatedDeliveryTime
    };
  }

  return {
    canOrder: true,
    distance,
    estimatedDeliveryTime
  };
};
