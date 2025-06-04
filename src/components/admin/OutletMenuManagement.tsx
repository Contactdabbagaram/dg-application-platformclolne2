
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useStoreData } from '@/hooks/useStoreData';
import PetpoojaSyncButton from '@/components/PetpoojaSyncButton';
import { Plus, Search, Filter, Edit, ChevronDown, ChevronRight, Package, Tag, Percent } from 'lucide-react';

interface OutletMenuManagementProps {
  outletName: string;
  restaurantId: string;
}

const OutletMenuManagement = ({ outletName, restaurantId }: OutletMenuManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('overview');
  
  const { storeData, loading, error, refetch } = useStoreData(restaurantId);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading menu data: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const activeCategories = storeData?.categories?.filter(cat => cat.is_active) || [];
  const availableItems = storeData?.items?.filter(item => item.status === 'available') || [];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Tag className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{activeCategories.length}</div>
            <div className="text-sm text-gray-600">Active Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <div className="text-2xl font-bold">{availableItems.length}</div>
            <div className="text-sm text-gray-600">Available Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Percent className="h-8 w-8 mx-auto text-purple-500 mb-2" />
            <div className="text-2xl font-bold">{storeData?.addons?.length || 0}</div>
            <div className="text-sm text-gray-600">Addon Groups</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Plus className="h-8 w-8 mx-auto text-orange-500 mb-2" />
            <div className="text-2xl font-bold">{storeData?.taxes?.length || 0}</div>
            <div className="text-sm text-gray-600">Tax Configurations</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <PetpoojaSyncButton restaurantId={restaurantId} syncType="menu" />
      </div>

      {/* Menu Categories */}
      <div className="space-y-4">
        {storeData?.categories?.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(category.id)}
                    className="p-0 h-auto"
                  >
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    ({storeData?.items?.filter(item => item.category_id === category.id).length || 0} items)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={category.is_active} 
                    onChange={() => {}} 
                  />
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {expandedCategories.has(category.id) && (
              <CardContent>
                <div className="space-y-3">
                  {storeData?.items?.filter(item => item.category_id === category.id).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image_url || '/placeholder.svg'}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">₹{item.price}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.is_vegetarian && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                Veg
                              </Badge>
                            )}
                            {item.is_popular && (
                              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                Popular
                              </Badge>
                            )}
                            <Badge variant={item.status === 'available' ? "default" : "secondary"} className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{item.preparation_time} mins</span>
                        <Switch 
                          checked={item.status === 'available'} 
                          onChange={() => {}} 
                        />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTaxes = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tax Configuration</h3>
        <Badge variant="outline">{storeData?.taxes?.length || 0} taxes configured</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storeData?.taxes?.map((tax) => (
          <Card key={tax.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{tax.tax_name}</h4>
                <Badge variant={tax.is_active ? "default" : "secondary"}>
                  {tax.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="space-y-1 text-sm">
                <div>Rate: {tax.tax_rate}%</div>
                <div>Petpooja ID: {tax.petpooja_tax_id}</div>
                {tax.description && <div>Description: {tax.description}</div>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAddons = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Addon Groups</h3>
        <Badge variant="outline">{storeData?.addons?.length || 0} addon groups</Badge>
      </div>
      
      <div className="space-y-4">
        {storeData?.addons?.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{group.name}</span>
                <Badge variant="outline">{group.petpooja_addon_items?.length || 0} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {group.petpooja_addon_items?.map((item) => (
                  <div key={item.id} className="border rounded p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant={item.is_active ? "default" : "secondary"}>
                        {item.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm">₹{item.price}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-gray-600">{outletName} - {storeData?.categories?.length || 0} categories, {storeData?.items?.length || 0} items</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Menu Overview' },
            { id: 'taxes', label: 'Taxes' },
            { id: 'addons', label: 'Addons' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'taxes' && renderTaxes()}
      {activeTab === 'addons' && renderAddons()}
    </div>
  );
};

export default OutletMenuManagement;
