
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/hooks/useOrderManagement';
import OrderDetailsDialog from './OrderDetailsDialog';
import { Search, Filter, Clock, MapPin, Phone, Package, Eye } from 'lucide-react';

const EnhancedOrderManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const { data: orders, isLoading } = useOrders();

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

  const filteredOrders = orders?.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.order_status === selectedStatus;
    const matchesSearch = order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order as any).customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         '';
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Enhanced Order Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export Orders</Button>
          <Button>Refresh</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by order ID or customer name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders?.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold">#{order.order_id}</h3>
                    {getStatusBadge(order.order_status)}
                    <span className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">{(order as any).customers?.name || 'Unknown Customer'}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{(order as any).customers?.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-start gap-2 mt-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span className="truncate">{(order as any).customers?.address || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Order Details:</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>{order.order_type || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment:</span>
                          <span>{order.payment_type || 'N/A'}</span>
                        </div>
                        {order.delivery_charges > 0 && (
                          <div className="flex justify-between">
                            <span>Delivery:</span>
                            <span>₹{order.delivery_charges}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <p className="text-2xl font-bold">₹{order.total_amount}</p>
                  {order.otp && (
                    <p className="text-sm text-gray-600 mt-1">OTP: {order.otp}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Dialog */}
      {selectedOrderId && (
        <OrderDetailsDialog
          orderId={selectedOrderId}
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};

export default EnhancedOrderManagement;
