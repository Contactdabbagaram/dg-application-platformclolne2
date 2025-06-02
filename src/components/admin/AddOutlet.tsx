
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface AddOutletProps {
  onBack: () => void;
  onSave: (outletName: string) => void;
}

const AddOutlet = ({ onBack, onSave }: AddOutletProps) => {
  const [outletName, setOutletName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (outletName.trim()) {
      onSave(outletName.trim());
      setOutletName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <h2 className="text-2xl font-bold">Add New Outlet</h2>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Quick Outlet Creation</CardTitle>
          <p className="text-sm text-gray-600">
            Add outlet name now, complete details later in outlet management
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="outlet-name">Outlet Name *</Label>
              <Input
                id="outlet-name"
                value={outletName}
                onChange={(e) => setOutletName(e.target.value)}
                placeholder="Enter outlet name (e.g., Koramangala Branch)"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={!outletName.trim()}>
                Create Outlet
              </Button>
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOutlet;
