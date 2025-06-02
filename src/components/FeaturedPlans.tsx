
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Users, Utensils } from 'lucide-react';

const FeaturedPlans = () => {
  const plans = [
    {
      id: 1,
      name: "Daily Fresh",
      description: "Perfect for trying our service",
      price: "₹120",
      period: "/day",
      popular: false,
      features: [
        "1 Fresh meal daily",
        "Choose lunch or dinner",
        "Free delivery",
        "Cancel anytime"
      ],
      icon: <Utensils className="h-6 w-6" />
    },
    {
      id: 2,
      name: "Weekly Delight",
      description: "Most popular choice",
      price: "₹750",
      period: "/week",
      popular: true,
      features: [
        "14 Fresh meals",
        "Lunch & dinner options",
        "Free delivery",
        "Menu variety",
        "10% savings"
      ],
      icon: <Clock className="h-6 w-6" />
    },
    {
      id: 3,
      name: "Monthly Premium",
      description: "Best value for families",
      price: "₹2800",
      period: "/month",
      popular: false,
      features: [
        "60 Fresh meals",
        "Full meal customization",
        "Priority delivery",
        "Family portions",
        "25% savings"
      ],
      icon: <Users className="h-6 w-6" />
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-500 mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible subscription plans designed to fit your lifestyle. Fresh, healthy meals delivered right to your door.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
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
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.popular ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl text-secondary-500">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="text-center pb-6">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary-500">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
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
                  Select Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need a custom plan? We've got you covered.</p>
          <Button variant="outline" className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlans;
