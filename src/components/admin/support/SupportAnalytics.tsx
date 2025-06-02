
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  MessageCircle, 
  Users, 
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  Calendar
} from 'lucide-react';

interface SupportAnalyticsProps {
  restaurantId: string;
}

const SupportAnalytics = ({ restaurantId }: SupportAnalyticsProps) => {
  // Mock data - replace with actual analytics queries
  const mockData = {
    totalChats: 1245,
    resolvedChats: 1156,
    avgResolutionTime: 4.2,
    satisfactionScore: 4.6,
    escalatedToHuman: 89,
    topCategories: [
      { name: 'Order Issues', count: 456, percentage: 36.6 },
      { name: 'Delivery Delay', count: 324, percentage: 26.0 },
      { name: 'Payment & Billing', count: 234, percentage: 18.8 },
      { name: 'Track Order', count: 156, percentage: 12.5 },
      { name: 'General Inquiry', count: 75, percentage: 6.0 },
    ],
    dailyVolume: [
      { day: 'Mon', chats: 178 },
      { day: 'Tue', chats: 205 },
      { day: 'Wed', chats: 189 },
      { day: 'Thu', chats: 234 },
      { day: 'Fri', chats: 267 },
      { day: 'Sat', chats: 198 },
      { day: 'Sun', chats: 174 },
    ],
    resolutionRate: 92.8,
    avgResponseTime: 1.8,
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Chats</p>
                <p className="text-2xl font-bold">{mockData.totalChats.toLocaleString()}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-2xl font-bold">{mockData.resolutionRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Progress value={mockData.resolutionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">{mockData.avgResponseTime}s</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600">-0.3s</span>
              <span className="text-gray-600 ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold">{mockData.satisfactionScore}/5</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600">+0.2</span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Support Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.topCategories.map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{category.count}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Chat Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.dailyVolume.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-12">{day.day}</span>
                  <div className="flex-1 mx-4">
                    <Progress value={(day.chats / 300) * 100} className="h-3" />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{day.chats}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Human Escalation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">{mockData.escalatedToHuman}</p>
              <p className="text-sm text-gray-600 mt-1">
                {((mockData.escalatedToHuman / mockData.totalChats) * 100).toFixed(1)}% of total chats
              </p>
              <div className="mt-4">
                <Progress value={(mockData.escalatedToHuman / mockData.totalChats) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Avg Resolution Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{mockData.avgResolutionTime}m</p>
              <p className="text-sm text-gray-600 mt-1">
                Average time to resolve issues
              </p>
              <div className="mt-4 text-xs text-gray-500">
                Target: &lt; 5 minutes
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5" />
              Unresolved Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {mockData.totalChats - mockData.resolvedChats}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Pending resolution
              </p>
              <div className="mt-4">
                <Badge variant="destructive" className="text-xs">
                  Requires attention
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportAnalytics;
