
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import ImageUpload from './ImageUpload';
import MultipleImageUpload from './MultipleImageUpload';
import { Image as ImageIcon, Star } from 'lucide-react';

interface HeroSettingsProps {
  settings: any;
  onSettingsChange: (field: string, value: any) => void;
}

const HeroSettings = ({ settings, onSettingsChange }: HeroSettingsProps) => {
  return (
    <div className="space-y-6">
      {/* Hero Content Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Hero Section Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>USP/Tagline Badge Text</Label>
                <Input 
                  value={settings.tagline_badge_text || ''} 
                  onChange={(e) => onSettingsChange('tagline_badge_text', e.target.value)}
                  placeholder="Authentic Home-Style Cooking"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Main Hero Title</Label>
                <Input 
                  value={settings.hero_title || ''} 
                  onChange={(e) => onSettingsChange('hero_title', e.target.value)}
                  placeholder="Fresh Homestyle Meals Delivered"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Hero Subtitle/Description</Label>
                <Textarea 
                  value={settings.hero_subtitle || ''}
                  onChange={(e) => onSettingsChange('hero_subtitle', e.target.value)}
                  rows={3}
                  placeholder="Experience authentic flavors crafted with love and delivered straight to your doorstep"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <ImageUpload
                label="Hero Background Image (1920x1080px)"
                currentImage={settings.hero_background_url}
                onImageChange={(url) => onSettingsChange('hero_background_url', url || '')}
                path="hero-backgrounds"
                placeholder="Upload hero background image"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Images Carousel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Hero Images Carousel (800x600px)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MultipleImageUpload
            label="Hero Front Images"
            currentImages={settings.hero_front_images || []}
            onImagesChange={(urls) => onSettingsChange('hero_front_images', urls)}
            path="hero-images"
            placeholder="Upload hero images for carousel"
            maxImages={8}
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload multiple images to create a slideshow effect. Images will automatically cycle every 4 seconds.
          </p>
        </CardContent>
      </Card>

      {/* CTA Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Call-to-Action Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Primary CTA Button</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input 
                    value={settings.primary_cta_text || ''} 
                    onChange={(e) => onSettingsChange('primary_cta_text', e.target.value)}
                    placeholder="Order Now"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button URL/Action</Label>
                  <Input 
                    value={settings.primary_cta_url || ''} 
                    onChange={(e) => onSettingsChange('primary_cta_url', e.target.value)}
                    placeholder="/menu"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Secondary CTA Button</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input 
                    value={settings.secondary_cta_text || ''} 
                    onChange={(e) => onSettingsChange('secondary_cta_text', e.target.value)}
                    placeholder="View Our Menu"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button URL/Action</Label>
                  <Input 
                    value={settings.secondary_cta_url || ''} 
                    onChange={(e) => onSettingsChange('secondary_cta_url', e.target.value)}
                    placeholder="/menu"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <Label>Show "+" Suffix on Numbers</Label>
              <p className="text-sm text-gray-500">Add "+" after stat numbers (e.g., "25,000+")</p>
            </div>
            <Switch
              checked={settings.show_stat_plus_suffix !== false}
              onCheckedChange={(checked) => onSettingsChange('show_stat_plus_suffix', checked)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Happy Customers</Label>
                <div className="flex gap-2">
                  <Input 
                    value={settings.stat_customers || ''} 
                    onChange={(e) => onSettingsChange('stat_customers', e.target.value)}
                    placeholder="25,000"
                    className="flex-1"
                  />
                  <Input 
                    value={settings.stat_customers_label || ''} 
                    onChange={(e) => onSettingsChange('stat_customers_label', e.target.value)}
                    placeholder="Happy Customers"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Orders Delivered</Label>
                <div className="flex gap-2">
                  <Input 
                    value={settings.stat_orders || ''} 
                    onChange={(e) => onSettingsChange('stat_orders', e.target.value)}
                    placeholder="100,000"
                    className="flex-1"
                  />
                  <Input 
                    value={settings.stat_orders_label || ''} 
                    onChange={(e) => onSettingsChange('stat_orders_label', e.target.value)}
                    placeholder="Orders Delivered"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Cities Served</Label>
                <div className="flex gap-2">
                  <Input 
                    value={settings.stat_cities || ''} 
                    onChange={(e) => onSettingsChange('stat_cities', e.target.value)}
                    placeholder="20"
                    className="flex-1"
                  />
                  <Input 
                    value={settings.stat_cities_label || ''} 
                    onChange={(e) => onSettingsChange('stat_cities_label', e.target.value)}
                    placeholder="Cities Served"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Years Experience</Label>
                <div className="flex gap-2">
                  <Input 
                    value={settings.stat_experience || ''} 
                    onChange={(e) => onSettingsChange('stat_experience', e.target.value)}
                    placeholder="8"
                    className="flex-1"
                  />
                  <Input 
                    value={settings.stat_experience_label || ''} 
                    onChange={(e) => onSettingsChange('stat_experience_label', e.target.value)}
                    placeholder="Years Experience"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 border-indigo-200">
              <Star className="w-4 h-4 mr-2 fill-current" />
              {settings.tagline_badge_text || 'Authentic Home-Style Cooking'}
            </Badge>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              {settings.hero_title || 'Fresh Homestyle Meals Delivered'}
            </h1>
            
            <p className="text-gray-600 mb-4">
              {settings.hero_subtitle || 'Experience authentic flavors crafted with love and delivered straight to your doorstep'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button 
                className="text-white"
                style={{ 
                  backgroundColor: settings.primary_button_bg_color || '#6366F1',
                  color: settings.primary_button_text_color || '#FFFFFF'
                }}
              >
                {settings.primary_cta_text || 'Order Now'}
              </Button>
              <Button 
                variant="outline"
                style={{
                  backgroundColor: settings.secondary_button_bg_color || '#FFFFFF',
                  color: settings.secondary_button_text_color || '#10B981',
                  borderColor: settings.secondary_button_border_color || '#10B981'
                }}
              >
                {settings.secondary_cta_text || 'View Our Menu'}
              </Button>
            </div>
            
            {/* Preview carousel if images exist */}
            {settings.hero_front_images && settings.hero_front_images.length > 0 && (
              <div className="mb-4">
                <div className="relative bg-gray-200 rounded-lg h-32 flex items-center justify-center">
                  <img 
                    src={settings.hero_front_images[0]} 
                    alt="Hero preview" 
                    className="rounded-lg h-full object-cover"
                  />
                  {settings.hero_front_images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {settings.hero_front_images.length} images
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-indigo-600">
                  {settings.stat_customers || '25,000'}{settings.show_stat_plus_suffix !== false ? '+' : ''}
                </div>
                <div className="text-xs text-gray-600">{settings.stat_customers_label || 'Happy Customers'}</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-600">
                  {settings.stat_orders || '100,000'}{settings.show_stat_plus_suffix !== false ? '+' : ''}
                </div>
                <div className="text-xs text-gray-600">{settings.stat_orders_label || 'Orders Delivered'}</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {settings.stat_cities || '20'}{settings.show_stat_plus_suffix !== false ? '+' : ''}
                </div>
                <div className="text-xs text-gray-600">{settings.stat_cities_label || 'Cities Served'}</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {settings.stat_experience || '8'}{settings.show_stat_plus_suffix !== false ? '+' : ''}
                </div>
                <div className="text-xs text-gray-600">{settings.stat_experience_label || 'Years Experience'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroSettings;
