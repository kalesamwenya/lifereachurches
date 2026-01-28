import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white pt-32 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Skeleton */}
        <div className="mb-16 animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto" />
          <div className="h-12 w-3/4 bg-gray-200 rounded mb-4 mx-auto" />
          <div className="h-6 w-1/2 bg-gray-200 rounded mx-auto" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-2xl mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>

        {/* Loading Indicator */}
        <div className="text-center py-12">
          <Loader2 size={48} className="mx-auto text-orange-600 animate-spin" />
        </div>
      </div>
    </div>
  );
}
