
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useMenuCategories, useMenuItems } from '@/hooks/useMenu';
import PetpoojaSyncButton from '@/components/PetpoojaSyncButton';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';

const MenuManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: categories, isLoading: categoriesLoading } = useMenuCategories();
  const { data: menuItems, isLoading: itemsLoading } = useMenuItems(selectedCategory || undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <PetpoojaSyncButton restaurantId="restaurant-1" syncType="menu" />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Parent Category
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
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

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
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
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.id ? null : category.id
                        )}
                        className="text-lg"
                      >
                        {selectedCategory === category.id ? '▼' : '▶'}
                      </button>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
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
              
              {selectedCategory === category.id && (
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
    </div>
  );
};

export default MenuManagement;
