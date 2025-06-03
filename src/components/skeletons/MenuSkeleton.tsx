
import { Skeleton } from '@/components/ui/skeleton';

const MenuSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="relative h-48 md:h-64">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Skeleton className="h-8 w-64 mb-2 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Skeleton */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Menu Items Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4">
              <Skeleton className="h-48 w-full rounded mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4 mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuSkeleton;
