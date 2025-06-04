
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Settings, 
  MapPin, 
  Package, 
  Clock, 
  Calendar, 
  ShoppingBag,
  Star,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OutletSettingsLayoutProps {
  outletName: string;
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onBack: () => void;
}

const OutletSettingsLayout = ({ 
  outletName, 
  children, 
  activeSection, 
  onSectionChange, 
  onBack 
}: OutletSettingsLayoutProps) => {
  const [isStoreActive, setIsStoreActive] = useState(true);

  const sidebarItems = [
    { id: 'dashboard', label: 'Store Dashboard', icon: Store },
    { id: 'menu', label: 'Menu Management', icon: Package },
    { id: 'orders', label: 'Store Orders', icon: ShoppingBag },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  const getHeaderTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Dashboard';
      case 'menu':
        return 'Menu Management';
      case 'orders':
        return 'Orders';
      case 'reviews':
        return 'Reviews';
      case 'settings':
        return 'Settings';
      default:
        return 'Settings';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-white hover:bg-gray-700 mb-3 p-0 h-auto"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Dabba Garam</span>
          </Button>
          <div className="text-sm text-gray-400">Business Stores</div>
          
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Store</div>
              <div className="text-lg font-semibold">{outletName}</div>
            </div>
            <div className="flex items-center">
              <div 
                className={`w-3 h-3 rounded-full mr-2 ${
                  isStoreActive ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <button 
                onClick={() => setIsStoreActive(!isStoreActive)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  isStoreActive ? 'bg-green-500' : 'bg-gray-600'
                } relative`}
              >
                <div 
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    isStoreActive ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    activeSection === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-xs">V</span>
            </div>
            <span>vivek yadav</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Powered by Autiller</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{getHeaderTitle()}</h1>
              <span className="text-gray-500">{outletName}</span>
            </div>
            <Button>Save Changes</Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OutletSettingsLayout;
