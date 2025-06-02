
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSupportCategories, useCreateSupportCategory, useUpdateSupportCategory, useDeleteSupportCategory } from '@/hooks/useSupportCategories';
import { Plus, Edit, Trash2, GripVertical, Package, Clock, CreditCard, Star, MessageSquare, RefreshCw } from 'lucide-react';
import type { TablesInsert } from '@/integrations/supabase/types';

interface SupportCategoriesManagerProps {
  restaurantId: string;
}

const iconOptions = [
  { value: 'package', label: 'Package', icon: Package },
  { value: 'clock', label: 'Clock', icon: Clock },
  { value: 'credit-card', label: 'Credit Card', icon: CreditCard },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'message-square', label: 'Message Square', icon: MessageSquare },
  { value: 'refresh-cw', label: 'Refresh', icon: RefreshCw },
];

const colorOptions = [
  { value: 'bg-red-50 text-red-600 border-red-200', accent: 'bg-red-500', label: 'Red' },
  { value: 'bg-amber-50 text-amber-600 border-amber-200', accent: 'bg-amber-500', label: 'Amber' },
  { value: 'bg-blue-50 text-blue-600 border-blue-200', accent: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-green-50 text-green-600 border-green-200', accent: 'bg-green-500', label: 'Green' },
  { value: 'bg-purple-50 text-purple-600 border-purple-200', accent: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-gray-50 text-gray-600 border-gray-200', accent: 'bg-gray-500', label: 'Gray' },
];

const SupportCategoriesManager = ({ restaurantId }: SupportCategoriesManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'help-circle',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    accent_color: 'bg-blue-500',
    is_urgent: false,
    is_active: true,
  });

  const { data: categories, isLoading } = useSupportCategories(restaurantId);
  const createCategory = useCreateSupportCategory();
  const updateCategory = useUpdateSupportCategory();
  const deleteCategory = useDeleteSupportCategory();

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          updates: formData,
        });
      } else {
        const categoryData: TablesInsert<'support_categories'> = {
          ...formData,
          restaurant_id: restaurantId,
          sort_order: (categories?.length || 0) + 1,
        };
        await createCategory.mutateAsync(categoryData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'help-circle',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      accent_color: 'bg-blue-500',
      is_urgent: false,
      is_active: true,
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon,
      color: category.color,
      accent_color: category.accent_color,
      is_urgent: category.is_urgent,
      is_active: category.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory.mutateAsync(id);
    }
  };

  const handleColorChange = (color: string) => {
    const colorOption = colorOptions.find(c => c.value === color);
    setFormData(prev => ({
      ...prev,
      color,
      accent_color: colorOption?.accent || 'bg-blue-500',
    }));
  };

  if (isLoading) return <div>Loading categories...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {categories?.length || 0} categories configured
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Order Issues"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this category"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Icon</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color Theme</Label>
                <Select value={formData.color} onValueChange={handleColorChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${option.accent}`}></div>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="urgent">Mark as Urgent</Label>
                <Switch
                  id="urgent"
                  checked={formData.is_urgent}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_urgent: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active</Label>
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories?.map((category) => {
          const IconComponent = iconOptions.find(icon => icon.value === category.icon)?.icon || MessageSquare;
          return (
            <Card key={category.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {category.name}
                        {category.is_urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                        {!category.is_active && (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {categories?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No categories configured yet. Add your first category to get started.
        </div>
      )}
    </div>
  );
};

export default SupportCategoriesManager;
