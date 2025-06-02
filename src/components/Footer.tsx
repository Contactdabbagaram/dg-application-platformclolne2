
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { useFrontendSettings } from '@/hooks/useFrontendSettings';
import { useRestaurant } from '@/contexts/RestaurantContext';

const Footer = () => {
  const { currentRestaurant } = useRestaurant();
  const restaurantId = currentRestaurant?.id || '';
  const { settings } = useFrontendSettings(restaurantId);

  const businessName = settings?.business_name || 'DabbaGaram';
  const footerAbout = settings?.footer_about || 'DabbaGaram brings you the finest homestyle meals prepared with fresh ingredients and traditional recipes.';
  const copyrightText = settings?.copyright_text || '© 2024 DabbaGaram. All rights reserved.';
  const contactPhone = settings?.contact_phone || '+91-9876543210';
  const contactEmail = settings?.contact_email || 'contact@dabbagaram.com';
  const contactAddress = settings?.contact_address || '123 Food Street, Mumbai, Maharashtra 400001, India';
  const facebookUrl = settings?.facebook_url;
  const instagramUrl = settings?.instagram_url;
  const twitterUrl = settings?.twitter_url;
  const whatsappNumber = settings?.whatsapp_number;
  const primaryColor = settings?.primary_color || '#3B82F6';

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div 
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3"
                style={{ backgroundColor: primaryColor }}
              >
                {businessName.charAt(0)}
              </div>
              <span className="text-xl font-bold">{businessName}</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {footerAbout}
            </p>
            <div className="flex space-x-4">
              {facebookUrl && (
                <a href={facebookUrl} className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
              )}
              {whatsappNumber && (
                <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} className="text-gray-400 hover:text-white transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/menu" className="text-gray-300 hover:text-white transition-colors">Menu</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/support" className="text-gray-300 hover:text-white transition-colors">Support</a></li>
              <li><a href="/subscriptions" className="text-gray-300 hover:text-white transition-colors">Subscriptions</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Home Delivery</span></li>
              <li><span className="text-gray-300">Meal Subscriptions</span></li>
              <li><span className="text-gray-300">Catering Services</span></li>
              <li><span className="text-gray-300">Corporate Meals</span></li>
              <li><span className="text-gray-300">Special Events</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-300">{contactPhone}</span>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-300">{contactEmail}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-300">{contactAddress}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
