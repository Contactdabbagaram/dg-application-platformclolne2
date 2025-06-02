
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Clock, MapPin, Phone } from 'lucide-react';

interface OutletOrdersProps {
  outletName: string;
}

const OutletOrders = ({ outletName }: OutletOrdersProps) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const orders = [
    {
      id: "ORD001",
      customer: "Rahul Sharma",
      phone: "+91 98765 43210",
      address: "A-301, Sunshine Apartments, Sector 7, Airoli",
      items: ["Butter Chicken", "Naan", "Rice"],
      amount: 450,
      status: "preparing",
      time: "10 mins ago",
      estimatedTime: "20 mins"
    },
    {
      id: "ORD002",
      customer: "Priya Patel",
      phone: "+91 87654 32109",
      address: "B-205, Green Valley Society, Sector 8, Airoli",
      items: ["Paneer Tikka", "Roti", "Dal"],
      amount: 320,
      status: "delivered",
      time: "25 mins ago",
      estimatedTime: "Delivered"
    },
    {
      id: "ORD003",
      customer: "Amit Kumar",
      phone: "+91 76543 21098",
      address: "C-102, Royal Gardens, Sector 9, Airoli",
      items: ["Biryani", "Raita", "Kebab"],
      amount: 680,
      status: "out_for_delivery",
      time: "35 mins ago",
      estimatedTime: "5 mins"
    },
    {
      id: "ORD004",
      customer: "Sneha Gupta",
      phone: "+91 65432 10987",
      address: "D-404, Paradise Heights, Sector 6, Airoli",
      items: ["Dosa", "Sambhar", "Chutney"],
      amount: 290,
      status: "confirmed",
      time: "45 mins ago",
      estimatedTime: "35 mins"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      preparing: { label: "Preparing", color: "bg-yellow-100 text-yellow-800" },
      delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
      out_for_delivery: { label: "Out for Delivery", color: "bg-blue-100 text-blue-800" },
      confirmed: { label: "Confirmed", color: "bg-gray-100 text-gray-800" },
      cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Store Orders - {outletName}</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Refresh Orders</Button>
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
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
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
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold">{order.id}</h3>
                    {getStatusBadge(order.status)}
                    <span className="text-sm text-gray-500">{order.time}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{order.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 mt-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span>{order.address}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <p className="text-2xl font-bold">₹{order.amount}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{order.estimatedTime}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {order.status === 'confirmed' && (
                      <Button size="sm">Accept</Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button size="sm">Ready</Button>
                    )}
                    <Button variant="outline" size="sm">Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OutletOrders;
