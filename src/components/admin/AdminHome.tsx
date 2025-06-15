
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Store, Settings } from 'lucide-react';

interface AdminHomeProps {
  outlets: { id: string; name: string; address: string | null }[];
  onNavigateToBusinessSettings: () => void;
  onNavigateToOutletManagement: () => void;
  onOutletSelect: (outlet: { id: string; name: string }) => void;
  onNavigateToFrontendSettings: () => void;
  onNavigateToStoreSettings: () => void;
}

const AdminHome = ({ 
  outlets,
  onNavigateToBusinessSettings, 
  onNavigateToOutletManagement, 
  onOutletSelect, 
  onNavigateToFrontendSettings,
  onNavigateToStoreSettings 
}: AdminHomeProps) => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-xl font-semibold">DabbaGaram Admin</span>
          </div>
          <span className="text-gray-600">Account</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Website Info */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-gray-100 px-4 py-2 rounded border text-sm">
              https://www.dabbagaram.com
            </span>
            <Button size="sm" variant="outline" className="bg-green-500 text-white hover:bg-green-600">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Business Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select className="bg-white border rounded px-4 py-2 text-lg">
              <option>Dabba Garam</option>
            </select>
            <Button 
              variant="outline" 
              className="text-blue-600"
              onClick={onNavigateToBusinessSettings}
            >
              <Settings className="h-4 w-4 mr-2" />
              View Business
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={onNavigateToBusinessSettings}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Business Settings</h3>
                <p className="text-sm text-gray-600">Manage integrations, payments, and general settings</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={onNavigateToOutletManagement}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Outlet Management</h3>
                <p className="text-sm text-gray-600">Add, edit, and manage your store outlets</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={onNavigateToFrontendSettings}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Frontend Settings</h3>
                <p className="text-sm text-gray-600">Customize your website appearance and content</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Outlets List */}
        <Card>
          <CardContent className="p-0">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Store Outlets</h2>
            </div>
            <div className="divide-y">
              {outlets.map((outlet) => (
                <div key={outlet.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">{outlet.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 truncate max-w-xs">{outlet.address || 'N/A'}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600"
                      onClick={() => onOutletSelect({ id: outlet.id, name: outlet.name })}
                    >
                      View Store ▶
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
