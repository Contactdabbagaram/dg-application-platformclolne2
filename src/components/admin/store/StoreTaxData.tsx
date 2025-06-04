
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt, Percent } from 'lucide-react';

interface Tax {
  id: string;
  tax_name: string;
  tax_rate: number;
  tax_type: number;
  description?: string;
  is_active: boolean;
  petpooja_tax_id: string;
  core_or_total: number;
  consider_in_core_amount: boolean;
  order_types?: string;
}

interface StoreTaxDataProps {
  taxes: Tax[];
  loading: boolean;
}

const StoreTaxData = ({ taxes, loading }: StoreTaxDataProps) => {
  if (loading) {
    return <div className="text-center py-8">Loading tax data...</div>;
  }

  const activeTaxes = taxes.filter(tax => tax.is_active);

  const getTaxTypeLabel = (type: number) => {
    switch (type) {
      case 1: return 'Percentage';
      case 2: return 'Fixed Amount';
      default: return 'Unknown';
    }
  };

  const getCoreOrTotalLabel = (type: number) => {
    switch (type) {
      case 1: return 'On Core Amount';
      case 2: return 'On Total Amount';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Receipt className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{taxes.length}</div>
            <div className="text-sm text-gray-600">Total Taxes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Percent className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <div className="text-2xl font-bold">{activeTaxes.length}</div>
            <div className="text-sm text-gray-600">Active Taxes</div>
          </CardContent>
        </Card>
      </div>

      {taxes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tax Data</h3>
            <p className="text-gray-500">No tax configurations found. Sync data from Petpooja to view tax settings.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taxes.map((tax) => (
            <Card key={tax.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{tax.tax_name}</span>
                  <Badge variant={tax.is_active ? "default" : "secondary"}>
                    {tax.is_active ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Rate:</span>
                  </div>
                  <div>
                    {tax.tax_rate}%
                  </div>
                  
                  <div>
                    <span className="font-medium">Type:</span>
                  </div>
                  <div>
                    {getTaxTypeLabel(tax.tax_type)}
                  </div>
                  
                  <div>
                    <span className="font-medium">Applied On:</span>
                  </div>
                  <div>
                    {getCoreOrTotalLabel(tax.core_or_total)}
                  </div>
                  
                  <div>
                    <span className="font-medium">Petpooja ID:</span>
                  </div>
                  <div>
                    {tax.petpooja_tax_id}
                  </div>
                </div>

                {tax.description && (
                  <div>
                    <span className="font-medium text-sm">Description:</span>
                    <p className="text-sm text-gray-600 mt-1">{tax.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {tax.consider_in_core_amount && (
                    <Badge variant="outline" className="text-xs">
                      Core Amount
                    </Badge>
                  )}
                  {tax.order_types && (
                    <Badge variant="outline" className="text-xs">
                      {tax.order_types}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreTaxData;
