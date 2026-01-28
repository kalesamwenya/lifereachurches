"use client";
import React, { useState } from 'react';
import { PlayCircle, MessageSquare, Search, Filter, Calendar, User, Clock, CheckCircle, X } from 'lucide-react';

const sermonsData = [
  {
    id: 1,
    title: "The Warrior Within",
    date: "2026-01-21",
    speaker: "Prophet Gomezyo",
    duration: "45:32",
    thumbnail: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400",
    series: "Warrior Series",
    hasReview: true,
    reviewDate: "2026-01-22",
    rating: 5,
    notes: "Powerful message about spiritual warfare and standing firm in faith."
  },
  {
    id: 2,
    title: "Faith in the Fire",
    date: "2026-01-14",
    speaker: "Pastor John Banda",
    duration: "52:18",
    thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400",
    series: "Faith Series",
    hasReview: true,
    reviewDate: "2026-01-15",
    rating: 5,
    notes: "Inspiring teaching on maintaining faith during trials."
  },
  {
    id: 3,
    title: "Kingdom Principles",
    date: "2026-01-07",
    speaker: "Prophet Gomezyo",
    duration: "48:45",
    thumbnail: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400",
    series: "Kingdom Series",
    hasReview: false
  },
  {
    id: 4,
    title: "The Power of Worship",
    date: "2025-12-31",
    speaker: "Pastor Grace Mwale",
    duration: "39:22",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    series: "Worship Series",
    hasReview: true,
    reviewDate: "2026-01-01",
    rating: 4,
    notes: "Beautiful message on entering God's presence through worship."
  },
  {
    id: 5,
    title: "Walking in Purpose",
    date: "2025-12-24",
    speaker: "Prophet Gomezyo",
    duration: "55:10",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    series: "Purpose Series",
    hasReview: false
  }
];

export default function Sermons() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeries, setFilterSeries] = useState('all');
  const [filterReview, setFilterReview] = useState('all');
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, notes: '' });

  const series = ['all', ...new Set(sermonsData.map(s => s.series))];

  const filteredSermons = sermonsData.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeries = filterSeries === 'all' || sermon.series === filterSeries;
    const matchesReview = filterReview === 'all' ||
                         (filterReview === 'reviewed' && sermon.hasReview) ||
                         (filterReview === 'pending' && !sermon.hasReview);
    return matchesSearch && matchesSeries && matchesReview;
  });

  const stats = {
    total: sermonsData.length,
    reviewed: sermonsData.filter(s => s.hasReview).length,
    pending: sermonsData.filter(s => !s.hasReview).length
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    alert(`Review submitted for "${selectedSermon.title}"!`);
    setShowReviewModal(false);
    setReviewForm({ rating: 5, notes: '' });
  };

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div>
        <h1 className="text-3xl font-black uppercase mb-6">Sermon Reviews</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-6 rounded-3xl text-center">
            <PlayCircle size={24} className="text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
            <p className="text-xs font-bold uppercase text-gray-500">Total Sermons</p>
          </div>
          <div className="bg-green-50 p-6 rounded-3xl text-center">
            <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-900">{stats.reviewed}</p>
            <p className="text-xs font-bold uppercase text-gray-500">Reviewed</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-3xl text-center">
            <MessageSquare size={24} className="text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-900">{stats.pending}</p>
            <p className="text-xs font-bold uppercase text-gray-500">Pending</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sermons or speakers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterSeries}
              onChange={(e) => setFilterSeries(e.target.value)}
              className="px-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all font-bold text-sm"
            >
              {series.map(s => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Series' : s}
                </option>
              ))}
            </select>

            <select
              value={filterReview}
              onChange={(e) => setFilterReview(e.target.value)}
              className="px-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all font-bold text-sm"
            >
              <option value="all">All Status</option>
              <option value="reviewed">Reviewed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sermons List */}
      <div className="grid gap-4">
        {filteredSermons.map((sermon) => (
          <div key={sermon.id} className="bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="w-full md:w-48 h-32 md:h-28 bg-gray-200 rounded-2xl overflow-hidden shrink-0 relative group cursor-pointer"
                   onClick={() => setSelectedSermon(sermon)}>
                <img src={sermon.thumbnail} className="w-full h-full object-cover" alt={sermon.title} />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={48} className="text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-black text-xl text-gray-900 mb-1">{sermon.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {sermon.speaker}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {sermon.duration}
                        </span>
                      </div>
                    </div>
                    
                    {sermon.hasReview && (
                      <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-xl">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-xs font-bold text-green-600">Reviewed</span>
                      </div>
                    )}
                  </div>

                  <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                    {sermon.series}
                  </span>

                  {sermon.hasReview && sermon.notes && (
                    <p className="mt-3 text-sm text-gray-600 italic">"{sermon.notes}"</p>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => setSelectedSermon(sermon)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all"
                  >
                    <PlayCircle size={16} />
                    Play
                  </button>
                  
                  {sermon.hasReview ? (
                    <button 
                      onClick={() => {
                        setSelectedSermon(sermon);
                        setReviewForm({ rating: sermon.rating, notes: sermon.notes });
                        setShowReviewModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl font-bold text-sm hover:border-orange-600 hover:text-orange-600 transition-all"
                    >
                      <MessageSquare size={16} />
                      Edit Review
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setSelectedSermon(sermon);
                        setShowReviewModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition-all"
                    >
                      <MessageSquare size={16} />
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSermons.length === 0 && (
        <div className="text-center py-12">
          <PlayCircle size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">No sermons found matching your criteria</p>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedSermon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black">
                {selectedSermon.hasReview ? 'Edit Review' : 'Write Review'}
              </h2>
              <button 
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewForm({ rating: 5, notes: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">{selectedSermon.title}</h3>
                <p className="text-sm text-gray-500">
                  {selectedSermon.speaker} • {new Date(selectedSermon.date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-400 mb-3 block">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`text-4xl transition-colors ${
                        star <= reviewForm.rating ? 'text-orange-600' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">
                  Your Notes & Reflections
                </label>
                <textarea
                  value={reviewForm.notes}
                  onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
                  rows={6}
                  placeholder="What did you learn from this sermon? How will you apply it?"
                  className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewForm({ rating: 5, notes: '' });
                  }}
                  className="px-6 py-4 border-2 border-gray-200 rounded-2xl font-bold hover:border-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}