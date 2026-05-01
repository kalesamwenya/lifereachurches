"use client";
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { 
  Bell, Calendar, Mic, BookOpen, Clock, ChevronRight, MapPin, 
  ExternalLink, PlayCircle, ArrowRight, ChevronLeft, Send, 
  ArrowLeft, Share2, Bookmark
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_BASE_URL = 'https://content.lifereachchurch.org/';

// --- Skeletons (Keeping your existing ones) ---
const PostReaderSkeleton = () => (
  <article className="animate-pulse bg-white">
    
    {/* Hero */}
    <div className="relative h-[50vh] w-full bg-slate-200" />

    <main className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left Content */}
        <div className="flex-1 space-y-8">
          
          {/* Author Row */}
          <div className="flex items-center justify-between pb-8 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-slate-200 rounded-full" />
              <div className="w-10 h-10 bg-slate-200 rounded-full" />
            </div>
          </div>

          {/* Paragraphs */}
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-4 w-full bg-slate-200 rounded" />
            ))}
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[400px] space-y-12">
          <div className="h-64 bg-slate-200 rounded-[40px]" />
          <div className="h-64 bg-slate-100 rounded-[40px]" />
        </aside>

      </div>
    </main>
  </article>
);

// --- Sub-Component: Reading View ---
export function PostReader({ post, onBack, relatedPosts, onOpenRelated, onShare, onToggleBookmark, isBookmarked, sidebarData }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]);

  if (!post) return null;

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 w-full pb-12">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-white font-bold mb-6 hover:gap-3 transition-all bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 w-fit"
            >
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
                <button onClick={() => onShare(post)} className="p-3 rounded-full hover:bg-slate-50 border border-slate-100 text-slate-400 hover:text-brand-600 transition-all"><Share2 className="w-5 h-5" /></button>
                <button onClick={() => onToggleBookmark(post)} className="p-3 rounded-full hover:bg-slate-50 border border-slate-100 transition-all">
                  <Bookmark className={`w-5 h-5 transition-all ${isBookmarked(post.id) ? "text-brand-600 fill-brand-600" : "text-slate-400"}`} />
                </button>
              </div>
            </div>

            <div className="prose prose-lg prose-slate max-w-none">
              {post.content?.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index} className="text-slate-600 text-lg leading-relaxed mb-6">{paragraph.trim()}</p>
              ))}
            </div>
          </div>

          <aside className="w-full lg:w-[400px] space-y-12">
            {relatedPosts.length > 0 && (
              <section className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl">
                <h3 className="font-black text-xl mb-8">More from Billboard</h3>
                <div className="space-y-10">
                  {relatedPosts.map(rp => (
                    <div key={rp.id} onClick={() => onOpenRelated(rp.id)} className="group cursor-pointer">
                      <div className="h-32 w-full rounded-2xl overflow-hidden mb-4 shadow-lg">
                        <img src={rp.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt="" />
                      </div>
                      <h4 className="font-bold text-sm leading-snug group-hover:text-brand-400 transition-colors">{rp.title}</h4>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <SidebarSections sidebarData={sidebarData} />
          </aside>
        </div>
      </main>
    </article>
  );
}

// --- Sub-Component: Persistent Sidebar Sections ---
function SidebarSections({ sidebarData }) {
  return (
    <>
      <section className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
        <h3 className="font-black text-xl mb-8 flex items-center gap-2"><BookOpen className="w-5 h-5 text-brand-600"/> Blog Feed</h3>
        <div className="space-y-6">
          {sidebarData.blogs.map(blog => (
            <div key={blog.id} className="group cursor-pointer border-b border-slate-200/50 pb-4 last:border-0 last:pb-0">
              <h4 className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors leading-snug">{blog.title}</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{blog.author} • {blog.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden">
        <Calendar className="absolute -right-4 -top-4 w-24 h-24 text-white/5 -rotate-12" />
        <h3 className="font-black text-xl mb-8 relative z-10">Upcoming Events</h3>
        <div className="space-y-6 relative z-10">
          {sidebarData.events.map(event => (
            <div key={event.id} className="flex gap-4 items-start group cursor-pointer">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-brand-600 transition-colors">
                <Calendar className="w-5 h-5"/>
              </div>
              <div>
                <h4 className="font-bold text-sm">{event.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{event.time} • {event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// --- Main Page Component ---
export default function BillboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillboardContent />
    </Suspense>
  );
}

function BillboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get('post'); 

  const [bookmarks, setBookmarks] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [billboardUpdates, setBillboardUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  const url = `${window.location.origin}/billboard?post=${p.id}`;

  const sidebarData = {
    blogs: [{ id: 1, title: 'The Power of Prayer', author: 'Pastor Sarah', date: '3 days ago' }],
    events: [{ id: 1, title: 'Bible Study', time: 'Tue, 6:00 PM', location: 'Room 302' }],
    podcasts: [{ id: 1, title: 'Episode 45', duration: '24 min' }]
  };

  const loadContent = useCallback(async () => {
  setLoading(true);

  try {
    const res = await fetch(`${API_BASE_URL}/billboard/get_posts.php`);
    const result = await res.json();

    if (!result.success) throw new Error("Failed to load posts");

    const posts = result.data.map(post => ({
      ...post,
      image: post.image_url || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=1000'
    }));

    // STORE ALL POSTS (IMPORTANT FIX)
    setBillboardUpdates(posts);

    if (postId) {
      const found = posts.find(p => String(p.id) === String(postId));
      setSelectedPost(found || null);

      if (found) {
        const relRes = await fetch(
          `${API_BASE_URL}/billboard/get_related_posts.php?id=${postId}&limit=2`
        );
        const relResult = await relRes.json();

        if (relResult.success) {
          setRelatedPosts(
            relResult.data.map(p => ({
              ...p,
              image:
                p.image_url ||
                'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=500'
            }))
          );
        }
      }
    } else {
      setSelectedPost(null);
      setRelatedPosts([]);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [postId]);

useEffect(() => {
  loadContent();
}, [loadContent]);


useEffect(() => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("billboard_bookmarks");
      setBookmarks(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setBookmarks([]);
    }
  }
}, []);

  const toggleBookmark = (post) => {
    const updated = bookmarks.some(p => p.id === post.id) ? bookmarks.filter(p => p.id !== post.id) : [...bookmarks, post];
    setBookmarks(updated);
    localStorage.setItem("billboard_bookmarks", JSON.stringify(updated));
  };

  return (
    // THE KEY PROP FORCES REFRESH ON ID CHANGE
    <div key={postId || 'root'} className={`w-full bg-white text-slate-900 font-sans transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
      {postId && loading ? (
  <PostReaderSkeleton />
) : selectedPost ? (
        <PostReader 
          post={selectedPost} 
          onBack={() => router.push('/billboard')}
          relatedPosts={relatedPosts}
          onOpenRelated={(id) => router.push(`/billboard?post=${id}`)}
  onShare={async (p) => {
  const url = getShareUrl(p.id);

  if (navigator.share) {
    await navigator.share({
      title: p.title,
      text: p.description,
      url
    });
  } else {
    await navigator.clipboard.writeText(url);
  }
}}
          onToggleBookmark={toggleBookmark}
          isBookmarked={(id) => bookmarks.some(p => p.id === id)}
          sidebarData={sidebarData}
        />
      ) : (
        <div className="animate-in fade-in duration-700">
          <section className="relative h-[40vh] flex items-center justify-center bg-slate-900">
            <h1 className="text-6xl font-black text-white">The <span className="text-brand-400">Billboard</span></h1>
          </section>

          <main className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="flex-1 space-y-12">
                {loading ? (
                  <><SkeletonCard /><SkeletonCard /></>
                ) : (
                  billboardUpdates.map((post) => (
                    <article 
                      key={post.id} 
                      className="group cursor-pointer" 
                      onClick={() => router.push(`/billboard?post=${post.id}`)}
                    >
                      <div className="h-80 w-full rounded-3xl overflow-hidden mb-6 shadow-md">
                        <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="" />
                      </div>
                      <h2 className="text-3xl font-black group-hover:text-brand-600 transition-colors">{post.title}</h2>
                      <p className="text-slate-500 mt-4 line-clamp-2">{post.description}</p>
                    </article>
                  ))
                )}
              </div>
              <aside className="w-full lg:w-[400px] space-y-12">
                {loading ? <SkeletonSidebar /> : <SidebarSections sidebarData={sidebarData} />}
              </aside>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}