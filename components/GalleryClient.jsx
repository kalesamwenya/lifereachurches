'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Calendar, X, ChevronLeft, ChevronRight,
  Download, Share2, Link as LinkIcon, Facebook, Check, ArrowLeft, Camera, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'https://content.lifereachchurch.org';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}/${path}`;
};

export default function GalleryClient({ gallery, id }) {
  const router = useRouter();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [likedImages, setLikedImages] = useState([]);

  // ✅ Load likes
  useEffect(() => {
    const savedLikes = localStorage.getItem(`reach_likes_${id}`);
    if (savedLikes) setLikedImages(JSON.parse(savedLikes));
  }, [id]);

  const toggleLike = (imgId) => {
    const newLikes = likedImages.includes(imgId)
      ? likedImages.filter(i => i !== imgId)
      : [...likedImages, imgId];

    setLikedImages(newLikes);
    localStorage.setItem(`reach_likes_${id}`, JSON.stringify(newLikes));
  };

  const handleDownload = (imagePath) => {
    const downloadUrl = `${API_URL}/gallery/download.php?file=${encodeURIComponent(imagePath)}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setCurrentImageIndex(prev => (prev + 1) % gallery.images.length);
      if (e.key === 'ArrowLeft') setCurrentImageIndex(prev => (prev - 1 + gallery.images.length) % gallery.images.length);
    };

    document.body.style.overflow = lightboxOpen ? 'hidden' : 'unset';
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, gallery]);

  if (!gallery) {
    return <div className="p-10 text-center">Gallery not found</div>;
  }

  const coverImage = gallery.featured_image_url || gallery.images?.[0]?.image_url;

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100">

      {/* HERO */}
      <section className="relative h-[75vh] w-full overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img src={getImageUrl(coverImage)} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          <button onClick={() => router.back()} className="text-white mb-6 flex items-center gap-2">
            <ArrowLeft size={16} /> Back
          </button>

          <h1 className="text-5xl font-black text-white">{gallery.title}</h1>
          <p className="text-white/80 mt-4">{gallery.description}</p>

          <button
            onClick={() => setShowShareMenu(true)}
            className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-full"
          >
            Share
          </button>
        </div>
      </section>

      {/* GALLERY */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {gallery.images.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => { setCurrentImageIndex(idx); setLightboxOpen(true); }}
              className="cursor-pointer overflow-hidden rounded-xl"
            >
              <img src={getImageUrl(img.image_url)} className="w-full" />
            </div>
          ))}
        </div>
      </main>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <img
              src={getImageUrl(gallery.images[currentImageIndex].image_url)}
              className="max-h-[80vh]"
            />

            <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 text-white">
              <X />
            </button>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}