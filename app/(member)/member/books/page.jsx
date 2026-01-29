"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BookReader from '@/components/BookReader';
import axios from 'axios';

const API_URL = 'https://content.lifereachchurch.org';

export default function Books() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  
  // Database state
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['all']);

  // Fetch books from database
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/library/books.php`, {
        params: { page: 1, limit: 100 }
      });

      if (response.data.success) {
        const books = response.data.data.books;
        
        // Fetch progress for all books if user is logged in
        let progressMap = {};
        if (user?.id) {
          try {
            const progressPromises = books.map(book =>
              axios.get(`${API_URL}/library/progress.php`, {
                params: { member_id: user.id, book_id: book.id }
              })
            );
            const progressResults = await Promise.all(progressPromises);
            
            progressResults.forEach((result, index) => {
              if (result.data.success && result.data.data) {
                progressMap[books[index].id] = result.data.data;
              }
            });
          } catch (err) {
            console.error('Error fetching progress:', err);
          }
        }
        
        // Map database books to match existing design structure
        const mappedBooks = books.map(book => {
          const progress = progressMap[book.id];
          const progressPercentage = progress ? parseFloat(progress.progress_percentage) : 0;
          
          let status = 'wishlist';
          if (progressPercentage === 100) {
            status = 'completed';
          } else if (progressPercentage > 0) {
            status = 'reading';
          }
          
          return {
            id: book.id,
            title: book.title,
            author: book.author || 'Unknown Author',
            cover: book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
            progress: Math.round(progressPercentage),
            status: status,
            category: book.category || 'General',
            startedDate: progress ? progress.last_read_at : null,
            completedDate: progressPercentage === 100 ? progress.last_read_at : null,
            file_path: book.file_path,
            total_pages: book.total_pages
          };
        });
        
        setBooksData(mappedBooks);
        setCategories(['all', ...response.data.data.categories]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = booksData.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    reading: booksData.filter(b => b.status === 'reading').length,
    completed: booksData.filter(b => b.status === 'completed').length,
    wishlist: booksData.filter(b => b.status === 'wishlist').length
  };

  const openReader = (book) => {
    setSelectedBook(book);
    setIsReaderOpen(true);
  };

  return (
    <>
    <div className="space-y-8">
      {/* Header with Stats */}
      <div>
        <h1 className="text-3xl font-black uppercase mb-6">Book Reading</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-6 rounded-3xl text-center">
            <BookOpen size={24} className="text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-900">{stats.reading}</p>
            <p className="text-xs font-bold uppercase text-gray-500">Currently Reading</p>
          </div>
          <div className="bg-green-50 p-6 rounded-3xl text-center">
            <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-900">{stats.completed}</p>
            <p className="text-xs font-bold uppercase text-gray-500">Completed</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-3xl text-center">
            <Clock size={24} className="text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-900">{stats.wishlist}</p>
            <p className="text-xs font-bold uppercase text-gray-500">Wishlist</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all font-bold text-sm"
            >
              <option value="all">All Status</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
              <option value="wishlist">Wishlist</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all font-bold text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="text-orange-600 animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Loading books...</p>
        </div>
      )}

      {/* Books Grid */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white p-4 rounded-[2rem] border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex gap-4">
                  <div className="w-24 h-32 bg-gray-200 rounded-2xl overflow-hidden shrink-0">
                    <img src={book.cover} className="w-full h-full object-cover" alt={book.title} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-black text-base leading-tight mb-1">{book.title}</h3>
                      <p className="text-xs text-gray-500 font-bold uppercase">{book.author}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        book.status === 'reading' ? 'bg-blue-100 text-blue-600' :
                        book.status === 'completed' ? 'bg-green-100 text-green-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {book.status}
                      </span>
                    </div>
                  </div>
                </div>

                {book.status === 'reading' && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[10px] font-bold text-orange-600 uppercase">{book.progress}% Completed</p>
                      <button 
                        onClick={() => openReader(book)}
                        className="text-xs font-bold text-orange-600 hover:underline"
                      >
                        Continue Reading
                      </button>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-orange-600 h-full transition-all duration-300" 
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {book.status === 'completed' && (
                  <div className="mt-4">
                    <p className="text-xs text-green-600 font-bold text-center mb-2">
                      Completed: {new Date(book.completedDate).toLocaleDateString()}
                    </p>
                    <button 
                      onClick={() => openReader(book)}
                      className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                    >
                      Read Again
                    </button>
                  </div>
                )}

                {book.status === 'wishlist' && (
                  <button 
                    onClick={() => openReader(book)}
                    className="w-full mt-4 bg-orange-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-orange-700 transition-all"
                  >
                    Start Reading
                  </button>
                )}
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">No books found matching your criteria</p>
            </div>
          )}
        </>
      )}
    </div>

    {/* Book Reader Modal */}
    {selectedBook && (
      <BookReader
        book={selectedBook}
        isOpen={isReaderOpen}
        onClose={() => {
          setIsReaderOpen(false);
          setSelectedBook(null);
          // Refresh books to update progress
          fetchBooks();
        }}
        userId={user?.id}
      />
    )}
    </>
  );
}