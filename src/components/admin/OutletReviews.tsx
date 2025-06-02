
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search, ThumbsUp, MessageCircle, Filter } from 'lucide-react';

interface OutletReviewsProps {
  outletName: string;
}

const OutletReviews = ({ outletName }: OutletReviewsProps) => {
  const [selectedRating, setSelectedRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const reviews = [
    {
      id: "REV001",
      customer: "Rahul Sharma",
      rating: 5,
      comment: "Excellent food quality and fast delivery. The butter chicken was amazing!",
      date: "2 days ago",
      orderId: "ORD001",
      helpful: 12,
      replied: true
    },
    {
      id: "REV002",
      customer: "Priya Patel",
      rating: 4,
      comment: "Good taste but delivery was a bit delayed. Overall satisfied with the food quality.",
      date: "3 days ago",
      orderId: "ORD045",
      helpful: 8,
      replied: false
    },
    {
      id: "REV003",
      customer: "Amit Kumar",
      rating: 5,
      comment: "Best biryani in the area! Will definitely order again. Great packaging too.",
      date: "5 days ago",
      orderId: "ORD032",
      helpful: 15,
      replied: true
    },
    {
      id: "REV004",
      customer: "Sneha Gupta",
      rating: 3,
      comment: "Food was okay but could be better. The dosa was a bit cold when it arrived.",
      date: "1 week ago",
      orderId: "ORD018",
      helpful: 3,
      replied: false
    },
    {
      id: "REV005",
      customer: "Vikash Singh",
      rating: 5,
      comment: "Outstanding service and delicious food. The paneer tikka was perfectly cooked!",
      date: "1 week ago",
      orderId: "ORD025",
      helpful: 20,
      replied: true
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating;
    const matchesSearch = review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reviews - {outletName}</h2>
        <Button>Export Reviews</Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-sm text-gray-600 mt-1">Average Rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">{reviews.length}</div>
            <p className="text-sm text-gray-600 mt-2">Total Reviews</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">{reviews.filter(r => r.replied).length}</div>
            <p className="text-sm text-gray-600 mt-2">Replied</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">{reviews.filter(r => r.rating >= 4).length}</div>
            <p className="text-sm text-gray-600 mt-2">Positive Reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search reviews by customer or comment"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="font-semibold">{review.customer}</h3>
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">{review.date}</span>
                    <Badge variant="outline" className="text-xs">Order: {review.orderId}</Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.helpful} found helpful</span>
                    </div>
                    
                    {review.replied ? (
                      <Badge className="bg-green-100 text-green-800">Replied</Badge>
                    ) : (
                      <Badge variant="outline">Not Replied</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-6">
                  {!review.replied && (
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  )}
                  <Button variant="outline" size="sm">View Order</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OutletReviews;
