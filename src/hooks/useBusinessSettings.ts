
import { useQuery } from '@tanstack/react-query';

export interface BusinessSettings {
  googleMapsApiKey?: string;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
}

const fetchBusinessSettings = async (): Promise<BusinessSettings> => {
  // Mock implementation - replace with actual API call
  // In a real implementation, this would fetch from your backend
  
  // For now, return mock data that includes Google Maps API key
  // You should replace this with actual API integration
  return {
    googleMapsApiKey: '', // This should come from your admin settings
    businessName: 'Dabba Garam',
    businessAddress: 'Mumbai, Maharashtra',
    businessPhone: '+91 98765 43210',
    businessEmail: 'contact@dabbagaram.com'
  };
};

export const useBusinessSettings = () => {
  return useQuery({
    queryKey: ['business-settings'],
    queryFn: fetchBusinessSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
