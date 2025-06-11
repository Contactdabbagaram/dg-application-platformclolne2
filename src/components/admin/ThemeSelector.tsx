
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Palette, Layout, Sparkles, Minimize2 } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSelector = ({ selectedTheme, onThemeChange }: ThemeSelectorProps) => {
  const themes = [
    {
      id: 'classic',
      name: 'Classic Hero',
      description: 'Traditional hero section with carousel and stats',
      icon: Layout,
      preview: 'Large hero image with call-to-action buttons and statistics',
      features: ['Hero carousel', 'Statistics display', 'Gradient backgrounds', 'Traditional layout']
    },
    {
      id: 'promotional',
      name: 'Promotional Banners',
      description: 'Eye-catching offers and promotional content',
      icon: Sparkles,
      preview: 'Bold promotional banners with deals and offers',
      features: ['Large promotional banners', 'Offer cards', 'Deal highlights', 'Action-focused design']
    },
    {
      id: 'categories',
      name: 'Featured Categories',
      description: 'Category-focused layout with visual menu exploration',
      icon: Palette,
      preview: 'Beautiful category cards with images and descriptions',
      features: ['Category showcase', 'Visual menu preview', 'Modern grid layout', 'Category navigation']
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Simple, elegant design focused on content',
      icon: Minimize2,
      preview: 'Clean typography with minimal distractions',
      features: ['Minimal design', 'Typography focus', 'Clean aesthetics', 'Simplified layout']
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Homepage Theme Selection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedTheme} onValueChange={onThemeChange}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {themes.map((theme) => {
              const IconComponent = theme.icon;
              return (
                <div key={theme.id} className="relative">
                  <Label 
                    htmlFor={theme.id}
                    className={`block cursor-pointer rounded-lg border-2 p-6 hover:border-indigo-200 transition-colors ${
                      selectedTheme === theme.id 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <RadioGroupItem value={theme.id} id={theme.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${
                            selectedTheme === theme.id ? 'bg-indigo-100' : 'bg-gray-100'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${
                              selectedTheme === theme.id ? 'text-indigo-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                            {selectedTheme === theme.id && (
                              <Badge className="bg-indigo-100 text-indigo-800 text-xs">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                        <p className="text-xs text-gray-500 mb-3 italic">{theme.preview}</p>
                        <div className="flex flex-wrap gap-1">
                          {theme.features.map((feature, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
