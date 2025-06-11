
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FrontendSettings {
  id?: string;
  restaurant_id: string;
  business_name?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_background_url?: string;
  hero_front_image_url?: string;
  hero_front_images?: string[]; // Array for multiple images
  primary_cta_text?: string;
  secondary_cta_text?: string;
  primary_cta_url?: string;
  secondary_cta_url?: string;
  stat_customers?: string;
  stat_orders?: string;
  stat_cities?: string;
  stat_experience?: string;
  stat_customers_label?: string;
  stat_orders_label?: string;
  stat_cities_label?: string;
  stat_experience_label?: string;
  show_stat_plus_suffix?: boolean;
  contact_phone?: string;
  contact_email?: string;
  contact_address?: string;
  delivery_radius_text?: string;
  order_cutoff_text?: string;
  tagline_badge_text?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  whatsapp_number?: string;
  footer_about?: string;
  copyright_text?: string;
  site_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  popular_badge_text?: string;
  new_badge_text?: string;
  bestseller_badge_text?: string;
  special_badge_text?: string;
  default_menu_item_image_url?: string;
  menu_banner_url?: string;
  favicon_url?: string;
  apple_touch_icon_url?: string;
  header_bar_color?: string;
  primary_button_bg_color?: string;
  primary_button_text_color?: string;
  secondary_button_bg_color?: string;
  secondary_button_text_color?: string;
  secondary_button_border_color?: string;
  accent_color_theme?: string;
  heading_font_family?: string;
  body_font_family?: string;
  heading_font_weight?: string;
  body_font_weight?: string;
  heading_font_size?: string;
  body_font_size?: string;
  heading_text_color?: string;
  body_text_color?: string;
  show_cart_button?: boolean;
  cart_button_url?: string;
  navigation_menu?: any;
  enable_live_preview?: boolean;
  homepage_theme?: string; // New field for homepage theme
}

export const useFrontendSettings = (restaurantId: string) => {
  const [settings, setSettings] = useState<FrontendSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (restaurantId) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [restaurantId]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('frontend_settings')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching frontend settings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch frontend settings",
          variant: "destructive",
        });
        return;
      }

      setSettings(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updatedSettings: Partial<FrontendSettings>) => {
    if (!restaurantId) {
      toast({
        title: "Error",
        description: "No restaurant ID provided",
        variant: "destructive",
      });
      return false;
    }

    try {
      setSaving(true);
      
      const settingsData = {
        ...updatedSettings,
        restaurant_id: restaurantId,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (settings?.id) {
        // Update existing settings
        result = await supabase
          .from('frontend_settings')
          .update(settingsData)
          .eq('id', settings.id)
          .select()
          .single();
      } else {
        // Create new settings
        result = await supabase
          .from('frontend_settings')
          .insert(settingsData)
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving frontend settings:', result.error);
        toast({
          title: "Error",
          description: `Failed to save frontend settings: ${result.error.message}`,
          variant: "destructive",
        });
        return false;
      }

      setSettings(result.data);
      toast({
        title: "Success",
        description: "Frontend settings saved successfully",
      });
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    saveSettings,
    refetch: fetchSettings,
  };
};
