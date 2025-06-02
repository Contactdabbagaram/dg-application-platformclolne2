
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BusinessDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">May 27, 2025</span>
          <span className="text-sm text-gray-600">—</span>
          <span className="text-sm text-gray-600">May 27, 2025</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sales / Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹53,004 / 282</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">29</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Order Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">4.32 ⭐</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delayed Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">19.13%</div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Cards */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Items</span>
              <span className="text-lg font-bold">4.35 ⭐</span>
              <Badge variant="secondary">85</Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium">Delivery</span>
              <span className="text-lg font-bold text-red-500">3.47 ⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <span className="text-gray-500">Sales Chart (Hourly Breakdown)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Outlets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Airoli</span>
                <span className="text-sm font-medium">₹25,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Koramangala</span>
                <span className="text-sm font-medium">₹28,004</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Status</CardTitle>
            <span className="text-sm text-gray-600">Orders</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Ready for pickup</span>
              <span className="text-sm font-medium">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Delivered</span>
              <span className="text-sm font-medium">5</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessDashboard;
