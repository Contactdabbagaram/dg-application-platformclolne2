import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFrontendSettings } from '@/hooks/useFrontendSettings';
import { useCustomerReviews } from '@/hooks/useCustomerReviews';
import { useRestaurant } from '@/contexts/RestaurantContext';
import ImageUpload from './ImageUpload';
import HeroSettings from './HeroSettings';
import ThemeSettings from './ThemeSettings';
import NavigationSettings from './NavigationSettings';
import ThemeSelector from './ThemeSelector';
import { 
  Save,
  Loader2,
  Palette,
  Image as ImageIcon,
  Type,
  Globe,
  Star,
  Navigation,
  Eye,
  Layout
} from 'lucide-react';

const FrontendSettings = () => {
  const [localSettings, setLocalSettings] = useState<any>({});
  
  const { currentRestaurant, loading: restaurantLoading } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  
  const { settings, loading, saving, saveSettings } = useFrontendSettings(restaurantId);
  const { reviews } = useCustomerReviews(restaurantId);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    } else if (!loading && restaurantId) {
      // Initialize with comprehensive default values including homepage_theme
      setLocalSettings({
        business_name: 'DabbaGaram Restaurant',
        hero_title: 'Fresh Homestyle Meals Delivered',
        hero_subtitle: 'Experience authentic flavors crafted with love and delivered straight to your doorstep',
        tagline_badge_text: 'Authentic Home-Style Cooking',
        primary_cta_text: 'Order Now',
        secondary_cta_text: 'View Our Menu',
        primary_cta_url: '/menu',
        secondary_cta_url: '/menu',
        stat_customers: '25,000',
        stat_orders: '100,000',
        stat_cities: '20',
        stat_experience: '8',
        stat_customers_label: 'Happy Customers',
        stat_orders_label: 'Orders Delivered',
        stat_cities_label: 'Cities Served',
        stat_experience_label: 'Years Experience',
        show_stat_plus_suffix: true,
        contact_phone: '+91-9876543210',
        contact_email: 'contact@dabbagaram.com',
        contact_address: '123 Food Street, Mumbai, Maharashtra 400001, India',
        delivery_radius_text: 'Free delivery within 5km',
        order_cutoff_text: 'Order before 8 PM for same-day delivery',
        footer_about: 'DabbaGaram brings you the finest homestyle meals prepared with fresh ingredients and traditional recipes.',
        copyright_text: '© 2024 DabbaGaram. All rights reserved.',
        site_title: 'DabbaGaram - Authentic Homestyle Meals',
        meta_description: 'Order delicious homestyle meals online. Fresh, authentic cuisine delivered to your doorstep.',
        meta_keywords: 'indian food, homestyle meals, food delivery, authentic cuisine, mumbai food, online ordering',
        popular_badge_text: 'Popular Choice',
        new_badge_text: 'New Item',
        bestseller_badge_text: 'Bestseller',
        special_badge_text: 'Chef Special',
        primary_color: '#6366F1',
        secondary_color: '#10B981',
        accent_color: '#8B5CF6',
        header_bar_color: '#6366F1',
        primary_button_bg_color: '#6366F1',
        primary_button_text_color: '#FFFFFF',
        secondary_button_bg_color: '#FFFFFF',
        secondary_button_text_color: '#10B981',
        secondary_button_border_color: '#10B981',
        heading_font_family: 'Inter',
        body_font_family: 'Inter',
        heading_font_weight: '700',
        body_font_weight: '400',
        heading_font_size: 'text-5xl',
        body_font_size: 'text-base',
        heading_text_color: '#1F2937',
        body_text_color: '#6B7280',
        show_cart_button: true,
        cart_button_url: '/cart',
        navigation_menu: [
          { id: 'home', label: 'Home', url: '/', order: 1 },
          { id: 'menu', label: 'Menu', url: '/menu', order: 2 },
          { id: 'support', label: 'Support', url: '/support', order: 3 }
        ],
        enable_live_preview: true,
        homepage_theme: 'classic' // Default theme
      });
    }
  }, [settings, loading, restaurantId]);

  const handleInputChange = (field: string, value: any) => {
    setLocalSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveFrontendSettings = async () => {
    if (!restaurantId) {
      console.error('No restaurant ID available');
      return;
    }
    await saveSettings(localSettings);
  };

  if (restaurantLoading || loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading frontend settings...</span>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-2">No restaurant found</p>
          <p className="text-sm text-gray-500">Please ensure a restaurant is properly configured.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Frontend Settings</h3>
          <p className="text-sm text-gray-600">Comprehensive homepage customization for {currentRestaurant?.name}</p>
        </div>
        <Button onClick={handleSaveFrontendSettings} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="themes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Themes
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Navigation
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes">
          <ThemeSelector
            selectedTheme={localSettings.homepage_theme || 'classic'}
            onThemeChange={(theme) => handleInputChange('homepage_theme', theme)}
          />
        </TabsContent>

        <TabsContent value="hero">
          <HeroSettings settings={localSettings} onSettingsChange={handleInputChange} />
        </TabsContent>

        <TabsContent value="navigation">
          <NavigationSettings settings={localSettings} onSettingsChange={handleInputChange} />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeSettings settings={localSettings} onSettingsChange={handleInputChange} />
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageUpload
                    label="Business Logo (1024x1024px)"
                    currentImage={localSettings.logo_url}
                    onImageChange={(url) => handleInputChange('logo_url', url || '')}
                    path="logos"
                    placeholder="Upload your business logo"
                  />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Business Name</Label>
                      <Input 
                        value={localSettings.business_name || ''} 
                        onChange={(e) => handleInputChange('business_name', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input 
                      type="email" 
                      value={localSettings.contact_email || ''} 
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Business Address</Label>
                    <Textarea 
                      value={localSettings.contact_address || ''}
                      onChange={(e) => handleInputChange('contact_address', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media & Footer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Facebook URL</Label>
                    <Input 
                      value={localSettings.facebook_url || ''} 
                      onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                      placeholder="https://facebook.com/dabbagaram" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram URL</Label>
                    <Input 
                      value={localSettings.instagram_url || ''} 
                      onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                      placeholder="https://instagram.com/dabbagaram" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter URL</Label>
                    <Input 
                      value={localSettings.twitter_url || ''} 
                      onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                      placeholder="https://twitter.com/dabbagaram" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp Number</Label>
                    <Input 
                      value={localSettings.whatsapp_number || ''} 
                      onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                      placeholder="+91-9876543210" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>About Us Text</Label>
                    <Textarea 
                      value={localSettings.footer_about || ''}
                      onChange={(e) => handleInputChange('footer_about', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Copyright Text</Label>
                    <Input 
                      value={localSettings.copyright_text || ''} 
                      onChange={(e) => handleInputChange('copyright_text', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews & Badges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4">Live Customer Reviews</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Showing {reviews.length} real customer reviews with 4+ star ratings. These are automatically displayed on the homepage.
                </p>
                <div className="space-y-4">
                  {reviews.slice(0, 6).map((review) => (
                    <div key={review.id} className="flex items-start justify-between p-4 border rounded-lg bg-green-50">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{review.customer_name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{review.customer_name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{review.review_text}</p>
                          <div className="flex items-center gap-1 mt-2">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Live Review</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4">Menu Item Badges</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Popular Item Badge</Label>
                    <Input 
                      value={localSettings.popular_badge_text || ''} 
                      onChange={(e) => handleInputChange('popular_badge_text', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>New Item Badge</Label>
                    <Input 
                      value={localSettings.new_badge_text || ''} 
                      onChange={(e) => handleInputChange('new_badge_text', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bestseller Badge</Label>
                    <Input 
                      value={localSettings.bestseller_badge_text || ''} 
                      onChange={(e) => handleInputChange('bestseller_badge_text', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Special Badge</Label>
                    <Input 
                      value={localSettings.special_badge_text || ''} 
                      onChange={(e) => handleInputChange('special_badge_text', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Website Title</Label>
                  <Input 
                    value={localSettings.site_title || ''} 
                    onChange={(e) => handleInputChange('site_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea 
                    value={localSettings.meta_description || ''}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Keywords</Label>
                  <Input 
                    value={localSettings.meta_keywords || ''} 
                    onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Favicon & Icons</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUpload
                  label="Favicon (32x32px)"
                  currentImage={localSettings.favicon_url}
                  onImageChange={(url) => handleInputChange('favicon_url', url || '')}
                  path="favicons"
                  accept=".ico,.png"
                  placeholder="Upload favicon (.ico or .png)"
                />
                <ImageUpload
                  label="Apple Touch Icon (180x180px)"
                  currentImage={localSettings.apple_touch_icon_url}
                  onImageChange={(url) => handleInputChange('apple_touch_icon_url', url || '')}
                  path="icons"
                  placeholder="Upload apple touch icon"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Open Graph Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Open Graph Title</Label>
                  <Input 
                    value={localSettings.og_title || ''} 
                    onChange={(e) => handleInputChange('og_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Open Graph Description</Label>
                  <Textarea 
                    value={localSettings.og_description || ''}
                    onChange={(e) => handleInputChange('og_description', e.target.value)}
                    rows={2}
                  />
                </div>
                <ImageUpload
                  label="Open Graph Image (1200x630px)"
                  currentImage={localSettings.og_image_url}
                  onImageChange={(url) => handleInputChange('og_image_url', url || '')}
                  path="og-images"
                  placeholder="Upload social sharing image"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FrontendSettings;
