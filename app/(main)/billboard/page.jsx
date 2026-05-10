"use client";
import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { 
  Bell, Calendar, Mic, BookOpen, Clock, ChevronRight, PlayCircle, 
  ArrowRight, ChevronLeft, Send, ArrowLeft, Share2, Bookmark 
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

// Import your custom sidebar components
import PodcastSidebar from '@/components/PodcastSidebar';
import EventsSidebar from '@/components/EventsSidebar';
import RecentBlogs from '@/components/RecentBlogs';

const API_BASE_URL = 'https://content.lifereachchurch.org/';

// --- Skeletons ---
const SkeletonCard = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-96 w-full bg-slate-200 rounded-3xl" />
    <div className="max-w-3xl space-y-4">
      <div className="h-4 w-32 bg-slate-200 rounded-lg" />
      <div className="h-10 w-3/4 bg-slate-300 rounded-lg" />
      <div className="h-4 w-full bg-slate-200 rounded-lg" />
      <div className="h-6 w-40 bg-slate-300 rounded-lg" />
    </div>
  </div>
);

// --- Sub-Component: Post Reader View ---
function PostReader({ post, onBack, relatedPosts, onShare, onToggleBookmark, isBookmarked }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]);

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <button onClick={onBack} className="flex items-center gap-2 text-white font-bold mb-6 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 w-fit">
              <ArrowLeft className="w-5 h-5" /> Back to Billboard
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-brand-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">{post.type}</span>
              <span className="text-white/80 text-sm font-medium flex items-center gap-1"><Clock className="w-4 h-4" /> {post.date}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight max-w-4xl">{post.title}</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
               <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-brand-600">
                  {post?.author?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{post.author || 'Admin'}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Contributor</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onShare(post)} className="p-3 rounded-full border border-slate-100 text-slate-400 hover:text-brand-600 transition-all"><Share2 className="w-5 h-5" /></button>
                <button onClick={() => onToggleBookmark(post)} className="p-3 rounded-full border border-slate-100 transition-all">
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? "text-brand-600 fill-brand-600" : "text-slate-400"}`} />
                </button>
              </div>
            </div>
            <div className="prose prose-lg prose-slate max-w-none">
              <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</div>
            </div>
          </div>

          <aside className="w-full lg:w-[400px] space-y-12">
            {relatedPosts.length > 0 && (
              <section className="bg-slate-900 p-8 rounded-[40px] text-white">
                <h3 className="font-black text-xl mb-6">More from Billboard</h3>
                <div className="space-y-6">
                  {relatedPosts.map(rp => (
                    <div key={rp.id} onClick={() => onBack(rp.id)} className="group cursor-pointer flex items-center gap-4">
                       <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={rp.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                       </div>
                       <h4 className="font-bold text-sm leading-snug group-hover:text-brand-400">{rp.title}</h4>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <section className="p-8 border border-slate-100 rounded-[40px]">
               <h3 className="font-black text-xl mb-6">Listen to Sermon</h3>
               <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                 <PlayCircle className="w-10 h-10 text-brand-600" />
                 <div>
                   <p className="font-bold text-sm">Today's Reflection</p>
                   <p className="text-xs text-slate-400">12:45 min</p>
                 </div>
               </div>
            </section>
          </aside>
        </div>
      </main>
    </article>
  );
}

// --- Main Page ---
export default function BillboardPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold">Initializing Billboard...</div>}>
      <BillboardContent />
    </Suspense>
  );
}

function BillboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('post');

  const [billboardUpdates, setBillboardUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [isBlogsLoading, setIsBlogsLoading] = useState(false);

  const postsPerPage = 2;

  // --- Fetch Logic ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Billboard Posts
      const billRes = await fetch(`${API_BASE_URL}/billboard/get_posts.php`);
      const billData = await billRes.json();
      if (billData.success) {
        setBillboardUpdates(billData.data.map(p => ({
          ...p,
          category: (p.type || 'announcement').toLowerCase(),
          image: p.image_url || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1000'
        })));
      }

      // 2. Fetch Sidebar Blogs
      setIsBlogsLoading(true);
      const blogRes = await axios.get(`${API_BASE_URL}/blog/list.php?sortKey=publishedAt&sortDir=DESC`);
      setRecentBlogs(blogRes.data.rows?.slice(0, 3) || []);
      
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
      setIsBlogsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const saved = JSON.parse(localStorage.getItem("billboard_bookmarks") || "[]");
    setBookmarks(saved);
  }, [fetchData]);

  // Fetch Related Posts when a specific post is viewed
  useEffect(() => {
    if (postId) {
      const fetchRelated = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/billboard/get_related_posts.php?id=${postId}&limit=2`);
          const result = await res.json();
          if (result.success) {
            setRelatedPosts(result.data.map(p => ({
              ...p, image: p.image_url || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=500'
            })));
          }
        } catch (e) { setRelatedPosts([]); }
      };
      fetchRelated();
    }
  }, [postId]);

  // --- Computed Properties ---
  const selectedPost = useMemo(() => 
    billboardUpdates.find(p => String(p.id) === String(postId)), 
    [billboardUpdates, postId]
  );

  const categories = useMemo(() => 
    ['all', ...new Set(billboardUpdates.map(p => p.category))], 
    [billboardUpdates]
  );

  const filteredPosts = billboardUpdates.filter(p => activeTab === 'all' || p.category === activeTab);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  // --- Actions ---
  const sharePost = async (post) => {
    const url = `${window.location.origin}/billboard?post=${post.id}`;
    if (navigator.share) {
      await navigator.share({ title: post.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  const toggleBookmark = (post) => {
    const exists = bookmarks.some(p => p.id === post.id);
    const updated = exists ? bookmarks.filter(p => p.id !== post.id) : [...bookmarks, post];
    setBookmarks(updated);
    localStorage.setItem("billboard_bookmarks", JSON.stringify(updated));
  };

  return (
    <div className="w-full bg-white text-slate-900 font-sans">
      {selectedPost ? (
        <PostReader 
          post={selectedPost} 
          onBack={(newId) => router.push(newId ? `/billboard?post=${newId}` : '/billboard')}
          relatedPosts={relatedPosts}
          onShare={sharePost}
          onToggleBookmark={toggleBookmark}
          isBookmarked={bookmarks.some(p => p.id === selectedPost.id)}
        />
      ) : (
        <div className="animate-in fade-in duration-700">
          {/* Hero Section */}
          <section className="relative h-[45vh] flex items-center justify-center bg-slate-900 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1600" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
            <div className="relative z-10 text-center">
               <h1 className="text-5xl md:text-7xl font-black text-white mb-4">The <span className="text-brand-400">Billboard</span></h1>
               <p className="text-slate-300 text-lg">Your central hub for everything happening in our community.</p>
            </div>
          </section>

          <main className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-16">
              
              {/* Main Feed */}
              <div className="flex-1 space-y-12">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-6 overflow-x-auto">
                  {categories.map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => {setActiveTab(tab); setCurrentPage(1);}}
                      className={`px-5 py-2 text-sm font-bold rounded-xl capitalize whitespace-nowrap ${activeTab === tab ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-500'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="grid gap-12">
                  {loading ? [1, 2].map(i => <SkeletonCard key={i} />) : 
                    currentPosts.map(post => (
                    <article key={post.id} className="group cursor-pointer" onClick={() => router.push(`/billboard?post=${post.id}`)}>
                      <div className="relative h-96 w-full rounded-3xl overflow-hidden mb-6">
                        <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                        <span className="absolute top-6 left-6 px-4 py-2 bg-white/90 text-brand-600 text-xs font-black rounded-full uppercase">{post.type}</span>
                      </div>
                      <h2 className="text-3xl font-black group-hover:text-brand-600 transition-colors">{post.title}</h2>
                      <p className="text-slate-500 mt-4 line-clamp-2">{post.description}</p>
                      <div className="mt-6 flex items-center gap-2 font-bold text-brand-600">
                        Keep Reading <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 pt-12 border-t border-slate-100">
                    <button onClick={() => setCurrentPage(p => Math.max(p-1, 1))} disabled={currentPage === 1} className="p-2 border rounded-xl disabled:opacity-20"><ChevronLeft/></button>
                    <span className="px-4 py-2 font-bold">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} disabled={currentPage === totalPages} className="p-2 border rounded-xl disabled:opacity-20"><ChevronRight/></button>
                  </div>
                )}
              </div>

              {/* Persistent Sidebar */}
              <aside className="w-full lg:w-[400px] space-y-12">
                <section className="bg-slate-50 p-8 rounded-[40px]">
                  <h3 className="font-black text-xl mb-8 flex items-center gap-3"><BookOpen className="w-5 h-5 text-brand-600"/> Blog Feed</h3>
                  <RecentBlogs blogs={recentBlogs} loading={isBlogsLoading} />
                </section>

                <section className="bg-slate-900 p-8 rounded-[40px] text-white">
                  <h3 className="font-black text-xl mb-8 flex items-center gap-3"><Calendar className="w-5 h-5 text-brand-400"/> Upcoming Events</h3>
                  <EventsSidebar limit={3} />
                </section>

                <section className="p-8 border border-slate-100 rounded-[40px]">
                  <h3 className="font-black text-xl mb-8 flex items-center gap-3"><Mic className="w-5 h-5 text-brand-600"/> Podcasts</h3>
                  <PodcastSidebar limit={3} />
                </section>

                <section className="bg-brand-600 p-8 rounded-[40px] text-white">
                  <Bell className="w-8 h-8 mb-4" />
                  <h3 className="text-2xl font-black mb-2">Stay Updated</h3>
                  <p className="text-brand-100 text-sm mb-6">Join our community newsletter for weekly devotionals.</p>
                  <form onSubmit={e => e.preventDefault()} className="space-y-3">
                    <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none" />
                    <button className="w-full bg-white text-brand-600 font-bold py-3 rounded-xl">Subscribe</button>
                  </form>
                </section>
              </aside>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}