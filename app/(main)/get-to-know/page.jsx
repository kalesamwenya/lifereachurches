"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Search, Plus, MessageCircle, Heart, Users, ChevronDown, 
  Send, X, CheckCircle2, BookOpen, Clock, ArrowRight, 
  Sparkles, ShieldCheck, MapPin
} from 'lucide-react';

const FAQ_DATA = [
  {
    id: 1,
    category: "General",
    question: "What time do Sunday services start?",
    answer: "Our main Sunday services are held at 9:00 AM and 11:30 AM. We also have a mid-week prayer meeting on Wednesday evenings at 7:00 PM."
  },
  {
    id: 2,
    category: "Families",
    question: "Is there a program for children?",
    answer: "Yes! We have 'Kids Kingdom' for ages 3-12 during both Sunday services. Our nursery is also available for infants and toddlers."
  },
  {
    id: 3,
    category: "Membership",
    question: "How can I become a member of the church?",
    answer: "We hold a 'New Members Class' every first Sunday of the month. It's a great way to learn about our vision, values, and how you can get involved."
  },
  {
    id: 4,
    category: "Giving",
    question: "Where do my donations go?",
    answer: "Contributions support our local ministries, community outreach programs, and international missions. We provide annual reports for full transparency."
  },
  {
    id: 5,
    category: "Community",
    question: "Do you have small groups or Bible studies?",
    answer: "Absolutely. We have 'Life Groups' that meet in various homes throughout the week. You can find a group near you at the information desk."
  }
];



export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', question: '' });
  const [faqs, setFaqs] = useState([]);
  const [discussions, setDiscussions] = useState([]);



  const API_BASE = "https://content.lifereachchurch.org/";


  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API_BASE}/inquiries/create.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        question: formData.question,
        category: "General" // you can make this dynamic later
      })
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

    useEffect(() => {
  fetchFaqs();
}, []);

useEffect(() => {
  fetchDiscussions();
}, []);

const fetchFaqs = async () => {
  try {
    const res = await fetch(`${API_BASE}/inquiries/faqs.php`);
    const data = await res.json();

    if (data.ok) {
      setFaqs(data.data);
    }
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

const fetchDiscussions = async () => {
  try {
    const res = await fetch(`${API_BASE}/inquiries/discussions.php`);
    const data = await res.json();

    if (data.ok) {
      setDiscussions(data.data);
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Dynamic Hero Section */}
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
          
          {/* Left Column: FAQ & Interactions */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Stats/Status */}
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
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Discussion Feed Preview */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8" hidden>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Discussions</h2>
              <div className="space-y-4">
                {discussions.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-500 transition-colors">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-500">
  {topic.category || "General"}
</span>
                        <h4 className="font-bold text-slate-800">
  {topic.title}
</h4>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400 text-sm">
                      <Users size={14} />
                      <span>{topic.replies || 0} replies</span>
                      <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Resources */}
          <div className="lg:col-span-4 space-y-8">
            {/* Ask Card */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-8 text-white shadow-xl shadow-brand-200">
              <h3 className="text-2xl font-bold mb-4">Can't find it?</h3>
              <p className="text-indigo-100 mb-8 leading-relaxed">
                Our ministry team is here to listen and guide you through any questions about faith, life, or our church.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 bg-white text-brand-600 font-bold rounded-2xl hover:bg-brand-50 transition-all flex items-center justify-center space-x-2"
              >
                <span>Ask a Question</span>
                <Send size={18} />
              </button>
            </div>

            {/* Resources Widget */}
            <div className="bg-white rounded-3xl shadow-sm border border-brand-100 p-6">
              <h3 className="font-bold text-brand-900 mb-4 flex items-center space-x-2">
                <BookOpen size={18} className="text-brand-500" />
                <span>Growth Resources</span>
              </h3>
              <div className="space-y-3">
                {['Bible Study Guides', 'New Member Handbook', 'Prayer Journal PDF', 'Volunteering 101'].map((res, i) => (
                  <a key={i} href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group transition-colors">
                    <span className="text-slate-600 text-sm font-medium">{res}</span>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500" />
                  </a>
                ))}
              </div>
            </div>

            {/* Visit Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="w-full h-32 bg-slate-200 rounded-2xl mb-4 overflow-hidden relative">
                 <div className="absolute inset-0 bg-indigo-900/10 flex items-center justify-center italic text-slate-400 text-xs">Map Placeholder</div>
                 <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-500" size={32} />
              </div>
              <h4 className="font-bold text-slate-900">Visit Us in Person</h4>
              <p className="text-sm text-slate-500 mb-4">123 Grace Way, Springfield</p>
              <button className="w-full py-2.5 text-brand-600 border border-indigo-100 rounded-xl font-bold hover:bg-indigo-50 transition-colors text-sm">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ask Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-brand-950/80 backdrop-blur-md transition-opacity"
            onClick={() => !isSubmitted && setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden transform transition-all border border-white/20">
            {isSubmitted ? (
              <div className="p-16 text-center animate-in fade-in zoom-in duration-500">
                <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
                  <CheckCircle2 className="text-brand-600" size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">You're Heard!</h3>
                <p className="text-slate-500 text-lg">We've received your inquiry. One of our team members will respond within 24-48 hours.</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row">
                <div className="bg-brand-600 md:w-1/3 p-8 text-white hidden md:flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                      Your thoughts matter. We're honored to walk alongside you in your journey.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-indigo-200">
                    <ShieldCheck size={14} />
                    <span>Confidential & Secure</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="px-8 py-6 flex items-center justify-between md:justify-end">
                    <h3 className="text-xl font-bold text-slate-900 md:hidden">Ask a Question</h3>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Grace Hopper"
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="grace@example.com"
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">How can we help?</label>
                      <textarea
                        required
                        rows="4"
                        value={formData.question}
                        onChange={(e) => setFormData({...formData, question: e.target.value})}
                        placeholder="Type your question or prayer request here..."
                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-500 transition-all resize-none placeholder:text-slate-300"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-brand-700 transition-all flex items-center justify-center space-x-3 group"
                    >
                      <span>Send My Message</span>
                      <Send size={18} className="group-hover:translate-x-1 transition-transform" />
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