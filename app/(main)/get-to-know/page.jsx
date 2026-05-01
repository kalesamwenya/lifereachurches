"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Search, Plus, MessageCircle, Heart, Users, ChevronDown, 
  Send, X, CheckCircle2, BookOpen, Clock, ArrowRight, 
  Sparkles, ShieldCheck, MapPin
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

// --- SKELETON COMPONENTS ---

const ResourceSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-3 p-3">
        <div className="w-10 h-12 bg-gray-100 animate-pulse rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 bg-gray-100 animate-pulse rounded" />
          <div className="h-2 w-1/2 bg-gray-50 animate-pulse rounded" />
        </div>
      </div>
    ))}
  </div>
);

const FAQSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="p-6 border border-slate-50 rounded-xl flex justify-between items-center bg-white">
        <div className="h-4 w-2/3 bg-slate-100 animate-pulse rounded" />
        <div className="h-6 w-6 bg-slate-50 animate-pulse rounded-full" />
      </div>
    ))}
  </div>
);

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', question: '' });
  const [faqs, setFaqs] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [resources, setResources] = useState([]);
  
  // Loading states
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  const API_BASE = "https://content.lifereachchurch.org/";

  useEffect(() => {
    fetchFaqs();
    fetchDiscussions();
    fetchResources();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${API_BASE}/inquiries/faqs.php`);
      const data = await res.json();
      if (data.ok) setFaqs(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFaqs(false);
    }
  };

  const fetchResources = () => {
    axios.get(`${API_BASE}/library/list.php`, {
      params: { pageSize: 4, sort: 'created_at-desc' }
    })
    .then(res => setResources(res.data.rows || []))
    .catch(err => console.error("Widget Error:", err))
    .finally(() => setLoadingResources(false));
  };

  const fetchDiscussions = async () => {
    try {
      const res = await fetch(`${API_BASE}/inquiries/discussions.php`);
      const data = await res.json();
      if (data.ok) setDiscussions(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, faqs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/inquiries/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, category: "General" })
      });
      const data = await res.json();
      if (data.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSubmitted(false);
          setFormData({ name: '', email: '', question: '' });
        }, 2500);
      } else {
        alert("Failed to send message");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Hero Section */}
      <section className="relative bg-brand-800 py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-500 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 mb-8 text-xs font-bold uppercase tracking-widest text-brand-300 bg-brand-900/40 rounded-full border border-brand-500/30">
            <Sparkles size={14} />
            <span>Open Hearts, Open Minds</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
            Seek. Ask. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-300">Grow.</span>
          </h1>
          <p className="text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
            Whether you're a lifelong member or just curious about faith, this is your space to find clarity, connection, and community.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black" size={22} />
            <input
              type="text"
              placeholder="Search guides, FAQs, or discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Connectivity Hub */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-6 items-center justify-around">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-600">Pastors Online Now</span>
              </div>
              <div className="h-4 w-px bg-brand-200 hidden md:block"></div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Clock size={16} />
                <span>Avg. response: 2 hours</span>
              </div>
              <div className="h-4 w-px bg-brand-200 hidden md:block"></div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <ShieldCheck size={16} className="text-blue-500" />
                <span>Confidential Support</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Knowledge Base</h2>
                  <p className="text-slate-500">Find quick answers to common inquiries.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="hidden md:flex items-center space-x-2 bg-indigo-50 text-brand-700 px-4 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                >
                  <Plus size={18} />
                  <span>Ask Something Else</span>
                </button>
              </div>

              {loadingFaqs ? (
                <FAQSkeleton />
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div 
                      key={faq.id} 
                      className={`group transition-all duration-300 ${
                        expandedId === faq.id ? 'bg-brand-50 rounded-2xl' : 'hover:bg-brand-50/50 rounded-xl'
                      }`}
                    >
                      <button 
                        onClick={() => toggleExpand(faq.id)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                      >
                        <span className={`font-semibold text-lg transition-colors ${expandedId === faq.id ? 'text-brand-600' : 'text-slate-700'}`}>
                          {faq.question}
                        </span>
                        <div className={`p-1 rounded-full transition-all ${expandedId === faq.id ? 'bg-brand-600 text-white' : 'text-slate-400 bg-brand-100'}`}>
                          <ChevronDown size={18} className={`transition-transform ${expandedId === faq.id ? 'rotate-180' : ''}`} />
                        </div>
                      </button>
                      {expandedId === faq.id && (
                        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                          <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-8 text-white shadow-xl shadow-brand-200">
              <h3 className="text-2xl font-bold mb-4">Can't find it?</h3>
              <p className="text-indigo-100 mb-8 leading-relaxed">
                Our ministry team is here to listen and guide you through any questions.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 bg-white text-brand-600 font-bold rounded-2xl hover:bg-brand-50 transition-all flex items-center justify-center space-x-2"
              >
                <span>Ask a Question</span>
                <Send size={18} />
              </button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 mb-6 flex items-center space-x-2 uppercase italic tracking-tighter text-lg">
                <BookOpen size={20} className="text-orange-600" />
                <span>Growth Resources</span>
              </h3>

              {loadingResources ? (
                <ResourceSkeleton />
              ) : (
                <div className="space-y-3">
                  {resources.map((book) => (
                    <motion.a
                      key={book.id}
                      href={`/library/${book.id}`}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-orange-50/50 group transition-all border border-transparent hover:border-orange-100"
                    >
                      <div className="w-12 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-white">
                        <img src={`${API_BASE}/${book.cover_url || book.image}`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 text-sm font-black uppercase tracking-tight line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-gray-400 text-[10px] leading-tight line-clamp-2 mt-1 font-medium">
                          {book.description || 'Access this ministry resource online.'}
                        </p>
                      </div>
                      <ArrowRight size={14} className="self-center text-gray-300 group-hover:text-orange-600 transition-colors" />
                    </motion.a>
                  ))}
                  {resources.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No resources available.</p>}
                </div>
              )}

              <button 
                onClick={() => window.location.href = '/library'}
                className="w-full mt-6 py-3 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors"
              >
                View Full Library
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="w-full h-32 bg-slate-200 rounded-2xl mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i13!2i4955!3i3126!2m3!1e0!2sm!3i607147311!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!5f2')] bg-cover opacity-30 grayscale" />
                <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-600 animate-bounce" size={32} />
              </div>
              <h4 className="font-black uppercase italic tracking-tighter text-slate-900">Visit Us in Person</h4>
              <p className="text-sm text-slate-500 mb-4 font-medium">Lusaka, Zambia</p>
              <a href="https://share.google/hF32KpsevD3W66E4R" target="_blank" rel="noopener noreferrer" className="block w-full">
                <button className="w-full py-2.5 text-orange-600 border border-orange-100 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-50 transition-colors">
                  Get Directions
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal remains unchanged as per your original file */}
      {isModalOpen && (
        // ... (Your existing Modal JSX)
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
  <div
    className="absolute inset-0 bg-brand-950/80 backdrop-blur-md"
    onClick={() => !isSubmitted && setIsModalOpen(false)}
  ></div>

  <div className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
    
    {isSubmitted ? (
      <div className="p-16 text-center">
        <CheckCircle2 className="mx-auto text-brand-600 mb-8" size={48} />
        <h3 className="text-3xl font-black text-slate-900 mb-4">
          You're Heard!
        </h3>
      </div>
    ) : (
      <div className="flex flex-col md:flex-row min-h-[500px]">
        
        {/* 🔥 BIGGER SIDEBAR */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-brand-700 to-brand-600 text-white p-10 flex-col justify-between">
          
          <div>
            <h3 className="text-3xl font-black mb-4 leading-tight">
              Let’s Talk
            </h3>
            <p className="text-brand-100 text-sm leading-relaxed">
              Whether you have a question, need prayer, or just want guidance —
              our team is here for you. You're not alone on this journey.
            </p>
          </div>

          <div className="space-y-4 text-sm text-brand-100">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Response within 24–48 hrs</span>
            </div>
          </div>
        </div>

        {/* FORM SIDE */}
        <div className="flex-1">
          <div className="p-6 flex justify-end">
            <button onClick={() => setIsModalOpen(false)}>
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
            <input
              required
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              required
              type="email"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <textarea
              required
              rows="4"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50"
              placeholder="How can we help?"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
            />

            <button
              type="submit"
              className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
</div>
      )}
    </div>
  );
}