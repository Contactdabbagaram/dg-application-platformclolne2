
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrderType {
  id: string;
  order_type_name: string;
  created_at: string;
  updated_at: string;
}

export interface Attribute {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Variation {
  id: string;
  name: string;
  group_name?: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddOnGroup {
  id: string;
  name: string;
  rank: number;
  active: boolean;
  restaurant_id: string;
  created_at: string;
  updated_at: string;
}

export interface AddOnItem {
  id: string;
  group_id: string;
  name: string;
  price: number;
  active: boolean;
  attributes?: string;
  rank: number;
  created_at: string;
  updated_at: string;
}

export interface ItemVariation {
  id: string;
  item_id: string;
  variation_id: string;
  price: number;
  rank: number;
  active: boolean;
  packing_charges: number;
  allow_addon: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemAddOnGroup {
  id: string;
  item_id: string;
  add_on_group_id: string;
  selection_min: number;
  selection_max?: number;
  created_at: string;
}

export interface Discount {
  id: string;
  restaurant_id: string;
  name: string;
  type: string;
  value: number;
  ordertype_ids?: string;
  applies_to: 'Items' | 'Categories';
  days?: string;
  starts_at?: string;
  ends_at?: string;
  time_from?: string;
  time_to?: string;
  min_amount?: number;
  max_amount?: number;
  has_coupon: boolean;
  applies_on_ids?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tax {
  id: string;
  restaurant_id: string;
  name: string;
  value: number;
  ordertype_ids?: string;
  type: string;
  core_or_total?: 'core' | 'total';
  rank: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Note: These hooks are temporarily disabled until the new database schema is fully deployed
// and the Supabase types are regenerated. For now, we'll return empty data to prevent errors.

export const useOrderTypes = () => {
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchOrderTypes = async () => {
    console.log('Order types hook - waiting for database schema update');
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderTypes();
  }, []);

  return {
    orderTypes,
    loading,
    refetch: fetchOrderTypes,
  };
};

export const useAttributes = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAttributes = async () => {
    console.log('Attributes hook - waiting for database schema update');
    setLoading(false);
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  return {
    attributes,
    loading,
    refetch: fetchAttributes,
  };
};

export const useAddOnGroups = (restaurantId: string) => {
  const [addOnGroups, setAddOnGroups] = useState<AddOnGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAddOnGroups = async () => {
    console.log('Addon groups hook - waiting for database schema update');
    setLoading(false);
  };

  useEffect(() => {
    if (restaurantId) {
      fetchAddOnGroups();
    }
  }, [restaurantId]);

  return {
    addOnGroups,
    loading,
    refetch: fetchAddOnGroups,
  };
};

export const useAddOnItems = (groupId: string) => {
  const [addOnItems, setAddOnItems] = useState<AddOnItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAddOnItems = async () => {
    console.log('Addon items hook - waiting for database schema update');
    setLoading(false);
  };

  useEffect(() => {
    if (groupId) {
      fetchAddOnItems();
    }
  }, [groupId]);

  return {
    addOnItems,
    loading,
    refetch: fetchAddOnItems,
  };
};

export const useItemVariations = (itemId: string) => {
  const [variations, setVariations] = useState<ItemVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchVariations = async () => {
    console.log('Item variations hook - waiting for database schema update');
    setLoading(false);
  };

  useEffect(() => {
    if (itemId) {
      fetchVariations();
    }
  }, [itemId]);

  return {
    variations,
    loading,
    refetch: fetchVariations,
  };
};

export const useItemAddOnGroups = (itemId: string) => {
  const [itemAddOnGroups, setItemAddOnGroups] = useState<ItemAddOnGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchItemAddOnGroups = async () => {
    console.log('Item addon groups hook - waiting for database schema update');
    setLoading(false);
  };

  useEffect(() => {
    if (itemId) {
      fetchItemAddOnGroups();
    }
  }, [itemId]);

  return {
    itemAddOnGroups,
    loading,
    refetch: fetchItemAddOnGroups,
  };
};
