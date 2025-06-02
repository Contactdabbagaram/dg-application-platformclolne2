
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Edit, Printer } from 'lucide-react';

const OrderManagement = () => {
  const orders = [
    {
      id: '#1140763',
      customer: 'Deepanshu (9770901308)',
      address: 'Dabba Garam, SHOP NO. 9 GANR...',
      items: [
        { name: 'Akkha Masoor Ki Sabji(Small [150ml])', qty: 1, price: 49, amount: 49 },
        { name: 'Beetroot Paratha [1 Pc] (Mixed Pickle Pouch)', qty: 1, price: 20, amount: 20 },
        { name: 'Missi Roti [1pc](Ghee)', qty: 2, price: 15, amount: 30 },
        { name: 'Dahi [100 Ml](Add Spoon [1 Pc])', qty: 1, price: 10, amount: 10 },
      ],
      total: 119.46,
      status: 'delivered',
      delivery: '27th May 02:00 pm to 02:15 pm',
      orderType: 'online'
    },
    // Add more sample orders...
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Orders</h2>
          <Badge className="bg-blue-100 text-blue-800">Alerts On</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">Search</span>
        </div>
      </div>

      {/* Order Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-600">{order.id}</span>
                  <Badge className="bg-yellow-100 text-yellow-800">ready for pickup</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>{order.customer}</div>
                <div>{order.address}</div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-1 mb-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{index + 1}. {item.name}</span>
                    <div className="flex gap-2">
                      <span>{item.qty}</span>
                      <span>{item.price}</span>
                      <span>{item.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Delayed
                </Badge>
                <span className="font-bold">Total: ₹{order.total} ({order.orderType.toUpperCase()})</span>
              </div>
              
              <div className="text-xs text-gray-600 mb-3">
                Delivery: {order.delivery}
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Delivered
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  🗑️
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Tabs */}
      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="future">Future</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={`list-${order.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-blue-600">{order.id}</span>
                      <Badge className="bg-yellow-100 text-yellow-800">ready for pickup</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">₹{order.total}</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">O</Badge>
                      <Button size="sm">Delivered</Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <strong>{order.customer.split('(')[0]}</strong><br />
                        {order.customer.split('(')[1]?.replace(')', '')}
                      </div>
                      <div>{order.address}</div>
                      <div>{order.delivery}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagement;
