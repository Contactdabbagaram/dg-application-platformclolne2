import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Clock, 
  DollarSign, 
  Package,
  CreditCard,
  Truck,
  Settings,
  RefreshCw,
  Key,
  CheckCircle,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';

interface OutletSettingsProps {
  outletName: string;
  onBack?: () => void;
}

const OutletSettings = ({ outletName, onBack }: OutletSettingsProps) => {
  const [openSections, setOpenSections] = useState<string[]>(['basic']);
  const [petpoojaConnected, setPetpoojaConnected] = useState(true);
  const [lastSync, setLastSync] = useState('2 hours ago');

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const sectionConfig = [
    { id: 'basic', title: 'Basic Details', icon: Settings },
    { id: 'address', title: 'Store Address', icon: MapPin },
    { id: 'ordering', title: 'Ordering', icon: Package },
    { id: 'payments', title: 'Payments', icon: CreditCard },
    { id: 'menu-automation', title: 'Menu Automation', icon: RefreshCw },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Store Settings - {outletName}</h2>
      
      {sectionConfig.map((section) => {
        const Icon = section.icon;
        const isOpen = openSections.includes(section.id);
        
        return (
          <Collapsible key={section.id} open={isOpen} onOpenChange={() => toggleSection(section.id)}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="p-6">
                  {section.id === 'basic' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="store-name">Store Name</Label>
                          <Input id="store-name" defaultValue={outletName} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="store-code">Store Code</Label>
                          <Input id="store-code" defaultValue="DG-AIR-001" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          defaultValue="Authentic Indian cuisine with home-style cooking"
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="active">Store Active</Label>
                        <Switch id="active" defaultChecked />
                      </div>
                    </div>
                  )}

                  {section.id === 'address' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Complete Address</Label>
                        <Textarea 
                          id="address" 
                          defaultValue="Shop No. 15, Ground Floor, Sector 8, Airoli, Navi Mumbai, Maharashtra 400708"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" defaultValue="Navi Mumbai" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" defaultValue="Maharashtra" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input id="pincode" defaultValue="400708" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input id="latitude" defaultValue="19.1568" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input id="longitude" defaultValue="72.9940" />
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'ordering' && (
                    <div className="space-y-6">
                      {/* Service Area & Delivery Modes */}
                      <div>
                        <h4 className="text-lg font-medium mb-4">Service Area & Modes</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
                            <Input id="delivery-radius" type="number" defaultValue="10" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="service-type">Service Type</Label>
                            <Select defaultValue="both">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="delivery">Delivery Only</SelectItem>
                                <SelectItem value="pickup">Pickup Only</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Order Value Limits */}
                      <div>
                        <h4 className="text-lg font-medium mb-4">Order Value Limits</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="min-order">Minimum Order Value (₹)</Label>
                            <Input id="min-order" type="number" defaultValue="200" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="max-order">Maximum Order Value (₹)</Label>
                            <Input id="max-order" type="number" defaultValue="5000" />
                          </div>
                        </div>
                      </div>

                      {/* Delivery Charges */}
                      <div>
                        <h4 className="text-lg font-medium mb-4">Delivery Charges</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="delivery-fee">Base Delivery Fee (₹)</Label>
                            <Input id="delivery-fee" type="number" defaultValue="30" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="free-delivery">Free Delivery Above (₹)</Label>
                            <Input id="free-delivery" type="number" defaultValue="500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="extra-distance">Extra Distance Fee (₹/km)</Label>
                            <Input id="extra-distance" type="number" defaultValue="5" />
                          </div>
                        </div>
                      </div>

                      {/* Operating Hours */}
                      <div>
                        <h4 className="text-lg font-medium mb-4">Operating Hours</h4>
                        <div className="space-y-3">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                            <div key={day} className="flex items-center gap-4">
                              <div className="w-24 text-sm font-medium">{day}</div>
                              <Input type="time" defaultValue="09:00" className="w-32" />
                              <span className="text-sm">to</span>
                              <Input type="time" defaultValue="22:00" className="w-32" />
                              <Switch defaultChecked />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'payments' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium mb-4">Payment Methods</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="cod">Cash on Delivery</Label>
                            <Switch id="cod" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="online">Online Payments</Label>
                            <Switch id="online" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="wallets">Digital Wallets</Label>
                            <Switch id="wallets" defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-4">Razorpay Integration</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-800">Razorpay Connected</span>
                            </div>
                            <p className="text-sm text-green-700 mt-1">Account ID: rzp_test_1234567890</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="razorpay-key">API Key</Label>
                              <Input id="razorpay-key" type="password" defaultValue="••••••••••••••••" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="razorpay-secret">API Secret</Label>
                              <Input id="razorpay-secret" type="password" defaultValue="••••••••••••••••" />
                            </div>
                          </div>
                          
                          <Button variant="outline">Test Connection</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'menu-automation' && (
                    <div className="space-y-6">
                      {/* Petpooja Connection Status */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Petpooja Integration</h4>
                              <p className="text-sm text-gray-600">Menu and order management</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {petpoojaConnected ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <Badge className="bg-green-100 text-green-800">Connected</Badge>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <Badge variant="destructive">Disconnected</Badge>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {petpoojaConnected && (
                          <div className="text-sm text-gray-600">
                            <p>Restaurant ID: DG_AIROLI_001</p>
                            <p>Last sync: {lastSync}</p>
                          </div>
                        )}
                      </div>

                      {/* Sync Controls */}
                      <div>
                        <h4 className="text-lg font-medium mb-4">Sync Controls</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Package className="h-5 w-5 text-blue-600" />
                                  <span className="font-medium">Menu Sync</span>
                                </div>
                                <Switch defaultChecked />
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                Automatically sync menu items, categories, and pricing from Petpooja
                              </p>
                              <Button size="sm" variant="outline" className="w-full">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Sync Now
                              </Button>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <ShoppingBag className="h-5 w-5 text-green-600" />
                                  <span className="font-medium">Order Push</span>
                                </div>
                                <Switch defaultChecked />
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                Push incoming orders to Petpooja for kitchen management
                              </p>
                              <Button size="sm" variant="outline" className="w-full">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Test Push
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Sync Settings */}
                      <div>
                        <h4 className="text-lg font-medium mb-4">Sync Settings</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="sync-interval">Auto Sync Interval</Label>
                              <Select defaultValue="15">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5">Every 5 minutes</SelectItem>
                                  <SelectItem value="15">Every 15 minutes</SelectItem>
                                  <SelectItem value="30">Every 30 minutes</SelectItem>
                                  <SelectItem value="60">Every hour</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sync-time">Sync Active Hours</Label>
                              <Select defaultValue="business">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="always">24/7</SelectItem>
                                  <SelectItem value="business">Business hours only</SelectItem>
                                  <SelectItem value="custom">Custom hours</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="sync-prices">Sync Prices</Label>
                              <Switch id="sync-prices" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="sync-availability">Sync Item Availability</Label>
                              <Switch id="sync-availability" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="sync-categories">Sync Categories</Label>
                              <Switch id="sync-categories" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="order-status-update">Order Status Updates</Label>
                              <Switch id="order-status-update" defaultChecked />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* API Configuration */}
                      <div>
                        <h4 className="text-lg font-medium mb-4">API Configuration</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="petpooja-url">Petpooja API URL</Label>
                              <Input 
                                id="petpooja-url" 
                                defaultValue="https://api.petpooja.com/v1" 
                                placeholder="API endpoint URL"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="restaurant-id">Restaurant ID</Label>
                              <Input 
                                id="restaurant-id" 
                                defaultValue="DG_AIROLI_001" 
                                placeholder="Your restaurant ID"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="api-token">API Token</Label>
                              <div className="flex gap-2">
                                <Input 
                                  id="api-token" 
                                  type="password" 
                                  defaultValue="••••••••••••••••••••"
                                  placeholder="Your API token"
                                />
                                <Button size="sm" variant="outline">
                                  <Key className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="webhook-url">Webhook URL</Label>
                              <Input 
                                id="webhook-url" 
                                defaultValue="https://dabbagaram.com/api/petpooja/webhook" 
                                placeholder="Webhook endpoint"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline">Test Connection</Button>
                            <Button variant="outline">Regenerate Token</Button>
                            <Button>Save Configuration</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default OutletSettings;
