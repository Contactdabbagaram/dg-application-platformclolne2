
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical, Navigation } from 'lucide-react';

interface NavigationSettingsProps {
  settings: any;
  onSettingsChange: (field: string, value: any) => void;
}

const NavigationSettings = ({ settings, onSettingsChange }: NavigationSettingsProps) => {
  const [menuItems, setMenuItems] = useState(
    settings.navigation_menu || [
      { id: 'home', label: 'Home', url: '/', order: 1 },
      { id: 'menu', label: 'Menu', url: '/menu', order: 2 },
      { id: 'support', label: 'Support', url: '/support', order: 3 }
    ]
  );

  const handleMenuItemChange = (index: number, field: string, value: string) => {
    const updated = [...menuItems];
    updated[index] = { ...updated[index], [field]: value };
    setMenuItems(updated);
    onSettingsChange('navigation_menu', updated);
  };

  const addMenuItem = () => {
    const newItem = {
      id: `menu-${Date.now()}`,
      label: 'New Menu Item',
      url: '/',
      order: menuItems.length + 1
    };
    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    onSettingsChange('navigation_menu', updated);
  };

  const removeMenuItem = (index: number) => {
    const updated = menuItems.filter((_, i) => i !== index);
    setMenuItems(updated);
    onSettingsChange('navigation_menu', updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Top Bar Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input 
                value={settings.contact_phone || ''} 
                onChange={(e) => onSettingsChange('contact_phone', e.target.value)}
                placeholder="+91-9876543210"
              />
            </div>
            <div className="space-y-2">
              <Label>Delivery Radius Text</Label>
              <Input 
                value={settings.delivery_radius_text || ''} 
                onChange={(e) => onSettingsChange('delivery_radius_text', e.target.value)}
                placeholder="Free delivery within 5km"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Order Cutoff Time Notice</Label>
              <Input 
                value={settings.order_cutoff_text || ''} 
                onChange={(e) => onSettingsChange('order_cutoff_text', e.target.value)}
                placeholder="Order before 8 PM for same-day delivery"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Menu Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Menu Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {menuItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 p-4 border rounded-lg">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">Label</Label>
                  <Input
                    value={item.label}
                    onChange={(e) => handleMenuItemChange(index, 'label', e.target.value)}
                    placeholder="Menu Item Label"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">URL</Label>
                  <Input
                    value={item.url}
                    onChange={(e) => handleMenuItemChange(index, 'url', e.target.value)}
                    placeholder="/path"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMenuItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addMenuItem} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </CardContent>
      </Card>

      {/* Cart Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cart & E-commerce Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Cart Button</Label>
              <p className="text-sm text-gray-500">Display shopping cart icon in navigation</p>
            </div>
            <Switch
              checked={settings.show_cart_button !== false}
              onCheckedChange={(checked) => onSettingsChange('show_cart_button', checked)}
            />
          </div>
          <div className="space-y-2">
            <Label>Cart Button URL</Label>
            <Input 
              value={settings.cart_button_url || ''} 
              onChange={(e) => onSettingsChange('cart_button_url', e.target.value)}
              placeholder="/cart"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationSettings;
