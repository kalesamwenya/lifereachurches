"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, Calendar, Mic, BookOpen, Clock, ChevronRight, MapPin, 
  ExternalLink, PlayCircle, ArrowRight, ChevronLeft, Send, 
  ArrowLeft, Share2, Bookmark
} from 'lucide-react';
import Link from 'next/link';
import PodcastSidebar from '@/components/PodcastSidebar';
import axios from 'axios';
import EventsSidebar from '@/components/EventsSidebar';
import RecentBlogs from '@/components/RecentBlogs';
const API_BASE_URL = 'https://content.lifereachchurch.org/';

export default function BillboardPage() {
  
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [billboardUpdates, setBillboardUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  const [recentBlogs, setRecentBlogs] = useState([]);
const [isBlogsLoading, setIsBlogsLoading] = useState(false);

  
  const postsPerPage = 2;



const fetchRecentBlogs = useCallback(async () => {
  setIsBlogsLoading(true);
  try {
    // Note: Ensure 'axios' is imported at the top of your file
    const res = await axios.get(`https://content.lifereachchurch.org/blog/list.php?sortKey=publishedAt&sortDir=DESC`);
    // Take only the first 2 or 3 for the sidebar
    setRecentBlogs(res.data.rows?.slice(0, 3) || []);
  } catch (err) {
    console.error("Error fetching blogs:", err);
  } finally {
    setIsBlogsLoading(false);
  }
}, []);



  // --- 1. Data Fetching ---
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/billboard/get_posts.php`);
      const result = await res.json();
      if (!result.success) throw new Error("API returned error");

      const formatted = result.data.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description || '',
        content: post.content || '',
        type: post.type || 'announcement',
        category: (post.type || 'announcement').toLowerCase(),
        author: post.author || 'Admin',
        date: post.date || new Date(post.created_at).toLocaleDateString(),
        image: post.image_url || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=1000'
      }));
      setBillboardUpdates(formatted);
    } catch (err) {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
  fetchPosts(); // Existing billboard fetch
  fetchRecentBlogs(); // New blog fetch
  const saved = JSON.parse(localStorage.getItem("billboard_bookmarks") || "[]");
  setBookmarks(saved);
}, [fetchPosts, fetchRecentBlogs]);

  

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("post");

  if (!postId || billboardUpdates.length === 0) return;

  const found = billboardUpdates.find(p => String(p.id) === String(postId));
  if (found) {
    setSelectedPost(found);
    fetchRelated(found.id);
  }
}, [billboardUpdates]);


  const fetchRelated = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}billboard/get_related_posts.php?id=${id}&limit=2`);
      const result = await res.json();
      if (result.success) {
        setRelatedPosts(result.data.map(p => ({
          id: p.id, title: p.title, image: p.image_url || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=500'
        })));
      }
    } catch (err) { setRelatedPosts([]); }
  };

  const openPost = (post) => {
  setSelectedPost(post);
  fetchRelated(post.id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const closePost = () => {
  setSelectedPost(null);
};

  const toggleBookmark = (post) => {
    const key = "billboard_bookmarks";
    const exists = bookmarks.some(p => p.id === post.id);
    const updated = exists ? bookmarks.filter(p => p.id !== post.id) : [...bookmarks, post];
    localStorage.setItem(key, JSON.stringify(updated));
    setBookmarks(updated);
  };

  const sharePost = async (post) => {
    const shareData = { title: post.title, text: post.description, url: `${window.location.origin}/billboard?post=${post.id}` };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(shareData.url); alert("Link copied!"); }
    } catch (err) { console.error(err); }
  };

  // --- 3. Pagination ---
  const filteredPosts = billboardUpdates.filter(item => activeTab === 'all' || item.category === activeTab);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-brand-600 border-slate-200"></div>
    </div>
  );

  return (
    <div className="w-full bg-white text-slate-900 font-sans">
      {selectedPost ? (
        /* --- READING PAGE --- */
        <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative h-[50vh] w-full overflow-hidden">
            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-end pb-12">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <button onClick={closePost} className="flex items-center gap-2 text-white font-bold mb-6 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 w-fit">
                  <ArrowLeft className="w-5 h-5" /> Back to Billboard
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-brand-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">{selectedPost.type}</span>
                  <span className="text-white/80 text-sm font-medium flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedPost.date}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight max-w-4xl">{selectedPost.title}</h1>
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                  
                  <div className="flex gap-2">
                    <button onClick={() => sharePost(selectedPost)} className="p-3 rounded-full border border-slate-100 text-slate-400 hover:text-brand-600 transition-all"><Share2 className="w-5 h-5" /></button>
                    <button onClick={() => toggleBookmark(selectedPost)} className="p-3 rounded-full border border-slate-100 transition-all">
                      <Bookmark className={`w-5 h-5 ${bookmarks.some(p => p.id === selectedPost.id) ? "text-brand-600 fill-brand-600" : "text-slate-400"}`} />
                    </button>
                  </div>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">{selectedPost.content}</div>
                </div>
                <div className="mt-12 p-8 bg-slate-50 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="font-black text-xl mb-1">Was this helpful?</h4>
                    <p className="text-slate-500 text-sm">Share this update with your church family.</p>
                  </div>
                  <button onClick={() => sharePost(selectedPost)} className="px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all active:scale-95">Share to Community</button>
                </div>
              </div>

              {/* Sidebar in Read View */}
              <aside className="w-full lg:w-[400px] space-y-12">
                {relatedPosts.length > 0 && (
                  <section className="bg-slate-900 p-8 rounded-[40px] text-white">
                    <h3 className="font-black text-xl mb-6">More from Billboard</h3>
                    <div className="space-y-6">
                      {relatedPosts.map(post => (
                        <Link href={`/billboard/?post=${post.id}`} key={post.id} className="group cursor-pointer flex items-center gap-4">
                           <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                           </div>
                           <h4 className="font-bold text-sm leading-snug group-hover:text-brand-400 transition-colors">{post.title}</h4>
                        </Link>
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
      ) : (
        /* --- MAIN FEED VIEW --- */
        <div className="animate-in fade-in duration-700">
          <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
            <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1600" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Church Atmosphere" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-400 uppercase bg-brand-400/10 border border-brand-400/20 rounded-full">Church Life & News</span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">The <span className="text-brand-400">Billboard</span></h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">Your central hub for everything happening in our community.</p>
            </div>
          </section>

          <main className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="flex-1 space-y-12">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-6">
                  {['all', 'news', 'updates', 'events'].map((tab) => (
                    <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }} className={`px-5 py-2 text-sm font-bold rounded-xl capitalize transition-all ${activeTab === tab ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{tab}</button>
                  ))}
                </div>

                <div className="grid gap-12">
                  {currentPosts.map((post) => (
                    <article key={post.id} className="group relative">
                      <div className="relative h-96 w-full rounded-3xl overflow-hidden mb-6">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-2 bg-white/90 backdrop-blur text-brand-600 text-xs font-black rounded-full uppercase tracking-tighter shadow-xl">{post.type}</span>
                        </div>
                      </div>
                      <div className="max-w-3xl">
                        <div className="flex items-center gap-3 text-slate-400 text-sm mb-3"><Clock className="w-4 h-4 text-brand-500" /> {post.date}</div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-brand-600 transition-colors leading-tight">{post.title}</h2>
                        <p className="text-slate-500 text-lg leading-relaxed mb-6">{post.description}</p>
                        <Link
  href={`/billboard?post=${post.id}`}
  className="inline-flex items-center gap-2 font-bold text-brand-600 group/btn"
>
  Keep Reading <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
</Link>
                      </div>
                    </article>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-12 border-t border-slate-100">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-xl border border-slate-200 disabled:opacity-30"><ChevronLeft /></button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i+1} onClick={() => setCurrentPage(i+1)} className={`w-10 h-10 rounded-xl font-bold ${currentPage === i+1 ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500'}`}>{i+1}</button>
                    ))}
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-xl border border-slate-200 disabled:opacity-30"><ChevronRight /></button>
                  </div>
                )}
              </div>

              {/* FULL SIDEBAR RESTORED */}
              <aside className="w-full lg:w-[400px] space-y-12">
                <section className="bg-slate-50 p-8 rounded-[40px]">
  <div className="flex items-center gap-3 mb-8">
    <div className="p-2 bg-white rounded-xl shadow-sm">
      <BookOpen className="w-5 h-5 text-brand-600" />
    </div>
    <h3 className="font-black text-xl tracking-tight">Blog Feed</h3>
  </div>
  
  <RecentBlogs blogs={recentBlogs} loading={isBlogsLoading} />
</section>

                <section className="relative overflow-hidden bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><Calendar className="w-32 h-32 rotate-12" /></div>
                  <h3 className="relative font-black text-2xl mb-8 tracking-tight flex items-center gap-2">Upcoming <span className="text-brand-400">Events</span></h3>
                  <div className="relative space-y-8">
                    <EventsSidebar limit={3} />
                  </div>
                </section>

                <section className="p-8 border border-slate-100 rounded-[40px]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-brand-50 rounded-xl"><Mic className="w-5 h-5 text-brand-600" /></div>
                    <h3 className="font-black text-xl tracking-tight">Podcasts</h3>
                  </div>
                  <div className="space-y-4">
                   <PodcastSidebar limit={3}/>
                  </div>
                </section>

                <section className="bg-brand-600 p-8 rounded-[40px] text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6"><Bell className="w-6 h-6 text-white" /></div>
                    <h3 className="text-2xl font-black mb-3 leading-tight">Join Our Community</h3>
                    <p className="text-brand-100 mb-8 text-sm font-medium leading-relaxed">Subscribe for weekly devotionals and event updates.</p>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      <input type="email" placeholder="Your email address" className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm outline-none" />
                      <button className="w-full bg-white text-brand-600 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-50 transition-all">Subscribe Now <Send className="w-4 h-4" /></button>
                    </form>
                  </div>
                </section>
              </aside>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}