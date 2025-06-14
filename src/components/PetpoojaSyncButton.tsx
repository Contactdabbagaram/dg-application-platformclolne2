
import { Button } from '@/components/ui/button';
import { usePetpoojaSync } from '@/hooks/usePetpoojaSync';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface PetpoojaSyncButtonProps {
  outletId: string;
  syncType: 'menu' | 'taxes' | 'discounts' | 'all';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const PetpoojaSyncButton = ({ 
  outletId, 
  syncType, 
  variant = 'outline', 
  size = 'default',
  className = '' 
}: PetpoojaSyncButtonProps) => {
  const { triggerSync, loading } = usePetpoojaSync();

  const handleSync = async () => {
    try {
      await triggerSync(outletId, syncType);
      toast.success(`${syncType} sync completed successfully!`);
    } catch (error) {
      console.error('Sync error:', error);
      toast.error(`Failed to sync ${syncType}: ${error.message}`);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      <RefreshCw className={`${loading ? 'animate-spin' : ''} h-4 w-4 mr-2`} />
      {loading ? 'Syncing...' : `Sync ${syncType}`}
    </Button>
  );
};

export default PetpoojaSyncButton;
