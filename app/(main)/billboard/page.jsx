"use client";
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Mic, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  MapPin, 
  ExternalLink,
  PlayCircle,
  ArrowRight,
  ChevronLeft,
  Send,
  ArrowLeft,
  Share2,
  Bookmark
} from 'lucide-react';

 const API_BASE_URL = 'https://content.lifereachchurch.org/'

export default function BillboardPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null); // Track the post being read
  const postsPerPage = 2;

 const [billboardUpdates, setBillboardUpdates] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [relatedPosts, setRelatedPosts] = useState([]);

useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("billboard_bookmarks") || "[]");
  setBookmarks(saved);
}, []);

const toggleBookmark = (post) => {
  const key = "billboard_bookmarks";
  const saved = JSON.parse(localStorage.getItem(key) || "[]");

  const exists = saved.some(p => p.id === post.id);

  let updated;

  if (exists) {
    updated = saved.filter(p => p.id !== post.id);
  } else {
    // store only safe fields (prevents broken rehydration later)
    updated = [
      ...saved,
      {
        id: post.id,
        title: post.title,
        image: post.image,
        description: post.description || "",
        content: post.content || "",
        author: post.author || "Admin",
        date: post.date || ""
      }
    ];
  }

  localStorage.setItem(key, JSON.stringify(updated));
  setBookmarks(updated);
};

const isBookmarked = (id) => {
  return bookmarks?.some(p => p.id === id);
};

const sharePost = async (post) => {
  if (!post) return;

  const shareData = {
    title: post.title,
    text: post.description || post.title,
    url: `${window.location.origin}/billboard?post=${post.id}`
  };

  try {
    // Modern mobile sharing
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    // Fallback: copy link
    await navigator.clipboard.writeText(shareData.url);

    alert("Link copied to clipboard!");
  } catch (err) {
    console.error("Share failed:", err);
  }
};

  const sidebarData = {
    blogs: [
      { id: 1, title: 'The Power of Prayer in Solitude', author: 'Pastor Sarah', date: '3 days ago' },
      { id: 2, title: 'Finding Grace in Difficult Seasons', author: 'Elder Mike', date: '1 week ago' }
    ],
    events: [
      { id: 1, title: 'Bible Study Group', time: 'Tue, 6:00 PM', location: 'Room 302' },
      { id: 2, title: 'Choir Rehearsal', time: 'Thu, 7:00 PM', location: 'Main Hall' }
    ],
    podcasts: [
      { id: 1, title: 'Episode 45: Walking by Faith', duration: '24 min' },
      { id: 2, title: 'Episode 44: The Modern Disciple', duration: '31 min' }
    ]
  };

  // Pagination Logic
  const filteredPosts = billboardUpdates.filter(item => activeTab === 'all' || item.category === activeTab);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

const openPost = async (post) => {
  setSelectedPost(post);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    const res = await fetch(
      `${API_BASE_URL}billboard/get_related_posts.php?id=${post.id}&limit=2`
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await res.json();

    if (result.success) {
      const formatted = result.data.map(p => ({
        id: p.id,
        title: p.title,
        image: p.image_url || '/placeholder.jpg'
      }));

      setRelatedPosts(formatted);
    }

  } catch (err) {
    console.error("❌ Related posts fetch failed:", err);

    // fallback so UI doesn't break
    setRelatedPosts([]);
  }
};
  const closePost = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
  fetchPosts();
}, []);

const fetchPosts = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API_BASE_URL}/billboard/get_posts.php`);
    const result = await res.json();

    if (!result.success) {
      throw new Error("API returned error");
    }

    // ✅ Correct: use result.data
   const formatted = result.data.map(post => ({
  id: post.id,
  title: post.title,
  description: post.description || '',
  content: post.content || '',
  
  type: post.type || 'announcement',
  category: (post.type || 'announcement').toLowerCase(),

  author: post.author || 'Admin',
  date: post.date || new Date(post.created_at).toLocaleDateString(),

  // ✅ direct use (correct way)
  image: post.image_url || '/placeholder.jpg'
}));
    setBillboardUpdates(formatted);

  } catch (err) {
    console.error(err);
    setError("Failed to load posts");
  } finally {
    setLoading(false);
  }
};

const shareToCommunity = async (post) => {
  if (!post) return;

  const shareUrl = `${window.location.origin}/billboard?post=${post.id}`;

  const message = `
📢 *${post.title}*

${post.description || ""}

Read more here:
${shareUrl}
  `.trim();

  try {
    // Option 1: Native share (best UX on mobile)
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: message,
        url: shareUrl
      });
      return;
    }

    // Option 2: Copy formatted message
    await navigator.clipboard.writeText(message);

    alert("📋 Post copied! You can paste it in WhatsApp, Facebook, or church groups.");
  } catch (err) {
    console.error("Community share failed:", err);
  }
};
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("post");

  if (postId && billboardUpdates.length > 0) {
    const found = billboardUpdates.find(p => p.id == postId);
    if (found) openPost(found);
  }
}, [billboardUpdates]);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500 font-bold">Loading billboard...</p>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 font-bold">{error}</p>
    </div>
  );
}

  return (
    <div className="w-full bg-white text-brand-900 font-sans">
      {/* Dynamic Content: Either Post Reader or Main Feed */}
      {selectedPost ? (
        /* Reading Page */
        <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Post Hero */}
          <div className="relative h-[50vh] w-full overflow-hidden">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-7xl mx-auto px-4 w-full pb-12">
                <button 
                  onClick={closePost}
                  className="flex items-center gap-2 text-white font-bold mb-6 hover:gap-3 transition-all bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 w-fit"
                >
                  <ArrowLeft className="w-5 h-5" /> Back to Billboard
                </button>
                <div className="flex items-center gap-3 mb-4">
                   <span className="px-3 py-1 bg-brand-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                    {selectedPost.type}
                  </span>
                  <span className="text-white/80 text-sm font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {selectedPost.date}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight max-w-4xl">
                  {selectedPost.title}
                </h1>
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-16">
              {/* Main Reading Area */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-brand-600">
                      {(selectedPost?.author || 'Admin').charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                            {selectedPost?.author || 'Admin'}
                      </p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Contributor</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
  onClick={() => sharePost(selectedPost)}
  className="p-3 rounded-full hover:bg-slate-50 border border-slate-100 text-slate-400 hover:text-brand-600 transition-all"
>
  <Share2 className="w-5 h-5" />
</button>
                   <button
  onClick={() => toggleBookmark(selectedPost)}
  className="p-3 rounded-full hover:bg-slate-50 border border-slate-100 transition-all"
>
  <Bookmark
  className={`w-5 h-5 transition-all ${
    isBookmarked(selectedPost?.id)
      ? "text-brand-600 fill-brand-600"
      : "text-slate-400"
  }`}
/>
</button>
                  </div>
                </div>

                <div className="prose prose-lg prose-slate max-w-none">
                  {selectedPost.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-slate-600 text-lg leading-relaxed mb-6">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                </div>

                <div className="mt-12 p-8 bg-slate-50 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="font-black text-xl mb-1">Was this helpful?</h4>
                    <p className="text-slate-500 text-sm">Share this update with your church family.</p>
                  </div>
                  <div className="flex gap-4">
                    <button
  onClick={() => shareToCommunity(selectedPost)}
  className="px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-brand-200 transition-all active:scale-95"
>
  Share to Community
</button>
                  </div>
                </div>
              </div>

              {/* Sidebar in Read View */}
              <aside className="w-full lg:w-[400px] space-y-12">
                <section className="bg-slate-900 p-8 rounded-[40px] text-white">
                  <h3 className="font-black text-xl mb-6">More from Billboard</h3>
                  <div className="space-y-6">
                    {relatedPosts.map(post => (
                      <div key={post.id} onClick={() => openPost(post)} className="group cursor-pointer">
                         <div className="h-32 w-full rounded-2xl overflow-hidden mb-3">
                            <img src={post.image || '/placeholder.jpg'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         </div>
                         <h4 className="font-bold text-sm leading-snug group-hover:text-brand-400 transition-colors">{post.title}</h4>
                      </div>
                    ))}
                  </div>
                </section>
                {/* Re-use Podcast Section here for visual consistency */}
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
        /* Main Billboard Feed View */
        <div className="animate-in fade-in duration-700">
          {/* Hero Section */}
          <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1600" 
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              alt="Church Atmosphere"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-400 uppercase bg-brand-400/10 border border-brand-400/20 rounded-full">
                Church Life & News
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                The <span className="text-brand-400">Billboard</span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                Your central hub for everything happening in our community—from spiritual insights to local events.
              </p>
            </div>
          </section>

          <main className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-16">
              
              {/* Main Feed Content */}
              <div className="flex-1 space-y-12">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                  <div className="flex gap-2">
                    {['all', 'news', 'updates', 'events'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setCurrentPage(1);
                        }}
                        className={`px-5 py-2 text-sm font-bold rounded-xl capitalize transition-all ${
                          activeTab === tab 
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' 
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-12">
                  {currentPosts.map((post) => (
                    <article key={post.id} className="group relative">
                      <div className="relative h-96 w-full rounded-3xl overflow-hidden mb-6">
                        <img 
                          src={post.image || '/placeholder.jpg'} 
                          alt={post.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-2 bg-white/90 backdrop-blur text-brand-600 text-xs font-black rounded-full uppercase tracking-tighter shadow-xl">
                            {post.type}
                          </span>
                        </div>
                      </div>
                      <div className="max-w-3xl">
                        <div className="flex items-center gap-3 text-slate-400 text-sm mb-3">
                          <Clock className="w-4 h-4 text-brand-500" />
                          {post.date}
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-brand-600 transition-colors leading-tight">
                          {post.title}
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed mb-6">
                          {post.description}
                        </p>
                        <button 
                          onClick={() => openPost(post)}
                          className="inline-flex items-center gap-2 font-bold text-brand-600 group/btn"
                        >
                          Keep Reading <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-12 border-t border-slate-100">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                          currentPage === i + 1 
                          ? 'bg-brand-600 text-white shadow-md' 
                          : 'text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="w-full lg:w-[400px] space-y-12">
                
                {/* Blog Section */}
                <section className="bg-slate-50 p-8 rounded-[40px]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <BookOpen className="w-5 h-5 text-brand-600" />
                    </div>
                    <h3 className="font-black text-xl tracking-tight">Blog Feed</h3>
                  </div>
                  <div className="space-y-8">
                    {sidebarData.blogs.map(blog => (
                      <div key={blog.id} className="group cursor-pointer border-b border-slate-200/50 pb-6 last:border-0 last:pb-0">
                        <h4 className="font-bold text-lg text-slate-800 leading-snug group-hover:text-brand-600 transition-colors mb-2">
                          {blog.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <span>{blog.author}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span>{blog.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Upcoming Events */}
                <section className="relative overflow-hidden bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Calendar className="w-32 h-32 rotate-12" />
                  </div>
                  <h3 className="relative font-black text-2xl mb-8 tracking-tight flex items-center gap-2">
                    Upcoming <span className="text-brand-400">Events</span>
                  </h3>
                  <div className="relative space-y-8">
                    {sidebarData.events.map(event => (
                      <div key={event.id} className="flex gap-4 group cursor-pointer">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-brand-600 rounded-2xl group-hover:bg-white group-hover:text-brand-600 transition-colors">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{event.title}</h4>
                          <div className="flex flex-col text-sm text-slate-400 space-y-1">
                            <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-brand-400" /> {event.time}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-brand-400" /> {event.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Podcasts */}
                <section className="p-8 border border-slate-100 rounded-[40px]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-brand-50 rounded-xl">
                      <Mic className="w-5 h-5 text-brand-600" />
                    </div>
                    <h3 className="font-black text-xl tracking-tight">Podcasts</h3>
                  </div>
                  <div className="space-y-4">
                    {sidebarData.podcasts.map(podcast => (
                      <div key={podcast.id} className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all cursor-pointer group">
                        <div className="bg-slate-900 text-white p-3 rounded-xl group-hover:bg-brand-600 transition-colors">
                          <PlayCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{podcast.title}</h4>
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">{podcast.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Newsletter Subscription */}
                <section className="bg-brand-600 p-8 rounded-[40px] text-white relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                  <div className="relative z-10">
                    <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-3 leading-tight">Join Our Community</h3>
                    <p className="text-brand-100 mb-8 text-sm font-medium leading-relaxed">
                      Subscribe to receive weekly devotionals, event updates, and news straight to your inbox.
                    </p>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      <div className="relative">
                        <input 
                          type="email" 
                          placeholder="Your email address" 
                          className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm placeholder:text-brand-200 outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                      </div>
                      <button className="w-full bg-white text-brand-600 font-black py-4 rounded-2xl hover:bg-brand-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-900/20 active:scale-[0.98]">
                        Subscribe Now <Send className="w-4 h-4" />
                      </button>
                    </form>
                    <p className="mt-6 text-[10px] text-brand-200 text-center font-bold uppercase tracking-widest opacity-60">
                      Respecting your privacy. Unsubscribe anytime.
                    </p>
                  </div>
                </section>

              </aside>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};