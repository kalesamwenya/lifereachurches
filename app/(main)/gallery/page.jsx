'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Calendar, Image as ImageIcon, Search, SortAsc, ArrowRight, Camera } from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/lib/api-config';

// --- Sub-component: Gallery Card ---
const GalleryCard = ({ gallery }) => (
  <Link
    href={`/gallery/${gallery.id}`}
    className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
  >
    {/* Image Container */}
    <div className="relative aspect-[4/3] overflow-hidden">
      {gallery.featured_image_url ? (
        <img
          src={gallery.featured_image_url}
          alt={gallery.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <Camera size={40} className="text-gray-200" />
        </div>
      )}
      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
      
      {/* Date Badge */}
      {gallery.event_date && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-900 shadow-sm">
          {new Date(gallery.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
        {gallery.title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed flex-grow">
        {gallery.description || "No description available for this event."}
      </p>
      
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
        <span className="text-xs font-semibold text-orange-600 flex items-center gap-1">
          View Collection <ArrowRight size={14} />
        </span>
      </div>
    </div>
  </Link>
);

export default function GalleryListPage() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await axios.get(`${API_URL}/gallery/list.php?sort=${sortBy}`);
        setGalleries(response.data.rows || []);
      } catch (error) {
        console.error('Error fetching galleries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, [sortBy]);

  // Optimized Filtering
  const filteredGalleries = useMemo(() => {
    return galleries.filter(g => 
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, galleries]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase">Emit Photography</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 pt-[4rem]">
      {/* Hero Section */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            Our <span className="text-orange-600">Galleries</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg font-light">
            Capturing the spirit of our community through the lens of Emit Photography.
          </p>
        </div>
      </header>

      {/* Control Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by event or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <SortAsc size={18} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-sm focus:outline-none cursor-pointer text-gray-700"
            >
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {filteredGalleries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGalleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="inline-flex p-6 bg-gray-100 rounded-full mb-6">
              <ImageIcon className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold">No results found</h3>
            <p className="text-gray-500">Try searching for something else or browse all galleries.</p>
          </div>
        )}
      </main>
    </div>
  );
}
