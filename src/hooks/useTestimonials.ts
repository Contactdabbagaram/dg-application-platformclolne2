
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Testimonial {
  id: string;
  restaurant_id: string;
  customer_name: string;
  content: string;
  rating: number;
  avatar_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useTestimonials = (restaurantId: string) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (restaurantId) {
      fetchTestimonials();
    }
  }, [restaurantId]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching testimonials:', error);
        toast({
          title: "Error",
          description: "Failed to fetch testimonials",
          variant: "destructive",
        });
        return;
      }

      setTestimonials(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          ...testimonial,
          restaurant_id: restaurantId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding testimonial:', error);
        toast({
          title: "Error",
          description: "Failed to add testimonial",
          variant: "destructive",
        });
        return false;
      }

      setTestimonials(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Testimonial added successfully",
      });
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating testimonial:', error);
        toast({
          title: "Error",
          description: "Failed to update testimonial",
          variant: "destructive",
        });
        return false;
      }

      setTestimonials(prev => prev.map(t => t.id === id ? data : t));
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting testimonial:', error);
        toast({
          title: "Error",
          description: "Failed to delete testimonial",
          variant: "destructive",
        });
        return false;
      }

      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    testimonials,
    loading,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    refetch: fetchTestimonials,
  };
};
