
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
  MessageSquare
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
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#EF4444');
  const [logoPreview, setLogoPreview] = useState<string>('');

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

  const staffMembers = [
    { id: 1, name: 'John Smith', email: 'john@dabbagaram.com', role: 'Business Owner', avatar: '' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@dabbagaram.com', role: 'Delivery Agent', avatar: '' },
    { id: 3, name: 'Mike Chen', email: 'mike@dabbagaram.com', role: 'Order Viewer', avatar: '' },
  ];

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
                <span>Integrations</span>
                <Badge variant={isApiKeyConfigured ? "default" : "secondary"}>
                  Google Maps: {isApiKeyConfigured ? "Connected" : "Not Configured"}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Google Analytics, FB Ads, Google Ads, Google Firebase and native apps.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Maps */}
              <Collapsible open={openSections.includes('google-maps')} onOpenChange={() => toggleSection('google-maps')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-gray-50">
                  <h4 className="font-medium">Google Maps</h4>
                  {openSections.includes('google-maps') ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      See <span className="font-medium">Google Maps Integration</span> guide to get Google Maps API Key
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="google-maps-key">Google Maps API Key</Label>
                    <Input
                      id="google-maps-key"
                      type="password"
                      value={googleMapsApiKey}
                      onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                      placeholder="••••••••••••••••••••••••••••••••••••"
                    />
                    {isApiKeyConfigured && (
                      <p className="text-xs text-green-600">✓ API Key configured</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Distance calculation method</Label>
                    <Select value={distanceMethod} onValueChange={setDistanceMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="route">Route - Route distance using Google Maps APIs</SelectItem>
                        <SelectItem value="direct">Direct - Direct distance calculation</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-600">
                      Route method requires Google Maps API Key.
                      If Google APIs fails then distance calculation automatically falls back to Direct method.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Google Analytics */}
              <Collapsible open={openSections.includes('google-analytics')} onOpenChange={() => toggleSection('google-analytics')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-gray-50">
                  <h4 className="font-medium">Google Analytics</h4>
                  {openSections.includes('google-analytics') ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ga-file">Google Analytics Configuration File</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Drop your JSON file here or click to browse</p>
                      <Input type="file" accept=".json" className="mt-2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auth-key-id">Auth key Id</Label>
                    <Input id="auth-key-id" defaultValue="6X5AGU6CS8" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="analytics-enabled" defaultChecked />
                    <Label htmlFor="analytics-enabled">Analytics Enabled</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="universal-deeplink-ios">Universal Deeplink IOS (apple-app-site-association)</Label>
                    <Textarea 
                      id="universal-deeplink-ios" 
                      defaultValue={`{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "G2832QPNUP.com.dabbagaram.autiller",
        "paths": [
          "*"
        ]
      }
    ]
  }
}`}
                      className="font-mono text-sm"
                      rows={15}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-store-url">App Store url</Label>
                    <Input id="app-store-url" defaultValue="https://apps.apple.com/app/id1524604290" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gcm-key">GCM Key</Label>
                    <Input id="gcm-key" type="password" defaultValue="•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="universal-deeplink-android">Universal Deeplink Android (assetlinks.json)</Label>
                    <Textarea 
                      id="universal-deeplink-android" 
                      defaultValue={`[
  {
    "relation": [
      "delegate_permission/common.handle_all_urls"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "com.dabbagaram.autiller",
      "sha256_cert_fingerprints": [

        "68:9B:28:61:A4:C6:41:DE:8A:0C:06:F7:26:40:0F:A2:71:EF:96:28:3B:7F:E9:C6:08:9B:A1:49:6D:2A:4E:6C",

        "02:F9:DE:70:C7:9D:F9:ED:00:AB:6D:F8:29:DB:C8:81:3D:D7:89:32:BB:DC:E4:5E:CB:62:71:43:15:F0:51:06"
      ]
    }
  }
]`}
                      className="font-mono text-sm"
                      rows={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="play-store-url">Play Store url</Label>
                    <Input id="play-store-url" defaultValue="https://play.google.com/store/apps/details?id=com.dabbagaram.autiller" />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
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

          <Card>
            <CardHeader>
              <CardTitle>Available Roles</CardTitle>
              <p className="text-sm text-gray-600">Role permissions and access levels</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Business Owner</h4>
                  <p className="text-sm text-gray-600 mb-3">Full access to all features and settings</p>
                  <Badge>Full Access</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Delivery Agent</h4>
                  <p className="text-sm text-gray-600 mb-3">Access to delivery management and orders</p>
                  <Badge variant="secondary">Limited Access</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Order Viewer</h4>
                  <p className="text-sm text-gray-600 mb-3">View orders and customer information</p>
                  <Badge variant="secondary">Read Only</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Kitchen Staff</h4>
                  <p className="text-sm text-gray-600 mb-3">Access to order preparation and kitchen dashboard</p>
                  <Badge variant="secondary">Kitchen Access</Badge>
                </div>
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
