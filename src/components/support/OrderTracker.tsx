
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Phone,
  Search,
  Sparkles
} from 'lucide-react';

interface Order {
  id: string;
  status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'delayed';
  items: string[];
  total: number;
  estimatedTime: string;
  actualTime?: string;
  deliveryAddress: string;
  customerPhone: string;
  progress: number;
  delayReason?: string;
  driverName?: string;
  driverPhone?: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD001',
    status: 'out_for_delivery',
    items: ['Butter Chicken', 'Naan Bread', 'Basmati Rice'],
    total: 450,
    estimatedTime: '25 mins',
    deliveryAddress: 'A-301, Sunshine Apartments, Sector 7',
    customerPhone: '+91 9876543210',
    progress: 75,
    driverName: 'Rahul Kumar',
    driverPhone: '+91 9988776655'
  },
  {
    id: 'ORD002',
    status: 'delayed',
    items: ['Paneer Tikka', 'Roti', 'Dal Makhani'],
    total: 320,
    estimatedTime: '45 mins',
    deliveryAddress: 'B-205, Green Valley Society, Sector 8',
    customerPhone: '+91 8765432109',
    progress: 40,
    delayReason: 'High order volume during peak hours'
  }
];

export const OrderTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    setTimeout(() => {
      const order = mockOrders.find(o => 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerPhone.includes(searchTerm)
      );
      setSearchedOrder(order || null);
      setIsSearching(false);
    }, 1000);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'preparing':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'out_for_delivery':
        return <Truck className="h-5 w-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'delayed':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'delayed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Order['status']) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderOrderTimeline = (order: Order) => {
    const steps = [
      { key: 'placed', label: 'Order Placed', emoji: '📝', completed: true },
      { key: 'preparing', label: 'Preparing', emoji: '👨‍🍳', completed: order.progress >= 25 },
      { key: 'out_for_delivery', label: 'Out for Delivery', emoji: '🛵', completed: order.progress >= 75 },
      { key: 'delivered', label: 'Delivered', emoji: '✅', completed: order.status === 'delivered' }
    ];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            Order Progress
          </h4>
          <span className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full">
            {order.progress}% Complete
          </span>
        </div>
        
        <div className="relative">
          <Progress value={order.progress} className="mb-6 h-2" />
          <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1">
            {steps.map((step, index) => (
              <div key={step.key} className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-all duration-300 ${
                  step.completed 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500 text-white shadow-lg' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {step.completed ? '✓' : index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((step) => (
            <div key={step.key} className={`p-3 rounded-xl text-center transition-all duration-300 ${
              step.completed 
                ? 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="text-lg mb-1">{step.emoji}</div>
              <span className={`text-xs font-medium ${
                step.completed ? 'text-green-800' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Track Your Order
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter order ID or phone number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchedOrder && (
        <Card className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 border border-white/30">
                  {getStatusIcon(searchedOrder.status)}
                </div>
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Order {searchedOrder.id}
                </span>
              </CardTitle>
              <Badge className={`${getStatusColor(searchedOrder.status)} border rounded-xl px-3 py-1 font-medium`}>
                {getStatusText(searchedOrder.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white/40 rounded-xl border border-white/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  🍽️ Order Items
                </h4>
                <ul className="space-y-2">
                  {searchedOrder.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-white/30">
                  <p className="font-semibold text-lg text-gray-800">Total: ₹{searchedOrder.total}</p>
                </div>
              </div>

              <div className="p-4 bg-white/40 rounded-xl border border-white/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  📍 Delivery Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-sm text-gray-700">{searchedOrder.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{searchedOrder.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">ETA: {searchedOrder.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delay Notice */}
            {searchedOrder.status === 'delayed' && searchedOrder.delayReason && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-1">⚠️ Order Delayed</h4>
                    <p className="text-sm text-orange-700 mb-2">{searchedOrder.delayReason}</p>
                    <p className="text-sm font-medium text-orange-800">
                      🕐 New estimated time: {searchedOrder.estimatedTime}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Driver Info */}
            {searchedOrder.status === 'out_for_delivery' && searchedOrder.driverName && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  🛵 Your Delivery Partner
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">{searchedOrder.driverName}</p>
                    <p className="text-xs text-blue-600">{searchedOrder.driverPhone}</p>
                  </div>
                  <Button size="sm" variant="outline" className="bg-white/60 hover:bg-white/80 border-blue-200 rounded-xl">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Driver
                  </Button>
                </div>
              </div>
            )}

            {/* Timeline */}
            {renderOrderTimeline(searchedOrder)}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/30">
              {searchedOrder.status !== 'delivered' && searchedOrder.status !== 'cancelled' && (
                <Button variant="destructive" size="sm" className="rounded-xl">
                  ❌ Cancel Order
                </Button>
              )}
              <Button variant="outline" size="sm" className="bg-white/60 hover:bg-white/80 rounded-xl">
                💬 Contact Support
              </Button>
              {searchedOrder.status === 'delivered' && (
                <Button variant="outline" size="sm" className="bg-white/60 hover:bg-white/80 rounded-xl">
                  ⭐ Rate Order
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {searchTerm && !searchedOrder && !isSearching && (
        <Card className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📦 Order Not Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find an order with that ID or phone number. 
              Please check your details and try again.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
