
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Clock,
  Users,
  Star,
  Package,
  MapPin
} from 'lucide-react';

interface OutletDashboardProps {
  outletName: string;
}

const OutletDashboard = ({ outletName }: OutletDashboardProps) => {
  const stats = [
    {
      title: "Today's Revenue",
      value: "₹12,450",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Orders Today",
      value: "47",
      change: "+8.2%",
      icon: ShoppingBag,
      color: "text-blue-600"
    },
    {
      title: "Avg. Order Value",
      value: "₹265",
      change: "+3.1%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Active Customers",
      value: "324",
      change: "+15.3%",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  const recentOrders = [
    { id: "ORD001", customer: "Rahul Sharma", amount: "₹450", status: "preparing", time: "10 mins ago" },
    { id: "ORD002", customer: "Priya Patel", amount: "₹320", status: "delivered", time: "25 mins ago" },
    { id: "ORD003", customer: "Amit Kumar", amount: "₹680", status: "out_for_delivery", time: "35 mins ago" },
    { id: "ORD004", customer: "Sneha Gupta", amount: "₹290", status: "confirmed", time: "45 mins ago" },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      preparing: { label: "Preparing", variant: "default" as const, color: "bg-yellow-100 text-yellow-800" },
      delivered: { label: "Delivered", variant: "secondary" as const, color: "bg-green-100 text-green-800" },
      out_for_delivery: { label: "Out for Delivery", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
      confirmed: { label: "Confirmed", variant: "outline" as const, color: "bg-gray-100 text-gray-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Store Info */}
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{outletName} Store</h2>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Sector 8, Airoli, Navi Mumbai</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Store Active</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Operating: 9:00 AM - 10:00 PM</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{order.amount}</span>
                  {getStatusBadge(order.status)}
                  <span className="text-sm text-gray-500">{order.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium">Menu Items</h3>
            <p className="text-sm text-gray-600">Manage your menu</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium">Store Hours</h3>
            <p className="text-sm text-gray-600">Update operating hours</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-medium">Reviews</h3>
            <p className="text-sm text-gray-600">View customer feedback</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OutletDashboard;
