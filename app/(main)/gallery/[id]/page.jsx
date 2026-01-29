'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  Calendar, X, ChevronLeft, ChevronRight, 
  Download, Share2, Link as LinkIcon, Facebook, Check, ArrowLeft, Camera, Heart 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'https://content.lifereachchurch.org';

export default function GalleryPage() {
    const { id } = useParams();
    const router = useRouter();
    const [gallery, setGallery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    
    // State for liked images (persisted via localStorage)
    const [likedImages, setLikedImages] = useState([]);

    const fetchGallery = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/gallery/get_one.php?id=${id}`);
            if (response.data.success) {
                setGallery(response.data.gallery);
                // Load likes specific to this gallery ID
                const savedLikes = localStorage.getItem(`emit_likes_${id}`);
                if (savedLikes) setLikedImages(JSON.parse(savedLikes));
            } else {
                setError('Gallery not found');
            }
        } catch (err) {
            setError('Failed to load gallery');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchGallery(); }, [fetchGallery]);

    const toggleLike = (imgId) => {
        const newLikes = likedImages.includes(imgId)
            ? likedImages.filter(i => i !== imgId)
            : [...likedImages, imgId];
        
        setLikedImages(newLikes);
        localStorage.setItem(`emit_likes_${id}`, JSON.stringify(newLikes));
    };

    const handleDownload = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobURL = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobURL;
            link.download = `Emit_Photo_${id}_${currentImageIndex + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobURL);
        } catch (e) {
            window.open(url, '_blank');
        }
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

    // Update meta tags dynamically for SEO
    useEffect(() => {
        if (gallery) {
            const siteName = "IfeReach Church";
            const metaDescription = gallery.description || `View ${gallery.image_count || 0} beautiful photos from ${gallery.title}`;
            const coverImage = gallery.featured_image_url || gallery.images?.[0]?.image_url;
            const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
            
            document.title = `${gallery.title} | Photo Gallery | ${siteName}`;
            
            // Update or create meta tags
            const updateMeta = (property, content) => {
                let meta = document.querySelector(`meta[property="${property}"]`) || 
                          document.querySelector(`meta[name="${property}"]`);
                if (!meta) {
                    meta = document.createElement('meta');
                    if (property.startsWith('og:') || property.startsWith('twitter:')) {
                        meta.setAttribute('property', property);
                    } else {
                        meta.setAttribute('name', property);
                    }
                    document.head.appendChild(meta);
                }
                meta.setAttribute('content', content);
            };

            updateMeta('description', metaDescription);
            updateMeta('og:title', `${gallery.title} | ${siteName}`);
            updateMeta('og:description', metaDescription);
            updateMeta('og:image', coverImage);
            updateMeta('og:url', pageUrl);
            updateMeta('twitter:card', 'summary_large_image');
            updateMeta('twitter:title', `${gallery.title} | ${siteName}`);
            updateMeta('twitter:description', metaDescription);
            updateMeta('twitter:image', coverImage);
        }
    }, [gallery]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Emit Photography</p>
            </div>
        </div>
    );

    const coverImage = gallery?.featured_image_url || gallery?.images?.[0]?.image_url;

    return (
        <div className="min-h-screen bg-white selection:bg-orange-100">
            {/* 1. Cinematic Hero Section */}
            <section className="relative h-[75vh] w-full overflow-hidden flex items-end">
                <div className="absolute inset-0 z-0">
                    <img src={coverImage} alt={gallery?.title} className="w-full h-full object-cover scale-105 animate-slow-zoom" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back to Collection
                    </button>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                        <div className="flex items-center gap-3 text-orange-400 mb-4 font-bold tracking-wide uppercase text-xs">
                            <Calendar size={14} />
                            {new Date(gallery?.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            <span className="w-1 h-1 bg-white/30 rounded-full" />
                            <span>{gallery?.image_count || 0} Captures</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tighter italic">{gallery?.title}</h1>
                        <p className="text-xl text-white/80 leading-relaxed font-light max-w-2xl">{gallery?.description}</p>
                        <div className="mt-8">
                            <button onClick={() => setShowShareMenu(true)} className="px-8 py-4 bg-orange-500 text-white font-bold rounded-full flex items-center gap-2 hover:bg-orange-600 hover:scale-105 transition-all shadow-xl">
                                <Share2 size={18} /> Share Collection
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. Masonry Gallery Display */}
            <main className="max-w-7xl mx-auto px-6 py-24">
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                    {gallery?.images?.map((img, idx) => (
                        <motion.div 
                            key={img.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            onClick={() => { setCurrentImageIndex(idx); setLightboxOpen(true); }}
                            className="relative group cursor-zoom-in overflow-hidden rounded-3xl bg-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <img src={img.image_url} alt="" className="w-full h-auto transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                                <div className="flex justify-end">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleLike(img.id); }}
                                        className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all ${likedImages.includes(img.id) ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white hover:text-red-500'}`}
                                    >
                                        <Heart size={20} fill={likedImages.includes(img.id) ? "currentColor" : "none"} />
                                    </button>
                                </div>
                                <div className="flex justify-center">
                                    <div className="p-5 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20 scale-50 group-hover:scale-100 transition-transform duration-500">
                                        <Camera size={28} />
                                    </div>
                                </div>
                                <div className="h-10" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* 3. High-End Lightbox */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex flex-col">
                        <div className="p-6 flex justify-between items-center text-white z-10 bg-gradient-to-b from-black/80 to-transparent">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-orange-500">Emit Photography</span>
                                <span className="text-xs font-medium text-white/60">{currentImageIndex + 1} / {gallery.images.length}</span>
                            </div>
                            <div className="flex items-center gap-4 md:gap-8">
                                <button 
                                    onClick={() => toggleLike(gallery.images[currentImageIndex].id)}
                                    className={`flex items-center gap-2 transition-colors ${likedImages.includes(gallery.images[currentImageIndex].id) ? 'text-red-500' : 'text-white/80 hover:text-red-400'}`}
                                >
                                    <Heart size={24} fill={likedImages.includes(gallery.images[currentImageIndex].id) ? "currentColor" : "none"} />
                                    <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Like</span>
                                </button>
                                <button onClick={() => handleDownload(gallery.images[currentImageIndex].image_url)} className="flex items-center gap-2 text-white/80 hover:text-orange-500 transition-colors text-xs font-bold uppercase tracking-widest">
                                    <Download size={22} /> <span className="hidden sm:inline">Download</span>
                                </button>
                                <button onClick={() => setLightboxOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all hover:rotate-90">
                                    <X size={28} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-grow relative flex items-center justify-center p-4">
                            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + gallery.images.length) % gallery.images.length); }} className="absolute left-4 md:left-8 z-20 p-4 text-white/20 hover:text-orange-500 transition-all"><ChevronLeft size={60} strokeWidth={1} /></button>
                            <motion.img key={currentImageIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", damping: 25 }} src={gallery.images[currentImageIndex].image_url} className="max-w-full max-h-[75vh] object-contain shadow-2xl select-none" />
                            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % gallery.images.length); }} className="absolute right-4 md:right-8 z-20 p-4 text-white/20 hover:text-orange-500 transition-all"><ChevronRight size={60} strokeWidth={1} /></button>
                        </div>

                        <div className="p-8 bg-black/90">
                            <div className="flex justify-center gap-3 overflow-x-auto max-w-5xl mx-auto py-2 px-4 no-scrollbar">
                                {gallery.images.map((img, idx) => (
                                    <button key={img.id} onClick={() => setCurrentImageIndex(idx)} className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${idx === currentImageIndex ? 'border-orange-500 scale-110' : 'border-transparent opacity-30 hover:opacity-100'}`}><img src={img.image_url} className="w-full h-full object-cover" alt="" /></button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share Menu */}
            <AnimatePresence>
                {showShareMenu && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md" onClick={() => setShowShareMenu(false)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl text-center" onClick={e => e.stopPropagation()}>
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"><Share2 size={32} /></div>
                            <h3 className="text-3xl font-black mb-2 italic">Share Gallery</h3>
                            <p className="text-gray-500 mb-8 text-sm">Let others experience the moments captured by Emit Photography.</p>
                            <div className="space-y-3">
                                <button onClick={() => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }} className="w-full py-4 bg-gray-50 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-50 transition-colors border border-gray-100">
                                    {linkCopied ? <Check className="text-green-600" size={20} /> : <LinkIcon size={20} />}
                                    <span className="font-bold text-sm">{linkCopied ? 'Link Copied!' : 'Copy Gallery Link'}</span>
                                </button>
                                <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)} className="w-full py-4 bg-[#1877F2] text-white rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
                                    <Facebook size={20} />
                                    <span className="font-bold text-sm">Share to Facebook</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slow-zoom { from { transform: scale(1); } to { transform: scale(1.15); } }
                .animate-slow-zoom { animation: slow-zoom 30s infinite alternate ease-in-out; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
}