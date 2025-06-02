
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
import { useSupportResponses, useCreateSupportResponse, useUpdateSupportResponse, useDeleteSupportResponse } from '@/hooks/useSupportResponses';
import { useSupportCategories } from '@/hooks/useSupportCategories';
import { Plus, Edit, Trash2, MessageSquare, Hash } from 'lucide-react';
import type { TablesInsert } from '@/integrations/supabase/types';

interface SupportResponsesManagerProps {
  restaurantId: string;
}

const SupportResponsesManager = ({ restaurantId }: SupportResponsesManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<any>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    response_type: 'keyword' as 'greeting' | 'keyword' | 'fallback',
    keywords: '',
    response_text: '',
    buttons: [] as Array<{ text: string; action: string }>,
    is_active: true,
  });

  const { data: responses, isLoading } = useSupportResponses(restaurantId);
  const { data: categories } = useSupportCategories(restaurantId);
  const createResponse = useCreateSupportResponse();
  const updateResponse = useUpdateSupportResponse();
  const deleteResponse = useDeleteSupportResponse();

  const handleSubmit = async () => {
    try {
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      if (editingResponse) {
        await updateResponse.mutateAsync({
          id: editingResponse.id,
          updates: {
            ...formData,
            keywords: keywordsArray,
            buttons: formData.buttons.length > 0 ? formData.buttons : null,
          },
        });
      } else {
        const responseData: TablesInsert<'support_responses'> = {
          ...formData,
          restaurant_id: restaurantId,
          keywords: keywordsArray,
          buttons: formData.buttons.length > 0 ? formData.buttons : null,
        };
        await createResponse.mutateAsync(responseData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: '',
      response_type: 'keyword',
      keywords: '',
      response_text: '',
      buttons: [],
      is_active: true,
    });
    setEditingResponse(null);
  };

  const handleEdit = (response: any) => {
    setEditingResponse(response);
    setFormData({
      category_id: response.category_id || '',
      response_type: response.response_type,
      keywords: response.keywords?.join(', ') || '',
      response_text: response.response_text,
      buttons: response.buttons || [],
      is_active: response.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this response?')) {
      await deleteResponse.mutateAsync(id);
    }
  };

  const addButton = () => {
    setFormData(prev => ({
      ...prev,
      buttons: [...prev.buttons, { text: '', action: '' }],
    }));
  };

  const updateButton = (index: number, field: 'text' | 'action', value: string) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons.map((btn, i) => 
        i === index ? { ...btn, [field]: value } : btn
      ),
    }));
  };

  const removeButton = (index: number) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) return <div>Loading responses...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {responses?.length || 0} auto-responses configured
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Response
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingResponse ? 'Edit Auto Response' : 'Add New Auto Response'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Response Type</Label>
                  <Select value={formData.response_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, response_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="greeting">Greeting Message</SelectItem>
                      <SelectItem value="keyword">Keyword Response</SelectItem>
                      <SelectItem value="fallback">Fallback Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">All Categories</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.response_type === 'keyword' && (
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="e.g., cancel, refund, help, track"
                  />
                  <p className="text-xs text-gray-500">
                    Enter keywords that will trigger this response
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="response_text">Response Message</Label>
                <Textarea
                  id="response_text"
                  value={formData.response_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, response_text: e.target.value }))}
                  placeholder="Enter the response message..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Action Buttons</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addButton}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Button
                  </Button>
                </div>
                {formData.buttons.map((button, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Button text"
                      value={button.text}
                      onChange={(e) => updateButton(index, 'text', e.target.value)}
                    />
                    <Input
                      placeholder="Action ID"
                      value={button.action}
                      onChange={(e) => updateButton(index, 'action', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeButton(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
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
                  {editingResponse ? 'Update' : 'Create'} Response
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
        {responses?.map((response) => (
          <Card key={response.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">
                      {response.response_type}
                    </Badge>
                    {response.support_categories && (
                      <Badge variant="secondary">
                        {response.support_categories.name}
                      </Badge>
                    )}
                    {!response.is_active && (
                      <Badge variant="destructive">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  
                  {response.keywords && response.keywords.length > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <Hash className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        Keywords: {response.keywords.join(', ')}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-800 mb-2">
                    {response.response_text}
                  </p>
                  
                  {response.buttons && Array.isArray(response.buttons) && response.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {response.buttons.map((button: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {button.text}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(response)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(response.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {responses?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No auto-responses configured yet. Add your first response to get started.
        </div>
      )}
    </div>
  );
};

export default SupportResponsesManager;
