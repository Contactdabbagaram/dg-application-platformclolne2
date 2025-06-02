
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SupportChat } from '@/components/support/SupportChat';
import { OrderTracker } from '@/components/support/OrderTracker';
import SupportCategories from '@/components/support/SupportCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, MapPin, HelpCircle, Sparkles, Phone, Mail } from 'lucide-react';

const Support = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('chat');

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8 mt-16">
          {/* Contact Info Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 text-sm">
            <div className="flex items-center gap-4 mb-2 sm:mb-0">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91-7303924060</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Free delivery within 5km</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1">
              Order before 8 PM for same-day delivery
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Support</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Support Center
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Get instant help with AI-powered chat, real-time order tracking, and seamless support
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 bg-white shadow-sm border rounded-xl p-1 w-full max-w-md">
              <TabsTrigger 
                value="chat" 
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">AI Chat</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tracking" 
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Live Tracking</span>
                <span className="sm:hidden">Track</span>
              </TabsTrigger>
              <TabsTrigger 
                value="faq" 
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Help</span>
                <span className="sm:hidden">Help</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Chat Tab Content */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Categories Sidebar */}
              <div className="lg:col-span-4 xl:col-span-3">
                <Card className="bg-white shadow-sm border">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      How can we help you?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SupportCategories 
                      onCategorySelect={handleCategorySelect}
                    />
                  </CardContent>
                </Card>
              </div>
              
              {/* Chat Interface */}
              <div className="lg:col-span-8 xl:col-span-9">
                <SupportChat selectedCategory={selectedCategory} />
              </div>
            </div>
          </TabsContent>

          {/* Tracking Tab Content */}
          <TabsContent value="tracking" className="space-y-6">
            <OrderTracker />
          </TabsContent>

          {/* FAQ Tab Content */}
          <TabsContent value="faq" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Order & Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">How long does delivery take?</h4>
                    <p className="text-sm text-gray-600">Usually 30-45 minutes depending on your location and order size.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Can I track my order?</h4>
                    <p className="text-sm text-gray-600">Yes! Use our Live Tracking tab to see real-time updates.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">What if my order is delayed?</h4>
                    <p className="text-sm text-gray-600">You'll receive automatic notifications with updated ETA.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Payments & Refunds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">What payment methods do you accept?</h4>
                    <p className="text-sm text-gray-600">We accept all major cards, UPI, and cash on delivery.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">How do refunds work?</h4>
                    <p className="text-sm text-gray-600">Refunds are processed within 3-5 business days to your original payment method.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Can I cancel my order?</h4>
                    <p className="text-sm text-gray-600">Orders can be cancelled within 5 minutes of placing, before preparation starts.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Support;
