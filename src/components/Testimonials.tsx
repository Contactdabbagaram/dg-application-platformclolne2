
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { useCustomerReviews } from '@/hooks/useCustomerReviews';
import { useRestaurant } from '@/contexts/RestaurantContext';

const Testimonials = () => {
  const { currentRestaurant } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { reviews, loading } = useCustomerReviews(restaurantId, 6);

  // Default testimonials to show when database testimonials are not available
  const defaultTestimonials = [
    {
      id: '1',
      customer_name: "Priya Sharma",
      review_text: "DabbaGaram has been a lifesaver! The food tastes just like home-cooked meals. I've been subscribed for 6 months now and couldn't be happier.",
      rating: 5,
    },
    {
      id: '2',
      customer_name: "Rajesh Kumar", 
      review_text: "As a student, finding healthy and affordable meals was tough. DabbaGaram solved that problem perfectly. Great taste, great price!",
      rating: 5,
    },
    {
      id: '3',
      customer_name: "Meera Patel",
      review_text: "After having my baby, cooking became challenging. DabbaGaram's nutritious meals have been perfect for our family. Highly recommended!",
      rating: 5,
    }
  ];

  // Use real customer reviews if available, otherwise use default testimonials
  const displayTestimonials = (!loading && reviews.length > 0) 
    ? reviews.slice(0, 3).map(review => ({
        id: review.id,
        customer_name: review.customer_name,
        content: review.review_text,
        rating: review.rating,
        avatar_url: undefined
      }))
    : defaultTestimonials.map(testimonial => ({
        id: testimonial.id,
        customer_name: testimonial.customer_name,
        content: testimonial.review_text,
        rating: testimonial.rating,
        avatar_url: undefined
      }));

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have made DabbaGaram their trusted meal partner.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar_url} alt={testimonial.customer_name} />
                    <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                      {testimonial.customer_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.customer_name}</div>
                    <div className="text-sm text-gray-500">Verified Customer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
