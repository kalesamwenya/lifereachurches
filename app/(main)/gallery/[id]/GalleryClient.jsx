"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  X, ChevronLeft, ChevronRight,
  Download, Share2, Link as LinkIcon,
  Facebook, Check, ArrowLeft, Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://content.lifereachchurch.org";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_URL}/${path}`;
};

export default function GalleryClient({ initialGallery }) {
  const router = useRouter();

  const [gallery] = useState(initialGallery);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [likedImages, setLikedImages] = useState([]);

  // Load Likes
  useEffect(() => {
    if (gallery?.id) {
      const savedLikes = localStorage.getItem(`reach_likes_${gallery.id}`);
      if (savedLikes) setLikedImages(JSON.parse(savedLikes));
    }
  }, [gallery]);

  const toggleLike = (e, imgId) => {
    e.stopPropagation(); // Prevent opening lightbox when clicking heart
    const newLikes = likedImages.includes(imgId)
      ? likedImages.filter(i => i !== imgId)
      : [...likedImages, imgId];

    setLikedImages(newLikes);
    localStorage.setItem(`reach_likes_${gallery.id}`, JSON.stringify(newLikes));
  };

  const handleDownload = (e, imagePath) => {
    e.stopPropagation();
    const url = `${API_URL}/gallery/download.php?file=${encodeURIComponent(imagePath)}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.images.length);
  }, [gallery?.images?.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.images.length) % gallery.images.length);
  }, [gallery?.images?.length]);

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Gallery not found</p>
      </div>
    );
  }

  const coverImage = gallery.featured_image_url || gallery.images?.[0]?.image_url;

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative h-[60vh] flex items-end">
        <img
          src={getImageUrl(coverImage)}
          className="absolute inset-0 w-full h-full object-cover"
          alt={gallery.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 p-8 md:p-16 text-white max-w-4xl">
          <button 
            onClick={() => router.back()} 
            className="mb-6 flex items-center gap-2 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h1 className="text-4xl md:text-6xl font-bold">{gallery.title}</h1>
          {gallery.description && <p className="mt-4 text-white/80 text-lg">{gallery.description}</p>}

          <button
            onClick={() => setShowShareMenu(true)}
            className="mt-6 bg-orange-500 hover:bg-orange-600 transition-colors px-6 py-3 rounded-full flex gap-2 items-center font-medium"
          >
            <Share2 size={18} /> Share Gallery
          </button>
        </div>
      </section>

      {/* GRID */}
      <main className="p-6 columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-[1600px] mx-auto">
        {gallery.images?.map((img, idx) => (
          <div
            key={img.id}
            className="group relative mb-6 cursor-pointer overflow-hidden rounded-xl bg-gray-100"
            onClick={() => {
              setCurrentImageIndex(idx);
              setLightboxOpen(true);
            }}
          >
            <img
              src={getImageUrl(img.image_url)}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              alt=""
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end p-4 items-start gap-2">
              <button 
                onClick={(e) => toggleLike(e, img.id)}
                className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-900"
              >
                <Heart size={18} className={likedImages.includes(img.id) ? "fill-red-500 text-red-500" : ""} />
              </button>
              <button 
                onClick={(e) => handleDownload(e, img.image_url)}
                className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-900"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-4"
          >
            <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 text-white/70 hover:text-white z-[110]">
              <X size={32} />
            </button>

            {/* Navigation */}
            <button onClick={prevImage} className="absolute left-4 text-white/50 hover:text-white transition-colors z-[110]">
              <ChevronLeft size={48} />
            </button>
            <button onClick={nextImage} className="absolute right-4 text-white/50 hover:text-white transition-colors z-[110]">
              <ChevronRight size={48} />
            </button>

            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={getImageUrl(gallery.images[currentImageIndex].image_url)}
              className="max-h-full max-w-full object-contain"
            />
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {currentImageIndex + 1} / {gallery.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHARE MODAL */}
      <AnimatePresence>
        {showShareMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center p-4"
            onClick={() => setShowShareMenu(false)}
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-6">Share this Gallery</h3>
              
              <div className="grid gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  className="flex items-center justify-center gap-3 w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {linkCopied ? <Check className="text-green-500" /> : <LinkIcon size={18} />}
                  <span className="font-medium">{linkCopied ? "Link Copied!" : "Copy Link"}</span>
                </button>

                <button
                  onClick={() =>
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
                  }
                  className="flex items-center justify-center gap-3 w-full bg-[#1877F2] text-white py-3 rounded-xl hover:bg-[#166fe5] transition-colors"
                >
                  <Facebook size={18} fill="currentColor" />
                  <span className="font-medium">Facebook</span>
                </button>
              </div>

              <button 
                onClick={() => setShowShareMenu(false)} 
                className="mt-6 text-gray-500 hover:text-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}