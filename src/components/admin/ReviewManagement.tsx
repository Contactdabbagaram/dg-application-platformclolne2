
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

const ReviewManagement = () => {
  const reviews = [
    {
      id: 1,
      customer: 'Rahul Sharma',
      rating: 5,
      date: '2025-05-27',
      order: '#1140749',
      comment: 'Excellent food quality and fast delivery. The paratha was perfectly cooked and the sabji was delicious.',
      items: ['Phulka (Plain) [1pc]', 'Beetroot Paratha'],
      helpful: 12,
      category: 'Food Quality'
    },
    {
      id: 2,
      customer: 'Priya Patel',
      rating: 4,
      date: '2025-05-26',
      order: '#1140721',
      comment: 'Good taste but delivery was slightly delayed. Overall satisfied with the quality.',
      items: ['Phulka (Ghee) [1pc]', 'Dal Rice'],
      helpful: 8,
      category: 'Delivery'
    },
    {
      id: 3,
      customer: 'Deepanshu Kumar',
      rating: 3,
      date: '2025-05-25',
      order: '#1140763',
      comment: 'Food was okay, but portion size could be better for the price.',
      items: ['Akkha Masoor Ki Sabji', 'Missi Roti'],
      helpful: 5,
      category: 'Value for Money'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Review Management</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Average Rating: <span className="font-bold text-yellow-600">4.3 ⭐</span>
          </div>
          <div className="text-sm text-gray-600">
            Total Reviews: <span className="font-bold">156</span>
          </div>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">5 Star</p>
                <p className="text-xl font-bold">89</p>
              </div>
              <div className="text-green-500">57%</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">4 Star</p>
                <p className="text-xl font-bold">42</p>
              </div>
              <div className="text-blue-500">27%</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">3 Star</p>
                <p className="text-xl font-bold">18</p>
              </div>
              <div className="text-yellow-500">12%</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Ratings</p>
                <p className="text-xl font-bold">7</p>
              </div>
              <div className="text-red-500">4%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Reviews</h3>
        
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {review.customer.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{review.customer}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-600">{review.date}</span>
                      <Badge variant="outline" className="text-xs">
                        Order {review.order}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {review.category}
                </Badge>
              </div>
              
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Items ordered:</p>
                <div className="flex flex-wrap gap-2">
                  {review.items.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-green-600">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Helpful ({review.helpful})
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Not Helpful
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewManagement;
