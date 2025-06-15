
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface RestaurantDropdownProps {
  value: string | null;
  onChange: (restaurantId: string) => void;
  disabled?: boolean;
}

interface RestaurantSummary {
  id: string;
  name: string;
}

const RestaurantDropdown = ({ value, onChange, disabled }: RestaurantDropdownProps) => {
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name')
        .order('name');

      if (!error && data) setRestaurants(data);
      setLoading(false);
    };
    fetchRestaurants();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Map to Restaurant</label>
      <Select
        value={value ?? undefined}
        onValueChange={onChange}
        disabled={disabled || loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Loading..." : "Select a restaurant"} />
        </SelectTrigger>
        <SelectContent>
          {restaurants.map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RestaurantDropdown;
