
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import SupportCategoriesManager from './support/SupportCategoriesManager';
import SupportResponsesManager from './support/SupportResponsesManager';
import SupportBotSettings from './support/SupportBotSettings';
import SupportAnalytics from './support/SupportAnalytics';
import { ArrowLeft, Settings, MessageSquare, Bot, BarChart3 } from 'lucide-react';

interface SupportManagementProps {
  onBack?: () => void;
}

const SupportManagement = ({ onBack }: SupportManagementProps) => {
  const [activeTab, setActiveTab] = useState('categories');
  const restaurantId = 'default-restaurant-id'; // This should come from context/auth

  const handleSaveAll = () => {
    console.log('Saving all support settings...');
    // TODO: Implement global save functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
          )}
          <h2 className="text-2xl font-bold">Support Center Management</h2>
        </div>
        <Button onClick={handleSaveAll}>Save All Changes</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Auto Responses
          </TabsTrigger>
          <TabsTrigger value="bot" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Bot Settings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Categories</CardTitle>
              <p className="text-sm text-gray-600">
                Manage the "How can we help you?" categories that customers see
              </p>
            </CardHeader>
            <CardContent>
              <SupportCategoriesManager restaurantId={restaurantId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto Responses & Keywords</CardTitle>
              <p className="text-sm text-gray-600">
                Configure automatic responses for common customer queries
              </p>
            </CardHeader>
            <CardContent>
              <SupportResponsesManager restaurantId={restaurantId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Bot Configuration</CardTitle>
              <p className="text-sm text-gray-600">
                Customize your support bot's behavior and appearance
              </p>
            </CardHeader>
            <CardContent>
              <SupportBotSettings restaurantId={restaurantId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Analytics</CardTitle>
              <p className="text-sm text-gray-600">
                Monitor support performance and customer satisfaction
              </p>
            </CardHeader>
            <CardContent>
              <SupportAnalytics restaurantId={restaurantId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportManagement;
