
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomerReview {
  id: string;
  customer_name: string;
  customer_email?: string;
  rating: number;
  review_text: string;
  order_id?: string;
  restaurant_id: string;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCustomerReviews = (restaurantId: string, limit: number = 6) => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (restaurantId) {
      fetchReviews();
    }
  }, [restaurantId, limit]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_approved', true)
        .eq('is_active', true)
        .gte('rating', 4)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching customer reviews:', error);
        setReviews([]);
        return;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews,
    loading,
    refetch: fetchReviews,
  };
};
