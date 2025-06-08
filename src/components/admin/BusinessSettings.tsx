import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useBusinessSettings, useUpdateBusinessSettings } from '@/hooks/useBusinessSettings';
import { toast } from 'sonner';
import FrontendSettings from './FrontendSettings';
import SupportManagement from './SupportManagement';
import { 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  Edit, 
  Trash2, 
  User, 
  Users, 
  Image, 
  Settings,
  FileImage,
  Download,
  Eye,
  X,
  ArrowLeft,
  MessageSquare,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

interface BusinessSettingsProps {
  onAddOutlet?: () => void;
  onBack?: () => void;
}

const BusinessSettings = ({ onAddOutlet, onBack }: BusinessSettingsProps) => {
  const { data: businessSettings, isLoading } = useBusinessSettings();
  const updateSettings = useUpdateBusinessSettings();
  
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const [distanceMethod, setDistanceMethod] = useState('route');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [openSections, setOpenSections] = useState<string[]>(['google-maps']);
  const [apiKeyTesting, setApiKeyTesting] = useState(false);

  // Load settings when data is available
  useEffect(() => {
    if (businessSettings) {
      setGoogleMapsApiKey(businessSettings.googleMapsApiKey || '');
      setDistanceMethod(businessSettings.distanceCalculationMethod || 'route');
      setBusinessName(businessSettings.businessName || 'DabbaGaram');
      setBusinessAddress(businessSettings.businessAddress || '');
      setBusinessPhone(businessSettings.businessPhone || '');
      setBusinessEmail(businessSettings.businessEmail || '');
    }
  }, [businessSettings]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const testGoogleMapsApi = async () => {
    if (!googleMapsApiKey.trim()) {
      toast.error('Please enter a Google Maps API key first');
      return;
    }

    setApiKeyTesting(true);
    try {
      // Test the API key by making a simple request
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.onload = () => {
        toast.success('Google Maps API key is working correctly!');
        setApiKeyTesting(false);
      };
      script.onerror = () => {
        toast.error('Invalid Google Maps API key or API access denied');
        setApiKeyTesting(false);
      };
      document.head.appendChild(script);
    } catch (error) {
      toast.error('Failed to test Google Maps API key');
      setApiKeyTesting(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings.mutateAsync({
        googleMapsApiKey,
        businessName,
        businessAddress,
        businessPhone,
        businessEmail,
        distanceCalculationMethod: distanceMethod
      });
      toast.success('Business settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save business settings');
    }
  };

  const isApiKeyConfigured = googleMapsApiKey && googleMapsApiKey.trim().length > 0;

  const staffMembers = [
    { id: 1, name: 'John Smith', email: 'john@dabbagaram.com', role: 'Business Owner', avatar: '' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@dabbagaram.com', role: 'Delivery Agent', avatar: '' },
    { id: 3, name: 'Mike Chen', email: 'mike@dabbagaram.com', role: 'Order Viewer', avatar: '' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          )}
          <h2 className="text-2xl font-bold">Settings</h2>
        </div>
        <div className="flex gap-2">
          {onAddOutlet && (
            <Button variant="outline" onClick={onAddOutlet}>
              <Plus className="h-4 w-4 mr-2" />
              Add Outlet
            </Button>
          )}
          <Button 
            onClick={handleSaveSettings} 
            disabled={updateSettings.isPending || isLoading}
          >
            {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="staff">Staff Members</TabsTrigger>
          <TabsTrigger value="frontend">Frontend Settings</TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Support Center
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Google Maps Integration</span>
                <Badge variant={isApiKeyConfigured ? "default" : "secondary"}>
                  {isApiKeyConfigured ? "Connected" : "Not Configured"}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Configure Google Maps API for location search, distance calculation, and outlet mapping.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to the Google Cloud Console</li>
                  <li>Create a new project or select existing one</li>
                  <li>Enable "Places API" and "Distance Matrix API"</li>
                  <li>Create an API key with proper restrictions</li>
                  <li>Copy and paste the API key below</li>
                </ol>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Google Cloud Console
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-maps-key">Google Maps API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="google-maps-key"
                      type="password"
                      value={googleMapsApiKey}
                      onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                      placeholder="Enter your Google Maps API key"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={testGoogleMapsApi}
                      disabled={apiKeyTesting || !googleMapsApiKey.trim()}
                    >
                      {apiKeyTesting ? 'Testing...' : 'Test API'}
                    </Button>
                  </div>
                  {isApiKeyConfigured && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      API Key configured
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Distance Calculation Method</Label>
                  <Select value={distanceMethod} onValueChange={setDistanceMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="route">Route - Accurate driving distance via Google Maps</SelectItem>
                      <SelectItem value="direct">Direct - Straight-line distance calculation</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600">
                    Route method requires Google Maps API Key for accurate delivery estimates.
                    Direct method provides approximate distances without API dependency.
                  </p>
                </div>

                {!isApiKeyConfigured && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Location search is currently using fallback mode.</strong> Configure your Google Maps API key above to enable:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                      <li>Real-time location search suggestions</li>
                      <li>Accurate driving distance calculations</li>
                      <li>Precise delivery time estimates</li>
                      <li>Enhanced user experience</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Other Integrations</span>
                <Badge variant="secondary">Coming Soon</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Google Analytics, Facebook Ads, Google Ads, and more integrations will be available soon.
              </p>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
              <p className="text-sm text-gray-600">Name and primary contacts of store</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input 
                    id="business-name" 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input 
                    id="contact-email" 
                    type="email" 
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input 
                    id="contact-phone" 
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://www.dabbagaram.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Address</Label>
                <Textarea 
                  id="description" 
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Staff Members</CardTitle>
                  <p className="text-sm text-gray-600">Manage your team members and their access levels</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={member.role === 'Business Owner' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frontend" className="space-y-6">
          <FrontendSettings />
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <SupportManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessSettings;
