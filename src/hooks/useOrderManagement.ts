
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Hook to fetch orders for a restaurant
export const useOrders = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['orders', restaurantId],
    queryFn: async () => {
      let query = supabase
        .from('order_details')
        .select(`
          *,
          customers(*),
          restaurants(*)
        `)
        .order('created_at', { ascending: false });

      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      return data;
    },
  });
};

// Hook to fetch order details with all related data
export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ['order-details', orderId],
    queryFn: async () => {
      const { data: order, error: orderError } = await supabase
        .from('order_details')
        .select(`
          *,
          customers(*),
          restaurants(*)
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      const { data: items, error: itemsError } = await supabase
        .from('order_item_details')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      const { data: taxes, error: taxesError } = await supabase
        .from('order_taxes')
        .select('*')
        .eq('order_id', orderId);

      if (taxesError) throw taxesError;

      const { data: discounts, error: discountsError } = await supabase
        .from('order_discounts')
        .select('*')
        .eq('order_id', orderId);

      if (discountsError) throw discountsError;

      // Get item-level data for each item
      const itemIds = items?.map(item => item.id) || [];
      
      const { data: itemTaxes, error: itemTaxesError } = await supabase
        .from('order_item_taxes')
        .select('*')
        .in('order_item_id', itemIds);

      if (itemTaxesError) throw itemTaxesError;

      const { data: itemAddons, error: itemAddonsError } = await supabase
        .from('order_item_addons_details')
        .select('*')
        .in('order_item_id', itemIds);

      if (itemAddonsError) throw itemAddonsError;

      return {
        order,
        items: items || [],
        taxes: taxes || [],
        discounts: discounts || [],
        itemTaxes: itemTaxes || [],
        itemAddons: itemAddons || []
      };
    },
    enabled: !!orderId,
  });
};

// Hook to create a new order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData: {
      customer: {
        name: string;
        email?: string;
        address?: string;
        phone?: string;
        latitude?: number;
        longitude?: number;
      };
      order: {
        order_id: string;
        restaurant_id?: string;
        preorder_date?: string;
        preorder_time?: string;
        delivery_charges?: number;
        order_type?: string;
        ondc_bap?: string;
        payment_type?: string;
        discount_total?: number;
        tax_total?: number;
        total_amount: number;
        enable_delivery?: boolean;
        collect_cash?: number;
        otp?: string;
        order_status?: string;
      };
      items: {
        item_id: string;
        item_name: string;
        price: number;
        final_price: number;
        quantity?: number;
        variation_name?: string;
        variation_id?: string;
      }[];
      taxes?: {
        tax_id: string;
        tax_title: string;
        tax_rate?: number;
        tax_amount: number;
      }[];
      discounts?: {
        discount_id: string;
        discount_title: string;
        discount_type?: string;
        discount_amount: number;
      }[];
      itemTaxes?: {
        order_item_id: string;
        tax_id: string;
        tax_name: string;
        tax_amount: number;
      }[];
      itemAddons?: {
        order_item_id: string;
        addon_id?: string;
        addon_name: string;
        addon_price: number;
        addon_quantity?: number;
      }[];
    }) => {
      // Create customer first
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert(orderData.customer)
        .select()
        .single();

      if (customerError) throw customerError;

      // Create order
      const orderToCreate = {
        ...orderData.order,
        customer_id: customer.id
      };

      const { data: order, error: orderError } = await supabase
        .from('order_details')
        .insert(orderToCreate)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const itemsToCreate = orderData.items.map(item => ({
        ...item,
        order_id: order.id
      }));

      const { data: items, error: itemsError } = await supabase
        .from('order_item_details')
        .insert(itemsToCreate)
        .select();

      if (itemsError) throw itemsError;

      // Create order taxes if provided
      if (orderData.taxes && orderData.taxes.length > 0) {
        const taxesToCreate = orderData.taxes.map(tax => ({
          ...tax,
          order_id: order.id
        }));

        await supabase.from('order_taxes').insert(taxesToCreate);
      }

      // Create order discounts if provided
      if (orderData.discounts && orderData.discounts.length > 0) {
        const discountsToCreate = orderData.discounts.map(discount => ({
          ...discount,
          order_id: order.id
        }));

        await supabase.from('order_discounts').insert(discountsToCreate);
      }

      return { order, customer, items };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Order Created",
        description: "New order has been successfully created",
      });
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    },
  });
};

// Hook to update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data, error } = await supabase
        .from('order_details')
        .update({ order_status: status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-details'] });
      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });
};

// Hook to fetch customers
export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }
      
      return data;
    },
  });
};
