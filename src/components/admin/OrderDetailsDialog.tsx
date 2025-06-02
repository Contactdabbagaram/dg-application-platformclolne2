
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrderDetails, useUpdateOrderStatus } from '@/hooks/useOrderManagement';
import { MapPin, Phone, Clock, DollarSign, Package, Receipt } from 'lucide-react';

interface OrderDetailsDialogProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsDialog = ({ orderId, isOpen, onClose }: OrderDetailsDialogProps) => {
  const { data: orderData, isLoading } = useOrderDetails(orderId);
  const updateOrderStatus = useUpdateOrderStatus();
  const [isUpdating, setIsUpdating] = useState(false);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">Loading order details...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!orderData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">Order not found</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { order, items, taxes, discounts, itemTaxes, itemAddons } = orderData;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
      preparing: { label: "Preparing", color: "bg-orange-100 text-orange-800" },
      ready: { label: "Ready", color: "bg-purple-100 text-purple-800" },
      out_for_delivery: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800" },
      delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus.mutateAsync({ orderId: order.id, status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-5 w-5" />
            Order #{order.order_id}
            {getStatusBadge(order.order_status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Type</p>
                  <p className="font-medium">{order.order_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Type</p>
                  <p className="font-medium">{order.payment_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-lg">₹{order.total_amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(order.created_at).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{(orderData.order as any).customers?.name || 'N/A'}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{(orderData.order as any).customers?.phone || 'N/A'}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{(orderData.order as any).customers?.address || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => {
                  const itemAddonsForItem = itemAddons.filter(addon => addon.order_item_id === item.id);
                  const itemTaxesForItem = itemTaxes.filter(tax => tax.order_item_id === item.id);

                  return (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{item.item_name}</h4>
                          {item.variation_name && (
                            <p className="text-sm text-gray-500">Variation: {item.variation_name}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.final_price} × {item.quantity}</p>
                          <p className="text-sm text-gray-500">₹{(item.final_price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>

                      {itemAddonsForItem.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Add-ons:</p>
                          <div className="space-y-1">
                            {itemAddonsForItem.map((addon) => (
                              <div key={addon.id} className="flex justify-between text-sm">
                                <span>{addon.addon_name} × {addon.addon_quantity}</span>
                                <span>₹{(addon.addon_price * addon.addon_quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {itemTaxesForItem.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Item Taxes:</p>
                          <div className="space-y-1">
                            {itemTaxesForItem.map((tax) => (
                              <div key={tax.id} className="flex justify-between text-sm">
                                <span>{tax.tax_name}</span>
                                <span>₹{tax.tax_amount}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{(order.total_amount - order.tax_total - order.delivery_charges + order.discount_total).toFixed(2)}</span>
                </div>
                
                {order.delivery_charges > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>₹{order.delivery_charges}</span>
                  </div>
                )}

                {taxes.length > 0 && (
                  <>
                    <Separator />
                    {taxes.map((tax) => (
                      <div key={tax.id} className="flex justify-between text-sm">
                        <span>{tax.tax_title} ({tax.tax_rate}%)</span>
                        <span>₹{tax.tax_amount}</span>
                      </div>
                    ))}
                  </>
                )}

                {discounts.length > 0 && (
                  <>
                    <Separator />
                    {discounts.map((discount) => (
                      <div key={discount.id} className="flex justify-between text-sm text-green-600">
                        <span>{discount.discount_title}</span>
                        <span>-₹{discount.discount_amount}</span>
                      </div>
                    ))}
                  </>
                )}

                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{order.total_amount}</span>
                </div>

                {order.collect_cash && (
                  <div className="flex justify-between text-sm">
                    <span>Collect Cash</span>
                    <span>₹{order.collect_cash}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'].map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={isUpdating || order.order_status === status}
                    variant={order.order_status === status ? "default" : "outline"}
                    size="sm"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
