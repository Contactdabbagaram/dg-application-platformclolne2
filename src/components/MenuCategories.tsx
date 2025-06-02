
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useMenuCategories } from '@/hooks/useMenu';

interface MenuCategoriesProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string, imageUrl: string) => void;
  restaurantId?: string;
}

const MenuCategories = ({ selectedCategory, onCategorySelect, restaurantId }: MenuCategoriesProps) => {
  const { data: categories, isLoading, error } = useMenuCategories(restaurantId);

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to load categories. Please try again.
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        className="rounded-full whitespace-nowrap flex-shrink-0"
        onClick={() => onCategorySelect('', '')}
      >
        All Items
      </Button>
      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className="rounded-full whitespace-nowrap flex-shrink-0"
          onClick={() => onCategorySelect(category.id, category.image_url)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default MenuCategories;
