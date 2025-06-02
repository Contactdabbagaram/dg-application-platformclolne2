
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Clock, 
  ShoppingBag, 
  Store,
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

interface AdminDashboardProps {
  selectedOutlet: string;
  onNavigateToOrders: () => void;
  onNavigateToMenu: () => void;
  onNavigateToReviews: () => void;
  onNavigateToSettings: () => void;
}

const AdminDashboard = ({ 
  selectedOutlet, 
  onNavigateToOrders, 
  onNavigateToMenu, 
  onNavigateToReviews, 
  onNavigateToSettings 
}: AdminDashboardProps) => {
  const [dateRange, setDateRange] = useState('May 27, 2025');

  // Sample data for charts
  const salesData = [
    { time: '11am to 12pm', upi: 0, cash: 400, online: 0 },
    { time: '12pm to 1pm', upi: 0, cash: 0, online: 250 },
    { time: '1pm to 2pm', upi: 0, cash: 0, online: 300 },
    { time: '2pm to 3pm', upi: 150, cash: 0, online: 200 }
  ];

  const paymentModeData = [
    { name: 'online', value: 560, color: '#22c55e' },
    { name: 'cash', value: 372, color: '#3b82f6' },
    { name: 'upi qr', value: 295, color: '#e5e7eb' }
  ];

  const serviceModeData = [
    { name: 'delivery', value: 642, color: '#22c55e' },
    { name: 'takeaway', value: 385, color: '#3b82f6' }
  ];

  const platformData = [
    { name: 'android', value: 690, color: '#22c55e' },
    { name: 'web', value: 252, color: '#3b82f6' },
    { name: 'ios', value: 85, color: '#e5e7eb' }
  ];

  const deliveryLatencyData = [
    { range: '10-20', count: 1 },
    { range: '20-30', count: 1 },
    { range: '30-40', count: 2 },
    { range: '>60', count: 1 }
  ];

  const taxData = [
    { name: 'SGST', amount: 27 },
    { name: 'CGST', amount: 27 }
  ];

  const couponData = [
    { code: 'FIRSTORDER', uses: 2, discount: 0 },
    { code: 'TAKE5', uses: 1, discount: 3 }
  ];

  const orderItems = [
    { name: 'Phulka (Ghee) [1pc]', qty: 7, total: 84 },
    { name: 'Phulka (Plain) [1pc]', qty: 6, total: 72 },
    { name: 'Aamras [100ml]', qty: 3, total: 105 },
    { name: 'Masala Aloo Paratha', qty: 2, total: 100 },
    { name: 'Missi Roti [1pc]', qty: 2, total: 30 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">DG</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Dabba Garam</h1>
              <p className="text-sm text-gray-600">Business Stores</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select className="bg-white border rounded px-3 py-1 text-sm">
              <option>{selectedOutlet}</option>
            </select>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white min-h-screen">
          <div className="p-4">
            <div className="text-sm text-gray-400 mb-2">Store</div>
            <div className="font-medium">{selectedOutlet}</div>
          </div>
          
          <nav className="mt-8">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white bg-blue-600 hover:bg-blue-700"
            >
              <BarChart3 className="h-4 w-4 mr-3" />
              Store Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={onNavigateToOrders}
            >
              <ShoppingBag className="h-4 w-4 mr-3" />
              Store Orders
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={onNavigateToMenu}
            >
              <Store className="h-4 w-4 mr-3" />
              Store Menu
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={onNavigateToReviews}
            >
              <Star className="h-4 w-4 mr-3" />
              Reviews
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={onNavigateToSettings}
            >
              <Store className="h-4 w-4 mr-3" />
              Store Settings
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header with date picker */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <div className="flex items-center gap-4">
              <input 
                type="date" 
                className="border rounded px-3 py-2"
                defaultValue="2025-05-27"
              />
              <span className="text-gray-500">—</span>
              <input 
                type="date" 
                className="border rounded px-3 py-2"
                defaultValue="2025-05-27"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-sm text-gray-600 mb-2">Sales / Orders</h3>
                  <div className="text-2xl font-bold text-green-600">₹1,227 / 10</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-sm text-gray-600 mb-2">New Customers</h3>
                  <div className="text-2xl font-bold">29</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-sm text-gray-600 mb-2">Order Rating</h3>
                  <div className="text-2xl font-bold">NA</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-sm text-gray-600 mb-2">Delayed Deliveries</h3>
                  <div className="text-2xl font-bold text-green-600">0.00%</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sales</CardTitle>
                <div className="flex items-center gap-4">
                  <span className="text-sm">Group by: Payment Mode</span>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cash" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="online" stackId="a" fill="#22c55e" />
                    <Bar dataKey="upi" stackId="a" fill="#e5e7eb" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Orders Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Delivered</span>
                    <span className="font-bold">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ready for pickup</span>
                    <span className="font-bold">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pie Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sales by Payment Modes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={paymentModeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {paymentModeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sales by Service Modes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={serviceModeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {serviceModeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sales by Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Latency */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Latency (minutes)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end h-20 bg-blue-100 rounded p-4">
                  {deliveryLatencyData.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-600 mb-2">{item.count}</div>
                      <div className="text-xs">{item.range}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm">{item.name}</span>
                      <div className="text-sm">
                        <span className="text-gray-600">Qty: {item.qty}</span>
                        <span className="ml-4 font-medium">₹{item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
