
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useMenuCategories, useMenuItems } from '@/hooks/useMenu';
import PetpoojaSyncButton from '@/components/PetpoojaSyncButton';
import { Plus, Search, Filter, Edit, ChevronDown, ChevronRight } from 'lucide-react';

interface OutletMenuManagementProps {
  outletName: string;
  onBack: () => void;
}

const OutletMenuManagement = ({ outletName, onBack }: OutletMenuManagementProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  const { data: categories, isLoading: categoriesLoading } = useMenuCategories();
  const { data: menuItems, isLoading: itemsLoading } = useMenuItems();

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              ← Back
            </Button>
            <h1 className="text-xl font-semibold">Menu</h1>
            <span className="text-gray-500">{outletName}</span>
            <Button variant="link" className="text-blue-500 text-sm">Help?</Button>
          </div>
          <div className="flex items-center gap-2">
            <PetpoojaSyncButton restaurantId="restaurant-1" syncType="menu" />
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Item name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Info Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-800">
            <strong>Menu is managed by Petpooja</strong><br />
            Allowed actions: Timings, sorting and status change
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {categoriesLoading ? (
            <div>Loading categories...</div>
          ) : (
            categories?.map((category) => (
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
                    {itemsLoading ? (
                      <div>Loading menu items...</div>
                    ) : (
                      <div className="space-y-3">
                        {menuItems?.filter(item => item.category_id === category.id).map((item) => (
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
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Add Parent Category Button */}
        <div className="mt-6">
          <Button variant="outline" className="text-green-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Parent Category
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OutletMenuManagement;
