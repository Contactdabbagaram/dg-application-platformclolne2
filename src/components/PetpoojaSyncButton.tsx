
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PetpoojaSyncButtonProps {
  restaurantId: string;
  syncType?: 'menu' | 'orders';
  onSyncComplete?: () => void;
}

const PetpoojaSyncButton = ({ 
  restaurantId, 
  syncType = 'menu',
  onSyncComplete 
}: PetpoojaSyncButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('petpooja-sync', {
        body: {
          restaurant_id: restaurantId,
          sync_type: syncType
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Sync Successful",
        description: `${syncType} sync completed successfully`,
        duration: 3000,
      });

      if (onSyncComplete) {
        onSyncComplete();
      }

    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: error.message || `Failed to sync ${syncType}`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      {isLoading ? `Syncing ${syncType}...` : `Sync ${syncType}`}
    </Button>
  );
};

export default PetpoojaSyncButton;
