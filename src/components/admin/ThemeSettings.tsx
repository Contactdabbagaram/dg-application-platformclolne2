
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette } from 'lucide-react';

interface ThemeSettingsProps {
  settings: any;
  onSettingsChange: (field: string, value: string) => void;
}

const ThemeSettings = ({ settings, onSettingsChange }: ThemeSettingsProps) => {
  const fontFamilies = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' }
  ];

  const fontWeights = [
    { value: '300', label: 'Light' },
    { value: '400', label: 'Normal' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semibold' },
    { value: '700', label: 'Bold' },
    { value: '800', label: 'Extra Bold' }
  ];

  const fontSizes = [
    { value: 'text-sm', label: 'Small' },
    { value: 'text-base', label: 'Base' },
    { value: 'text-lg', label: 'Large' },
    { value: 'text-xl', label: 'Extra Large' },
    { value: 'text-2xl', label: '2X Large' },
    { value: 'text-3xl', label: '3X Large' },
    { value: 'text-4xl', label: '4X Large' },
    { value: 'text-5xl', label: '5X Large' }
  ];

  return (
    <div className="space-y-6">
      {/* Color Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Primary Colors</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Header Bar Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.header_bar_color || '#6366F1'}
                    onChange={(e) => onSettingsChange('header_bar_color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={settings.header_bar_color || '#6366F1'} 
                    onChange={(e) => onSettingsChange('header_bar_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.primary_color || '#6366F1'}
                    onChange={(e) => onSettingsChange('primary_color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={settings.primary_color || '#6366F1'} 
                    onChange={(e) => onSettingsChange('primary_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.secondary_color || '#10B981'}
                    onChange={(e) => onSettingsChange('secondary_color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={settings.secondary_color || '#10B981'} 
                    onChange={(e) => onSettingsChange('secondary_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.accent_color || '#8B5CF6'}
                    onChange={(e) => onSettingsChange('accent_color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={settings.accent_color || '#8B5CF6'} 
                    onChange={(e) => onSettingsChange('accent_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Button Colors</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Primary Button Background</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.primary_button_bg_color || '#6366F1'}
                    onChange={(e) => onSettingsChange('primary_button_bg_color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={settings.primary_button_bg_color || '#6366F1'} 
                    onChange={(e) => onSettingsChange('primary_button_bg_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Primary Button Text</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.primary_button_text_color || '#FFFFFF'}
                    onChange={(e) => onSettingsChange('primary_button_text_color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={settings.primary_button_text_color || '#FFFFFF'} 
                    onChange={(e) => onSettingsChange('primary_button_text_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary Button Background</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.secondary_button_bg_color || '#FFFFFF'}
                    onChange={(e) => onSettingsChange('secondary_button_bg_color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={settings.secondary_button_bg_color || '#FFFFFF'} 
                    onChange={(e) => onSettingsChange('secondary_button_bg_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary Button Text</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.secondary_button_text_color || '#10B981'}
                    onChange={(e) => onSettingsChange('secondary_button_text_color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={settings.secondary_button_text_color || '#10B981'} 
                    onChange={(e) => onSettingsChange('secondary_button_text_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Typography Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Headings</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select 
                  value={settings.heading_font_family || 'Inter'}
                  onValueChange={(value) => onSettingsChange('heading_font_family', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select 
                  value={settings.heading_font_weight || '700'}
                  onValueChange={(value) => onSettingsChange('heading_font_weight', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select 
                  value={settings.heading_font_size || 'text-5xl'}
                  onValueChange={(value) => onSettingsChange('heading_font_size', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.heading_text_color || '#1F2937'}
                    onChange={(e) => onSettingsChange('heading_text_color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={settings.heading_text_color || '#1F2937'} 
                    onChange={(e) => onSettingsChange('heading_text_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Body Text</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select 
                  value={settings.body_font_family || 'Inter'}
                  onValueChange={(value) => onSettingsChange('body_font_family', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select 
                  value={settings.body_font_weight || '400'}
                  onValueChange={(value) => onSettingsChange('body_font_weight', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select 
                  value={settings.body_font_size || 'text-base'}
                  onValueChange={(value) => onSettingsChange('body_font_size', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.body_text_color || '#6B7280'}
                    onChange={(e) => onSettingsChange('body_text_color', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input 
                    value={settings.body_text_color || '#6B7280'} 
                    onChange={(e) => onSettingsChange('body_text_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettings;
