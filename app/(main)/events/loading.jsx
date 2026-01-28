import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white pt-32 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Title Skeleton */}
        <div className="mb-12 animate-pulse text-center">
          <div className="h-4 w-24 bg-orange-200 rounded mx-auto mb-3" />
          <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-4" />
          <div className="h-1.5 w-24 bg-orange-200 rounded mx-auto" />
        </div>

        {/* Events Grid Skeleton */}
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-80 rounded-3xl mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>

        {/* Loading Spinner */}
        <div className="text-center py-12">
          <Loader2 size={48} className="mx-auto text-orange-600 animate-spin" />
        </div>
      </div>
    </div>
  );
}
