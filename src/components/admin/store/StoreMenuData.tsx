import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Tag, Plus, Percent } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  petpooja_category_id?: string;
  sort_order: number;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  is_vegetarian: boolean;
  is_popular: boolean;
  status: string;
  petpooja_item_id?: string;
}

interface Variation {
  id: string;
  name: string;
  price: number;
  group_name?: string;
  is_active: boolean;
}

interface AddonGroup {
  id: string;
  name: string;
  petpooja_addon_items: Array<{
    id: string;
    name: string;
    price: number;
    is_active: boolean;
  }>;
}

interface StoreMenuDataProps {
  categories: Category[];
  items: MenuItem[];
  variations: Variation[];
  addons: AddonGroup[];
  loading: boolean;
  restaurant?: any; // Added: pass restaurant info from above
}

const StoreMenuData = ({ categories, items, variations, addons, loading, restaurant }: StoreMenuDataProps) => {
  if (loading) {
    return <div className="text-center py-8">Loading menu data...</div>;
  }

  const activeCategories = categories.filter(cat => cat.is_active);
  const availableItems = items.filter(item => item.status === 'available');

  return (
    <div className="space-y-6">
      {/* Restaurant Info at the Top */}
      {restaurant && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-4">
          <div className="flex flex-wrap items-center gap-4 text-blue-900">
            <span className="font-bold text-lg">{restaurant.name}</span>
            <span className="rounded px-2 py-1 bg-blue-200 text-blue-800 text-xs">Restaurant ID: {restaurant.id}</span>
            <span className="text-gray-700">City: {restaurant.city ?? 'N/A'}</span>
            <span className="text-gray-700">State: {restaurant.state ?? 'N/A'}</span>
            <span className="text-gray-700">Min Order: ₹{restaurant.minimum_order_amount ?? 0}</span>
            <span className="text-gray-700">Delivery Charge: ₹{restaurant.delivery_charge ?? 0}</span>
            <span className="text-gray-700">Prep Time: {restaurant.minimum_prep_time ?? 30} mins</span>
            <span className="text-gray-700">Status: <b>{restaurant.status}</b></span>
          </div>
        </div>
      )}

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
            <div className="text-2xl font-bold">{variations.length}</div>
            <div className="text-sm text-gray-600">Variations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Plus className="h-8 w-8 mx-auto text-orange-500 mb-2" />
            <div className="text-2xl font-bold">{addons.length}</div>
            <div className="text-sm text-gray-600">Addon Groups</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
          <TabsTrigger value="items">Menu Items ({items.length})</TabsTrigger>
          <TabsTrigger value="variations">Variations ({variations.length})</TabsTrigger>
          <TabsTrigger value="addons">Addons ({addons.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{category.name}</span>
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.description && (
                      <p className="text-sm text-gray-600">{category.description}</p>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Order: {category.sort_order}</span>
                      {category.petpooja_category_id && (
                        <span>ID: {category.petpooja_category_id}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="items">
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryItems = items.filter(item => item.category_id === category.id);
              if (categoryItems.length === 0) return null;
              
              return (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name} ({categoryItems.length} items)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant={item.status === 'available' ? "default" : "secondary"}>
                              {item.status}
                            </Badge>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">₹{item.price}</span>
                            <div className="flex gap-1">
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="variations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {variations.map((variation) => (
              <Card key={variation.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{variation.name}</h4>
                    <Badge variant={variation.is_active ? "default" : "secondary"}>
                      {variation.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div>Price: ₹{variation.price}</div>
                    {variation.group_name && (
                      <div className="text-sm text-gray-600">Group: {variation.group_name}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="addons">
          <div className="space-y-4">
            {addons.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle>{group.name} ({group.petpooja_addon_items.length} items)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {group.petpooja_addon_items.map((item) => (
                      <div key={item.id} className="border rounded p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant={item.is_active ? "default" : "secondary"}>
                            {item.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="mt-1">₹{item.price}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreMenuData;
