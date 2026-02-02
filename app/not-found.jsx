import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found | Lifereach Church',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <img src="/imgs/pastor.png" alt="Lifereach Church Logo" className="mx-auto mb-4 w-20 h-20 rounded-full shadow-lg object-cover" />
        <div className="text-9xl font-black text-orange-600 mb-4">404</div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>

        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Go Home
          </Link>

          <Link
            href="/sermons"
            className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
}
