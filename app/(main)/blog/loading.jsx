import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white pt-32 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Blog Title Skeleton */}
        <div className="mb-12 animate-pulse text-center">
          <div className="h-4 w-24 bg-orange-200 rounded mx-auto mb-3" />
          <div className="h-10 w-48 bg-gray-200 rounded mx-auto mb-4" />
          <div className="h-1.5 w-24 bg-orange-200 rounded mx-auto" />
        </div>

        {/* Blog Posts Skeleton */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border-b border-gray-200 pb-8">
              <div className="bg-gray-200 h-64 rounded-2xl mb-6" />
              <div className="h-8 bg-gray-200 rounded mb-3" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
              <div className="flex gap-3">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
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
