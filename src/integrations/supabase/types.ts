export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      category_images: {
        Row: {
          category_name: string
          created_at: string | null
          id: string
          image_size: string | null
          image_url: string
          restaurant_id: string
          updated_at: string | null
        }
        Insert: {
          category_name: string
          created_at?: string | null
          id?: string
          image_size?: string | null
          image_url: string
          restaurant_id: string
          updated_at?: string | null
        }
        Update: {
          category_name?: string
          created_at?: string | null
          id?: string
          image_size?: string | null
          image_url?: string
          restaurant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_images_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          category_id: string | null
          created_at: string | null
          escalated_to_human: boolean | null
          id: string
          resolution_time_minutes: number | null
          resolved_at: string | null
          restaurant_id: string | null
          satisfaction_score: number | null
          session_data: Json | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          escalated_to_human?: boolean | null
          id?: string
          resolution_time_minutes?: number | null
          resolved_at?: string | null
          restaurant_id?: string | null
          satisfaction_score?: number | null
          session_data?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          escalated_to_human?: boolean | null
          id?: string
          resolution_time_minutes?: number | null
          resolved_at?: string | null
          restaurant_id?: string | null
          satisfaction_score?: number | null
          session_data?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "support_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_reviews: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          id: string
          is_active: boolean | null
          is_approved: boolean | null
          order_id: string | null
          rating: number
          restaurant_id: string
          review_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          order_id?: string | null
          rating: number
          restaurant_id: string
          review_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          order_id?: string | null
          rating?: number
          restaurant_id?: string
          review_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      frontend_settings: {
        Row: {
          accent_color: string | null
          accent_color_theme: string | null
          apple_touch_icon_url: string | null
          bestseller_badge_text: string | null
          body_font_family: string | null
          body_font_size: string | null
          body_font_weight: string | null
          body_text_color: string | null
          business_name: string | null
          cart_button_url: string | null
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          copyright_text: string | null
          created_at: string | null
          default_menu_item_image_url: string | null
          delivery_radius_text: string | null
          enable_live_preview: boolean | null
          facebook_url: string | null
          favicon_url: string | null
          footer_about: string | null
          header_bar_color: string | null
          heading_font_family: string | null
          heading_font_size: string | null
          heading_font_weight: string | null
          heading_text_color: string | null
          hero_background_url: string | null
          hero_carousel_timing: number | null
          hero_front_image_url: string | null
          hero_front_images: string[] | null
          hero_subtitle: string | null
          hero_title: string | null
          homepage_theme: string | null
          id: string
          instagram_url: string | null
          logo_url: string | null
          menu_banner_url: string | null
          meta_description: string | null
          meta_keywords: string | null
          navigation_menu: Json | null
          new_badge_text: string | null
          og_description: string | null
          og_image_url: string | null
          og_title: string | null
          order_cutoff_text: string | null
          popular_badge_text: string | null
          primary_button_bg_color: string | null
          primary_button_text_color: string | null
          primary_color: string | null
          primary_cta_text: string | null
          primary_cta_url: string | null
          restaurant_id: string
          secondary_button_bg_color: string | null
          secondary_button_border_color: string | null
          secondary_button_text_color: string | null
          secondary_color: string | null
          secondary_cta_text: string | null
          secondary_cta_url: string | null
          show_cart_button: boolean | null
          show_stat_plus_suffix: boolean | null
          site_title: string | null
          special_badge_text: string | null
          stat_cities: string | null
          stat_cities_label: string | null
          stat_customers: string | null
          stat_customers_label: string | null
          stat_experience: string | null
          stat_experience_label: string | null
          stat_orders: string | null
          stat_orders_label: string | null
          tagline_badge_text: string | null
          twitter_url: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          accent_color?: string | null
          accent_color_theme?: string | null
          apple_touch_icon_url?: string | null
          bestseller_badge_text?: string | null
          body_font_family?: string | null
          body_font_size?: string | null
          body_font_weight?: string | null
          body_text_color?: string | null
          business_name?: string | null
          cart_button_url?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          copyright_text?: string | null
          created_at?: string | null
          default_menu_item_image_url?: string | null
          delivery_radius_text?: string | null
          enable_live_preview?: boolean | null
          facebook_url?: string | null
          favicon_url?: string | null
          footer_about?: string | null
          header_bar_color?: string | null
          heading_font_family?: string | null
          heading_font_size?: string | null
          heading_font_weight?: string | null
          heading_text_color?: string | null
          hero_background_url?: string | null
          hero_carousel_timing?: number | null
          hero_front_image_url?: string | null
          hero_front_images?: string[] | null
          hero_subtitle?: string | null
          hero_title?: string | null
          homepage_theme?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          menu_banner_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          navigation_menu?: Json | null
          new_badge_text?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          order_cutoff_text?: string | null
          popular_badge_text?: string | null
          primary_button_bg_color?: string | null
          primary_button_text_color?: string | null
          primary_color?: string | null
          primary_cta_text?: string | null
          primary_cta_url?: string | null
          restaurant_id: string
          secondary_button_bg_color?: string | null
          secondary_button_border_color?: string | null
          secondary_button_text_color?: string | null
          secondary_color?: string | null
          secondary_cta_text?: string | null
          secondary_cta_url?: string | null
          show_cart_button?: boolean | null
          show_stat_plus_suffix?: boolean | null
          site_title?: string | null
          special_badge_text?: string | null
          stat_cities?: string | null
          stat_cities_label?: string | null
          stat_customers?: string | null
          stat_customers_label?: string | null
          stat_experience?: string | null
          stat_experience_label?: string | null
          stat_orders?: string | null
          stat_orders_label?: string | null
          tagline_badge_text?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          accent_color?: string | null
          accent_color_theme?: string | null
          apple_touch_icon_url?: string | null
          bestseller_badge_text?: string | null
          body_font_family?: string | null
          body_font_size?: string | null
          body_font_weight?: string | null
          body_text_color?: string | null
          business_name?: string | null
          cart_button_url?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          copyright_text?: string | null
          created_at?: string | null
          default_menu_item_image_url?: string | null
          delivery_radius_text?: string | null
          enable_live_preview?: boolean | null
          facebook_url?: string | null
          favicon_url?: string | null
          footer_about?: string | null
          header_bar_color?: string | null
          heading_font_family?: string | null
          heading_font_size?: string | null
          heading_font_weight?: string | null
          heading_text_color?: string | null
          hero_background_url?: string | null
          hero_carousel_timing?: number | null
          hero_front_image_url?: string | null
          hero_front_images?: string[] | null
          hero_subtitle?: string | null
          hero_title?: string | null
          homepage_theme?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          menu_banner_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          navigation_menu?: Json | null
          new_badge_text?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          order_cutoff_text?: string | null
          popular_badge_text?: string | null
          primary_button_bg_color?: string | null
          primary_button_text_color?: string | null
          primary_color?: string | null
          primary_cta_text?: string | null
          primary_cta_url?: string | null
          restaurant_id?: string
          secondary_button_bg_color?: string | null
          secondary_button_border_color?: string | null
          secondary_button_text_color?: string | null
          secondary_color?: string | null
          secondary_cta_text?: string | null
          secondary_cta_url?: string | null
          show_cart_button?: boolean | null
          show_stat_plus_suffix?: boolean | null
          site_title?: string | null
          special_badge_text?: string | null
          stat_cities?: string | null
          stat_cities_label?: string | null
          stat_customers?: string | null
          stat_customers_label?: string | null
          stat_experience?: string | null
          stat_experience_label?: string | null
          stat_orders?: string | null
          stat_orders_label?: string | null
          tagline_badge_text?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "frontend_settings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_addons: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          restaurant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          restaurant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_addons_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          category_timings: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_category_id: string | null
          petpooja_category_id: string | null
          rank: number | null
          restaurant_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category_timings?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_category_id?: string | null
          petpooja_category_id?: string | null
          rank?: number | null
          restaurant_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category_timings?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_category_id?: string | null
          petpooja_category_id?: string | null
          rank?: number | null
          restaurant_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_addons: {
        Row: {
          addon_id: string | null
          id: string
          is_required: boolean | null
          menu_item_id: string | null
        }
        Insert: {
          addon_id?: string | null
          id?: string
          is_required?: boolean | null
          menu_item_id?: string | null
        }
        Update: {
          addon_id?: string | null
          id?: string
          is_required?: boolean | null
          menu_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "menu_addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_addons_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          addon_based_on: number | null
          allow_addon: boolean | null
          allow_variation: boolean | null
          attribute_id: string | null
          base_price: number | null
          calories: number | null
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          ignore_discounts: boolean | null
          ignore_taxes: boolean | null
          image_url: string | null
          in_stock: number | null
          is_favorite: boolean | null
          is_popular: boolean | null
          is_vegetarian: boolean | null
          item_tags: string[] | null
          item_taxes: string | null
          minimum_prep_time: number | null
          name: string
          nutrition: Json | null
          order_types: string | null
          packing_charges: number | null
          petpooja_item_id: string | null
          preparation_time: number | null
          price: number
          rank: number | null
          rating: number | null
          restaurant_id: string | null
          sort_order: number | null
          status: Database["public"]["Enums"]["item_status"] | null
          updated_at: string | null
          variation_group_name: string | null
        }
        Insert: {
          addon_based_on?: number | null
          allow_addon?: boolean | null
          allow_variation?: boolean | null
          attribute_id?: string | null
          base_price?: number | null
          calories?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          ignore_discounts?: boolean | null
          ignore_taxes?: boolean | null
          image_url?: string | null
          in_stock?: number | null
          is_favorite?: boolean | null
          is_popular?: boolean | null
          is_vegetarian?: boolean | null
          item_tags?: string[] | null
          item_taxes?: string | null
          minimum_prep_time?: number | null
          name: string
          nutrition?: Json | null
          order_types?: string | null
          packing_charges?: number | null
          petpooja_item_id?: string | null
          preparation_time?: number | null
          price: number
          rank?: number | null
          rating?: number | null
          restaurant_id?: string | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["item_status"] | null
          updated_at?: string | null
          variation_group_name?: string | null
        }
        Update: {
          addon_based_on?: number | null
          allow_addon?: boolean | null
          allow_variation?: boolean | null
          attribute_id?: string | null
          base_price?: number | null
          calories?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          ignore_discounts?: boolean | null
          ignore_taxes?: boolean | null
          image_url?: string | null
          in_stock?: number | null
          is_favorite?: boolean | null
          is_popular?: boolean | null
          is_vegetarian?: boolean | null
          item_tags?: string[] | null
          item_taxes?: string | null
          minimum_prep_time?: number | null
          name?: string
          nutrition?: Json | null
          order_types?: string | null
          packing_charges?: number | null
          petpooja_item_id?: string | null
          preparation_time?: number | null
          price?: number
          rank?: number | null
          rating?: number | null
          restaurant_id?: string | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["item_status"] | null
          updated_at?: string | null
          variation_group_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_details: {
        Row: {
          collect_cash: number | null
          created_at: string | null
          customer_id: string | null
          delivery_charges: number | null
          discount_total: number | null
          enable_delivery: boolean | null
          id: string
          ondc_bap: string | null
          order_id: string
          order_status: string | null
          order_type: string | null
          otp: string | null
          payment_type: string | null
          preorder_date: string | null
          preorder_time: string | null
          restaurant_id: string | null
          tax_total: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          collect_cash?: number | null
          created_at?: string | null
          customer_id?: string | null
          delivery_charges?: number | null
          discount_total?: number | null
          enable_delivery?: boolean | null
          id?: string
          ondc_bap?: string | null
          order_id: string
          order_status?: string | null
          order_type?: string | null
          otp?: string | null
          payment_type?: string | null
          preorder_date?: string | null
          preorder_time?: string | null
          restaurant_id?: string | null
          tax_total?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          collect_cash?: number | null
          created_at?: string | null
          customer_id?: string | null
          delivery_charges?: number | null
          discount_total?: number | null
          enable_delivery?: boolean | null
          id?: string
          ondc_bap?: string | null
          order_id?: string
          order_status?: string | null
          order_type?: string | null
          otp?: string | null
          payment_type?: string | null
          preorder_date?: string | null
          preorder_time?: string | null
          restaurant_id?: string | null
          tax_total?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_details_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_details_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_discounts: {
        Row: {
          created_at: string | null
          discount_amount: number
          discount_id: string
          discount_title: string
          discount_type: string | null
          id: string
          order_id: string | null
        }
        Insert: {
          created_at?: string | null
          discount_amount: number
          discount_id: string
          discount_title: string
          discount_type?: string | null
          id?: string
          order_id?: string | null
        }
        Update: {
          created_at?: string | null
          discount_amount?: number
          discount_id?: string
          discount_title?: string
          discount_type?: string | null
          id?: string
          order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_discounts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_details"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_addons: {
        Row: {
          addon_name: string
          addon_price: number
          created_at: string | null
          id: string
          order_item_id: string | null
        }
        Insert: {
          addon_name: string
          addon_price: number
          created_at?: string | null
          id?: string
          order_item_id?: string | null
        }
        Update: {
          addon_name?: string
          addon_price?: number
          created_at?: string | null
          id?: string
          order_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_addons_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_addons_details: {
        Row: {
          addon_id: string | null
          addon_name: string
          addon_price: number
          addon_quantity: number | null
          created_at: string | null
          id: string
          order_item_id: string | null
        }
        Insert: {
          addon_id?: string | null
          addon_name: string
          addon_price: number
          addon_quantity?: number | null
          created_at?: string | null
          id?: string
          order_item_id?: string | null
        }
        Update: {
          addon_id?: string | null
          addon_name?: string
          addon_price?: number
          addon_quantity?: number | null
          created_at?: string | null
          id?: string
          order_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_addons_details_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_details"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_details: {
        Row: {
          created_at: string | null
          final_price: number
          id: string
          item_id: string
          item_name: string
          order_id: string | null
          price: number
          quantity: number
          variation_id: string | null
          variation_name: string | null
        }
        Insert: {
          created_at?: string | null
          final_price: number
          id?: string
          item_id: string
          item_name: string
          order_id?: string | null
          price: number
          quantity?: number
          variation_id?: string | null
          variation_name?: string | null
        }
        Update: {
          created_at?: string | null
          final_price?: number
          id?: string
          item_id?: string
          item_name?: string
          order_id?: string | null
          price?: number
          quantity?: number
          variation_id?: string | null
          variation_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_details_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_details"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_taxes: {
        Row: {
          created_at: string | null
          id: string
          order_item_id: string | null
          tax_amount: number
          tax_id: string
          tax_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_item_id?: string | null
          tax_amount: number
          tax_id: string
          tax_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_item_id?: string | null
          tax_amount?: number
          tax_id?: string
          tax_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_item_taxes_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_details"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          item_name: string
          item_price: number
          menu_item_id: string | null
          order_id: string | null
          quantity: number
          special_instructions: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_name: string
          item_price: number
          menu_item_id?: string | null
          order_id?: string | null
          quantity?: number
          special_instructions?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_name?: string
          item_price?: number
          menu_item_id?: string | null
          order_id?: string | null
          quantity?: number
          special_instructions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_taxes: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          tax_amount: number
          tax_id: string
          tax_rate: number | null
          tax_title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          tax_amount: number
          tax_id: string
          tax_rate?: number | null
          tax_title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          tax_amount?: number
          tax_id?: string
          tax_rate?: number | null
          tax_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_taxes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_details"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_notes: string | null
          delivery_address: string | null
          delivery_fee: number | null
          delivery_latitude: number | null
          delivery_longitude: number | null
          discount_amount: number | null
          estimated_delivery_time: string | null
          id: string
          order_number: string
          outlet_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          petpooja_order_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_notes?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          discount_amount?: number | null
          estimated_delivery_time?: string | null
          id?: string
          order_number: string
          outlet_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          petpooja_order_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_notes?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          discount_amount?: number | null
          estimated_delivery_time?: string | null
          id?: string
          order_number?: string
          outlet_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          petpooja_order_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      outlet_timings: {
        Row: {
          closing_time: string | null
          created_at: string | null
          day_of_week: number
          id: string
          is_closed: boolean | null
          opening_time: string | null
          outlet_id: string | null
        }
        Insert: {
          closing_time?: string | null
          created_at?: string | null
          day_of_week: number
          id?: string
          is_closed?: boolean | null
          opening_time?: string | null
          outlet_id?: string | null
        }
        Update: {
          closing_time?: string | null
          created_at?: string | null
          day_of_week?: number
          id?: string
          is_closed?: boolean | null
          opening_time?: string | null
          outlet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outlet_timings_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
      outlets: {
        Row: {
          address: string
          created_at: string | null
          delivery_fee: number | null
          delivery_radius_km: number | null
          email: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          min_order_amount: number | null
          name: string
          phone: string | null
          restaurant_id: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          delivery_fee?: number | null
          delivery_radius_km?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          min_order_amount?: number | null
          name: string
          phone?: string | null
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          delivery_fee?: number | null
          delivery_radius_km?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          min_order_amount?: number | null
          name?: string
          phone?: string | null
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outlets_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      petpooja_addon_groups: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          petpooja_addon_group_id: string
          rank: number | null
          restaurant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          petpooja_addon_group_id: string
          rank?: number | null
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          petpooja_addon_group_id?: string
          rank?: number | null
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "petpooja_addon_groups_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      petpooja_addon_items: {
        Row: {
          addon_group_id: string | null
          attribute_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          petpooja_addon_item_id: string
          price: number
          rank: number | null
          restaurant_id: string | null
          updated_at: string | null
        }
        Insert: {
          addon_group_id?: string | null
          attribute_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          petpooja_addon_item_id: string
          price?: number
          rank?: number | null
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          addon_group_id?: string | null
          attribute_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          petpooja_addon_item_id?: string
          price?: number
          rank?: number | null
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "petpooja_addon_items_addon_group_id_fkey"
            columns: ["addon_group_id"]
            isOneToOne: false
            referencedRelation: "petpooja_addon_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "petpooja_addon_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      petpooja_attributes: {
        Row: {
          attribute_name: string
          created_at: string | null
          id: string
          is_active: boolean | null
          petpooja_attribute_id: string
          restaurant_id: string | null
          updated_at: string | null
        }
        Insert: {
          attribute_name: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          petpooja_attribute_id: string
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          attribute_name?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          petpooja_attribute_id?: string
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "petpooja_attributes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      petpooja_discounts: {
        Row: {
          applicable_on: string | null
          category_item_ids: string | null
          created_at: string | null
          discount_days: string | null
          discount_name: string
          discount_type: number | null
          discount_value: number
          ends_at: string | null
          has_coupon: boolean | null
          id: string
          is_active: boolean | null
          max_amount: number | null
          max_limit: number | null
          min_amount: number | null
          on_total: boolean | null
          order_types: string | null
          petpooja_discount_id: string
          restaurant_id: string | null
          starts_at: string | null
          time_from: string | null
          time_to: string | null
          updated_at: string | null
        }
        Insert: {
          applicable_on?: string | null
          category_item_ids?: string | null
          created_at?: string | null
          discount_days?: string | null
          discount_name: string
          discount_type?: number | null
          discount_value: number
          ends_at?: string | null
          has_coupon?: boolean | null
          id?: string
          is_active?: boolean | null
          max_amount?: number | null
          max_limit?: number | null
          min_amount?: number | null
          on_total?: boolean | null
          order_types?: string | null
          petpooja_discount_id: string
          restaurant_id?: string | null
          starts_at?: string | null
          time_from?: string | null
          time_to?: string | null
          updated_at?: string | null
        }
        Update: {
          applicable_on?: string | null
          category_item_ids?: string | null
          created_at?: string | null
          discount_days?: string | null
          discount_name?: string
          discount_type?: number | null
          discount_value?: number
          ends_at?: string | null
          has_coupon?: boolean | null
          id?: string
          is_active?: boolean | null
          max_amount?: number | null
          max_limit?: number | null
          min_amount?: number | null
          on_total?: boolean | null
          order_types?: string | null
          petpooja_discount_id?: string
          restaurant_id?: string | null
          starts_at?: string | null
          time_from?: string | null
          time_to?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "petpooja_discounts_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      petpooja_item_addon_groups: {
        Row: {
          addon_group_id: string | null
          created_at: string | null
          id: string
          menu_item_id: string | null
          selection_max: number | null
          selection_min: number | null
        }
        Insert: {
          addon_group_id?: string | null
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          selection_max?: number | null
          selection_min?: number | null
        }
        Update: {
          addon_group_id?: string | null
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          selection_max?: number | null
          selection_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "petpooja_item_addon_groups_addon_group_id_fkey"
            columns: ["addon_group_id"]
            isOneToOne: false
            referencedRelation: "petpooja_addon_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "petpooja_item_addon_groups_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      petpooja_item_variations: {
        Row: {
          allow_addon: boolean | null
          created_at: string | null
          group_name: string | null
          id: string
          is_active: boolean | null
          menu_item_id: string | null
          name: string
          packing_charges: number | null
          petpooja_item_variation_id: string
          petpooja_variation_id: string
          price: number
          rank: number | null
          updated_at: string | null
        }
        Insert: {
          allow_addon?: boolean | null
          created_at?: string | null
          group_name?: string | null
          id?: string
          is_active?: boolean | null
          menu_item_id?: string | null
          name: string
          packing_charges?: number | null
          petpooja_item_variation_id: string
          petpooja_variation_id: string
          price: number
          rank?: number | null
          updated_at?: string | null
        }
        Update: {
          allow_addon?: boolean | null
          created_at?: string | null
          group_name?: string | null
          id?: string
          is_active?: boolean | null
          menu_item_id?: string | null
          name?: string
          packing_charges?: number | null
          petpooja_item_variation_id?: string
          petpooja_variation_id?: string
          price?: number
          rank?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "petpooja_item_variations_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      petpooja_order_types: {
        Row: {
          created_at: string | null
          id: string
          order_type_name: string
          petpooja_order_type_id: number
          restaurant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_type_name: string
          petpooja_order_type_id: number
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_type_name?: string
          petpooja_order_type_id?: number
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "petpooja_order_types_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      petpooja_taxes: {
        Row: {
          consider_in_core_amount: boolean | null
          core_or_total: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          order_types: string | null
          petpooja_tax_id: string
          rank: number | null
          restaurant_id: string | null
          tax_name: string
          tax_rate: number
          tax_tax_type: number | null
          tax_type: number | null
          updated_at: string | null
        }
        Insert: {
          consider_in_core_amount?: boolean | null
          core_or_total?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_types?: string | null
          petpooja_tax_id: string
          rank?: number | null
          restaurant_id?: string | null
          tax_name: string
          tax_rate: number
          tax_tax_type?: number | null
          tax_type?: number | null
          updated_at?: string | null
        }
        Update: {
          consider_in_core_amount?: boolean | null
          core_or_total?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_types?: string | null
          petpooja_tax_id?: string
          rank?: number | null
          restaurant_id?: string | null
          tax_name?: string
          tax_rate?: number
          tax_tax_type?: number | null
          tax_type?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "petpooja_taxes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      petpooja_variations: {
        Row: {
          created_at: string | null
          group_name: string | null
          id: string
          name: string
          petpooja_variation_id: string
          restaurant_id: string | null
          status: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          group_name?: string | null
          id?: string
          name: string
          petpooja_variation_id: string
          restaurant_id?: string | null
          status?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          group_name?: string | null
          id?: string
          name?: string
          petpooja_variation_id?: string
          restaurant_id?: string | null
          status?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "petpooja_variations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          calculate_tax_on_delivery: boolean | null
          calculate_tax_on_packing: boolean | null
          city: string | null
          contact_information: string | null
          country: string | null
          created_at: string | null
          currency_symbol: string | null
          delivery_charge: number | null
          delivery_charge_taxes_id: string | null
          id: string
          landmark: string | null
          latitude: number | null
          longitude: number | null
          minimum_delivery_time: string | null
          minimum_order_amount: number | null
          minimum_prep_time: number | null
          name: string
          packaging_applicable_on: string | null
          packaging_charge: number | null
          packaging_charge_type: string | null
          packing_charge_taxes_id: string | null
          petpooja_access_token: string | null
          petpooja_app_key: string | null
          petpooja_app_secret: string | null
          petpooja_restaurant_id: string | null
          service_charge_applicable_on: string | null
          service_charge_calculate_on: number | null
          service_charge_type: number | null
          service_charge_value: number | null
          state: string | null
          status: Database["public"]["Enums"]["restaurant_status"] | null
          tax_on_service_charge: boolean | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          calculate_tax_on_delivery?: boolean | null
          calculate_tax_on_packing?: boolean | null
          city?: string | null
          contact_information?: string | null
          country?: string | null
          created_at?: string | null
          currency_symbol?: string | null
          delivery_charge?: number | null
          delivery_charge_taxes_id?: string | null
          id?: string
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          minimum_delivery_time?: string | null
          minimum_order_amount?: number | null
          minimum_prep_time?: number | null
          name: string
          packaging_applicable_on?: string | null
          packaging_charge?: number | null
          packaging_charge_type?: string | null
          packing_charge_taxes_id?: string | null
          petpooja_access_token?: string | null
          petpooja_app_key?: string | null
          petpooja_app_secret?: string | null
          petpooja_restaurant_id?: string | null
          service_charge_applicable_on?: string | null
          service_charge_calculate_on?: number | null
          service_charge_type?: number | null
          service_charge_value?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["restaurant_status"] | null
          tax_on_service_charge?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          calculate_tax_on_delivery?: boolean | null
          calculate_tax_on_packing?: boolean | null
          city?: string | null
          contact_information?: string | null
          country?: string | null
          created_at?: string | null
          currency_symbol?: string | null
          delivery_charge?: number | null
          delivery_charge_taxes_id?: string | null
          id?: string
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          minimum_delivery_time?: string | null
          minimum_order_amount?: number | null
          minimum_prep_time?: number | null
          name?: string
          packaging_applicable_on?: string | null
          packaging_charge?: number | null
          packaging_charge_type?: string | null
          packing_charge_taxes_id?: string | null
          petpooja_access_token?: string | null
          petpooja_app_key?: string | null
          petpooja_app_secret?: string | null
          petpooja_restaurant_id?: string | null
          service_charge_applicable_on?: string | null
          service_charge_calculate_on?: number | null
          service_charge_type?: number | null
          service_charge_value?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["restaurant_status"] | null
          tax_on_service_charge?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      support_categories: {
        Row: {
          accent_color: string
          color: string
          created_at: string | null
          description: string | null
          icon: string
          id: string
          is_active: boolean | null
          is_urgent: boolean | null
          name: string
          restaurant_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          accent_color?: string
          color?: string
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          is_urgent?: boolean | null
          name: string
          restaurant_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          accent_color?: string
          color?: string
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          is_urgent?: boolean | null
          name?: string
          restaurant_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      support_flows: {
        Row: {
          created_at: string | null
          flow_data: Json
          id: string
          is_active: boolean | null
          name: string
          restaurant_id: string | null
          trigger_category_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          flow_data: Json
          id?: string
          is_active?: boolean | null
          name: string
          restaurant_id?: string | null
          trigger_category_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          flow_data?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          restaurant_id?: string | null
          trigger_category_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_flows_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_flows_trigger_category_id_fkey"
            columns: ["trigger_category_id"]
            isOneToOne: false
            referencedRelation: "support_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      support_responses: {
        Row: {
          buttons: Json | null
          category_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          response_text: string
          response_type: string
          restaurant_id: string | null
          updated_at: string | null
        }
        Insert: {
          buttons?: Json | null
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          response_text: string
          response_type: string
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          buttons?: Json | null
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          response_text?: string
          response_type?: string
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_responses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "support_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_responses_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      support_settings: {
        Row: {
          auto_escalate_after_minutes: number | null
          bot_avatar_url: string | null
          bot_name: string | null
          bot_personality: string | null
          created_at: string | null
          default_language: string | null
          enable_sound: boolean | null
          enable_typing_indicator: boolean | null
          id: string
          is_active: boolean | null
          offline_message: string | null
          response_delay_seconds: number | null
          restaurant_id: string | null
          updated_at: string | null
          working_hours_end: string | null
          working_hours_start: string | null
        }
        Insert: {
          auto_escalate_after_minutes?: number | null
          bot_avatar_url?: string | null
          bot_name?: string | null
          bot_personality?: string | null
          created_at?: string | null
          default_language?: string | null
          enable_sound?: boolean | null
          enable_typing_indicator?: boolean | null
          id?: string
          is_active?: boolean | null
          offline_message?: string | null
          response_delay_seconds?: number | null
          restaurant_id?: string | null
          updated_at?: string | null
          working_hours_end?: string | null
          working_hours_start?: string | null
        }
        Update: {
          auto_escalate_after_minutes?: number | null
          bot_avatar_url?: string | null
          bot_name?: string | null
          bot_personality?: string | null
          created_at?: string | null
          default_language?: string | null
          enable_sound?: boolean | null
          enable_typing_indicator?: boolean | null
          id?: string
          is_active?: boolean | null
          offline_message?: string | null
          response_delay_seconds?: number | null
          restaurant_id?: string | null
          updated_at?: string | null
          working_hours_end?: string | null
          working_hours_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_settings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          created_at: string | null
          data_synced: Json | null
          error_message: string | null
          id: string
          restaurant_id: string | null
          status: Database["public"]["Enums"]["sync_status"] | null
          sync_type: string
        }
        Insert: {
          created_at?: string | null
          data_synced?: Json | null
          error_message?: string | null
          id?: string
          restaurant_id?: string | null
          status?: Database["public"]["Enums"]["sync_status"] | null
          sync_type: string
        }
        Update: {
          created_at?: string | null
          data_synced?: Json | null
          error_message?: string | null
          id?: string
          restaurant_id?: string | null
          status?: Database["public"]["Enums"]["sync_status"] | null
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          content: string
          created_at: string | null
          customer_name: string
          id: string
          is_active: boolean | null
          rating: number | null
          restaurant_id: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          content: string
          created_at?: string | null
          customer_name: string
          id?: string
          is_active?: boolean | null
          rating?: number | null
          restaurant_id: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          content?: string
          created_at?: string | null
          customer_name?: string
          id?: string
          is_active?: boolean | null
          rating?: number | null
          restaurant_id?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          default_address: string | null
          default_latitude: number | null
          default_longitude: number | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_address?: string | null
          default_latitude?: number | null
          default_longitude?: number | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_address?: string | null
          default_latitude?: number | null
          default_longitude?: number | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      item_status: "available" | "unavailable" | "out_of_stock"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "delivered"
        | "cancelled"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      restaurant_status: "active" | "inactive" | "maintenance"
      sync_status: "success" | "failed" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      item_status: ["available", "unavailable", "out_of_stock"],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "paid", "failed", "refunded"],
      restaurant_status: ["active", "inactive", "maintenance"],
      sync_status: ["success", "failed", "pending"],
    },
  },
} as const
