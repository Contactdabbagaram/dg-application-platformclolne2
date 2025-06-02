
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Clock, Users, Utensils, Calendar, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Subscriptions = () => {
  const subscriptionPlans = {
    daily: [
      {
        id: 1,
        name: "Lunch Only",
        description: "Perfect for office goers",
        price: 120,
        period: "/day",
        meals: 1,
        features: [
          "Fresh lunch delivered daily",
          "Variety of cuisines",
          "On-time delivery",
          "Cancel anytime"
        ]
      },
      {
        id: 2,
        name: "Dinner Only",
        description: "Ideal for busy evenings",
        price: 130,
        period: "/day",
        meals: 1,
        features: [
          "Hot dinner delivered",
          "Family-style portions",
          "Healthy options",
          "Weekend delivery"
        ]
      },
      {
        id: 3,
        name: "Lunch + Dinner",
        description: "Complete meal solution",
        price: 220,
        period: "/day",
        meals: 2,
        popular: true,
        features: [
          "Two meals daily",
          "Balanced nutrition",
          "Priority delivery",
          "Menu customization"
        ]
      }
    ],
    weekly: [
      {
        id: 4,
        name: "5-Day Lunch",
        description: "Weekday lunch plan",
        price: 550,
        period: "/week",
        meals: 5,
        savings: "8%",
        features: [
          "Monday to Friday lunch",
          "Skip weekends",
          "Office delivery",
          "Advance ordering"
        ]
      },
      {
        id: 5,
        name: "7-Day Combo",
        description: "Full week coverage",
        price: 1400,
        period: "/week",
        meals: 14,
        popular: true,
        savings: "12%",
        features: [
          "Complete week meals",
          "Lunch + Dinner",
          "Weekend specials",
          "Family portions"
        ]
      }
    ],
    monthly: [
      {
        id: 6,
        name: "Monthly Lunch",
        description: "30-day lunch plan",
        price: 3200,
        period: "/month",
        meals: 30,
        savings: "15%",
        features: [
          "30 lunch meals",
          "Flexible scheduling",
          "Pause anytime",
          "Bulk savings"
        ]
      },
      {
        id: 7,
        name: "Monthly Premium",
        description: "Complete monthly plan",
        price: 6000,
        period: "/month",
        meals: 60,
        popular: true,
        savings: "25%",
        features: [
          "60 meals (Lunch + Dinner)",
          "Premium ingredients",
          "Priority support",
          "Maximum savings"
        ]
      }
    ]
  };

  const features = [
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "Fresh Daily",
      description: "Meals prepared fresh every day with quality ingredients"
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "On-Time Delivery",
      description: "Reliable delivery at your preferred time slot"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Flexible Scheduling",
      description: "Pause, skip, or modify your subscription anytime"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Family Friendly",
      description: "Portions and menus suitable for the whole family"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Subscription Plans</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Choose from our flexible subscription plans designed to fit your lifestyle. 
            Fresh, healthy meals delivered regularly with great savings.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-500">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-secondary-500">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Subscription Plans */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="daily">Daily Plans</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Plans</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Plans</TabsTrigger>
          </TabsList>

          {Object.entries(subscriptionPlans).map(([planType, plans]) => (
            <TabsContent key={planType} value={planType}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-500">
                        Most Popular
                      </Badge>
                    )}
                    
                    {plan.savings && (
                      <Badge className="absolute -top-3 right-4 bg-green-500">
                        Save {plan.savings}
                      </Badge>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl text-secondary-500">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="text-center pb-6">
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-primary-500">₹{plan.price}</span>
                        <span className="text-gray-600">{plan.period}</span>
                      </div>
                      
                      <div className="mb-6">
                        <span className="text-sm text-gray-600">
                          {plan.meals} meal{plan.meals > 1 ? 's' : ''} included
                        </span>
                      </div>
                      
                      <ul className="space-y-3 text-left">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter>
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-primary-500 hover:bg-primary-600' 
                            : 'bg-secondary-500 hover:bg-secondary-600'
                        }`}
                      >
                        Subscribe Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-secondary-500 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I pause my subscription?</h3>
                <p className="text-gray-600">Yes, you can pause your subscription anytime through your dashboard or by contacting us.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">What if I don't like a meal?</h3>
                <p className="text-gray-600">We offer a satisfaction guarantee. Contact us and we'll make it right with a replacement or credit.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I customize my meals?</h3>
                <p className="text-gray-600">Absolutely! Premium subscribers get full customization options, while others can set dietary preferences.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">What are your delivery timings?</h3>
                <p className="text-gray-600">Lunch: 12:00-2:00 PM, Dinner: 7:00-9:00 PM. You can choose your preferred time slot.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Subscriptions;
