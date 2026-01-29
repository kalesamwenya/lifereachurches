'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, BookOpen, Type, Sun, Moon, Bookmark, Share2, Copy, 
  ChevronLeft, ChevronRight, Menu, Highlighter, StickyNote, 
  Eye, Settings, ZoomIn, ZoomOut, Minus, Plus, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = 'https://content.lifereachchurch.org';

export default function BookReader({ book, isOpen, onClose, userId }) {
  // Reader Settings
  const [fontSize, setFontSize] = useState(18);
  const [fontFamily, setFontFamily] = useState('serif');
  const [lineHeight, setLineHeight] = useState(1.8);
  const [theme, setTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  
  // Accessibility
  const [highContrast, setHighContrast] = useState(false);
  const [readingMode, setReadingMode] = useState(false); // Focus mode
  const [speechEnabled, setSpeechEnabled] = useState(false);
  
  // Interactions
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [notes, setNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  
  const contentRef = useRef(null);
  const [totalPages, setTotalPages] = useState(100); // Mock - would be calculated from actual content

  // Load saved data
  useEffect(() => {
    if (book && userId) {
      loadUserProgress();
      loadHighlights();
      loadNotes();
      loadBookmarks();
      loadSettings();
    }
  }, [book, userId]);

  const loadUserProgress = async () => {
    try {
      const response = await axios.get(`${API_URL}/library/progress.php`, {
        params: { member_id: userId, book_id: book.id }
      });
      if (response.data.success) {
        setCurrentPage(response.data.data.current_page || 1);
        setTotalPages(response.data.data.total_pages || 100);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (page) => {
    try {
      await axios.post(`${API_URL}/library/progress.php`, {
        member_id: userId,
        book_id: book.id,
        current_page: page,
        total_pages: totalPages
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const loadHighlights = async () => {
    try {
      const response = await axios.get(`${API_URL}/library/highlights.php`, {
        params: { member_id: userId, book_id: book.id }
      });
      if (response.data.success) {
        setHighlights(response.data.data);
      }
    } catch (error) {
      console.error('Error loading highlights:', error);
    }
  };

  const saveHighlights = async (highlight) => {
    try {
      const response = await axios.post(`${API_URL}/library/highlights.php`, {
        member_id: userId,
        book_id: book.id,
        text: highlight.text,
        color: highlight.color,
        page: highlight.page
      });
      return response.data.id;
    } catch (error) {
      console.error('Error saving highlight:', error);
    }
  };

  const loadNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/library/notes.php`, {
        params: { member_id: userId, book_id: book.id }
      });
      if (response.data.success) {
        setNotes(response.data.data);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = async (note) => {
    try {
      const response = await axios.post(`${API_URL}/library/notes.php`, {
        member_id: userId,
        book_id: book.id,
        note: note.text,
        reference_text: note.reference,
        page: note.page
      });
      return response.data.id;
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const loadBookmarks = async () => {
    try {
      const response = await axios.get(`${API_URL}/library/bookmarks.php`, {
        params: { member_id: userId, book_id: book.id }
      });
      if (response.data.success) {
        setBookmarks(response.data.data);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const saveBookmarks = async (page) => {
    try {
      await axios.post(`${API_URL}/library/bookmarks.php`, {
        member_id: userId,
        book_id: book.id,
        page: page
      });
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem(`user_${userId}_reader_settings`);
    if (saved) {
      const settings = JSON.parse(saved);
      setFontSize(settings.fontSize || 18);
      setFontFamily(settings.fontFamily || 'serif');
      setLineHeight(settings.lineHeight || 1.8);
      setTheme(settings.theme || 'light');
      setHighContrast(settings.highContrast || false);
    }
  };

  const saveSettings = (settings) => {
    localStorage.setItem(`user_${userId}_reader_settings`, JSON.stringify(settings));
  };

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(text);
      setSelectionPosition({
        top: rect.top - 60,
        left: rect.left + (rect.width / 2)
      });
    } else {
      setSelectedText('');
      setSelectionPosition(null);
    }
  };

  // Highlight text
  const handleHighlight = async (color = 'yellow') => {
    const newHighlight = {
      text: selectedText,
      color,
      page: currentPage,
      timestamp: new Date().toISOString()
    };
    
    const id = await saveHighlights(newHighlight);
    if (id) {
      newHighlight.id = id;
      setHighlights([...highlights, newHighlight]);
    }
    
    setSelectedText('');
    setSelectionPosition(null);
  };

  // Add note
  const handleAddNote = () => {
    setShowNoteModal(true);
  };

  const saveNoteFromModal = async () => {
    if (!noteText.trim()) return;
    
    const newNote = {
      text: noteText,
      reference: selectedText,
      page: currentPage,
      timestamp: new Date().toISOString()
    };
    
    const id = await saveNotes(newNote);
    if (id) {
      newNote.id = id;
      setNotes([...notes, newNote]);
    }
    
    // Reset and close
    setNoteText('');
    setNoteTitle('');
    setShowNoteModal(false);
    setSelectedText('');
    setSelectionPosition(null);
  };

  const closeNoteModal = () => {
    setShowNoteModal(false);
    setNoteText('');
    setNoteTitle('');
  };

  // Copy text
  const handleCopy = () => {
    navigator.clipboard.writeText(selectedText);
    alert('Text copied to clipboard!');
    setSelectedText('');
    setSelectionPosition(null);
  };

  // Share text
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: selectedText,
      });
    } else {
      handleCopy();
    }
    setSelectedText('');
    setSelectionPosition(null);
  };

  // Toggle bookmark
  const toggleBookmark = async () => {
    const existingIndex = bookmarks.findIndex(b => b.page === currentPage);
    
    if (existingIndex > -1) {
      // Remove from state
      const updated = bookmarks.filter((_, i) => i !== existingIndex);
      setBookmarks(updated);
    } else {
      // Add to state
      const newBookmark = { page: currentPage, timestamp: new Date().toISOString() };
      setBookmarks([...bookmarks, newBookmark]);
    }
    
    // Save to database (API handles toggle)
    await saveBookmarks(currentPage);
  };

  // Navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      saveProgress(page);
    }
  };

  // Theme configurations
  const themes = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      secondary: 'text-gray-600'
    },
    sepia: {
      bg: 'bg-amber-50',
      text: 'text-amber-950',
      secondary: 'text-amber-800'
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      secondary: 'text-gray-400'
    }
  };

  const currentTheme = themes[theme] || themes.light;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
    >
      {/* Header */}
      <div className={`${currentTheme.bg} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-800' : ''}`}
          >
            <X size={20} className={currentTheme.text} />
          </button>
          <div>
            <h2 className={`font-bold text-sm ${currentTheme.text}`}>{book?.title}</h2>
            <p className={`text-xs ${currentTheme.secondary}`}>{book?.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Font Size */}
          <button
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            className={`p-2 rounded-full hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-800' : ''}`}
            title="Decrease font size"
          >
            <Minus size={18} className={currentTheme.text} />
          </button>
          <span className={`text-sm font-bold ${currentTheme.text} min-w-[40px] text-center`}>{fontSize}px</span>
          <button
            onClick={() => setFontSize(Math.min(32, fontSize + 2))}
            className={`p-2 rounded-full hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-800' : ''}`}
            title="Increase font size"
          >
            <Plus size={18} className={currentTheme.text} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'sepia' : theme === 'sepia' ? 'dark' : 'light')}
            className={`p-2 rounded-full hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-800' : ''}`}
            title="Change theme"
          >
            {theme === 'dark' ? <Moon size={20} className={currentTheme.text} /> : <Sun size={20} className={currentTheme.text} />}
          </button>

          {/* High Contrast */}
          <button
            onClick={() => {
              setHighContrast(!highContrast);
              saveSettings({ fontSize, fontFamily, lineHeight, theme, highContrast: !highContrast });
            }}
            className={`p-2 rounded-full hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-800' : ''} ${highContrast ? 'bg-orange-100' : ''}`}
            title="Toggle high contrast"
          >
            <Eye size={20} className={highContrast ? 'text-orange-600' : currentTheme.text} />
          </button>

          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-full hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-800' : ''}`}
            title="Bookmark this page"
          >
            <Bookmark
              size={20}
              className={bookmarks.some(b => b.page === currentPage) ? 'text-orange-600 fill-orange-600' : currentTheme.text}
            />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-800' : ''}`}
            title="Settings"
          >
            <Settings size={20} className={currentTheme.text} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Reading Content */}
        <div
          ref={contentRef}
          className={`flex-1 overflow-y-auto ${currentTheme.bg} ${highContrast ? 'filter contrast-150' : ''}`}
          onMouseUp={handleTextSelection}
        >
          <div
            className="max-w-4xl mx-auto px-8 py-12"
            style={{
              fontSize: `${fontSize}px`,
              fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'sans' ? 'Arial, sans-serif' : 'monospace',
              lineHeight: lineHeight
            }}
          >
            <div className={currentTheme.text}>
              {/* Sample content - would be replaced with actual book content */}
              <h1 className="text-3xl font-bold mb-8">Chapter {currentPage}</h1>
              
              <p className="mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              
              <p className="mb-6">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              
              <p className="mb-6">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>

              {/* Show highlights on current page */}
              {highlights.filter(h => h.page === currentPage).map(highlight => (
                <div key={highlight.id} className={`p-3 rounded-lg mb-4 ${
                  highlight.color === 'yellow' ? 'bg-yellow-100' :
                  highlight.color === 'green' ? 'bg-green-100' :
                  highlight.color === 'blue' ? 'bg-blue-100' :
                  'bg-pink-100'
                }`}>
                  <p className="text-sm font-medium">{highlight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel for Notes/Highlights */}
        <AnimatePresence>
          {(showNotes || showHighlights) && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className={`w-80 ${currentTheme.bg} border-l ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} overflow-y-auto`}
            >
              <div className="p-4">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => { setShowNotes(true); setShowHighlights(false); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold ${showNotes ? 'bg-orange-600 text-white' : 'bg-gray-100'}`}
                  >
                    Notes ({notes.length})
                  </button>
                  <button
                    onClick={() => { setShowHighlights(true); setShowNotes(false); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold ${showHighlights ? 'bg-orange-600 text-white' : 'bg-gray-100'}`}
                  >
                    Highlights ({highlights.length})
                  </button>
                </div>

                {showNotes && (
                  <div className="space-y-3">
                    {notes.map(note => (
                      <div key={note.id} className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Page {note.page}</p>
                        {note.reference_text && (
                          <p className="text-sm italic text-gray-600 mb-2">"{note.reference_text}"</p>
                        )}
                        <p className="text-sm font-medium">{note.note}</p>
                      </div>
                    ))}
                    {notes.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-8">No notes yet</p>
                    )}
                  </div>
                )}

                {showHighlights && (
                  <div className="space-y-3">
                    {highlights.map(highlight => (
                      <div key={highlight.id} className={`p-3 rounded-lg ${
                        highlight.color === 'yellow' ? 'bg-yellow-100' :
                        highlight.color === 'green' ? 'bg-green-100' :
                        highlight.color === 'blue' ? 'bg-blue-100' :
                        'bg-pink-100'
                      }`}>
                        <p className="text-xs text-gray-500 mb-1">Page {highlight.page}</p>
                        <p className="text-sm font-medium">{highlight.text}</p>
                      </div>
                    ))}
                    {highlights.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-8">No highlights yet</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Selection Toolbar */}
      <AnimatePresence>
        {selectedText && selectionPosition && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed z-50 bg-gray-900 text-white rounded-xl shadow-2xl p-2 flex items-center gap-2"
            style={{
              top: `${selectionPosition.top}px`,
              left: `${selectionPosition.left}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <button
              onClick={() => handleHighlight('yellow')}
              className="p-2 hover:bg-gray-700 rounded-lg"
              title="Highlight (Yellow)"
            >
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            </button>
            <button
              onClick={() => handleHighlight('green')}
              className="p-2 hover:bg-gray-700 rounded-lg"
              title="Highlight (Green)"
            >
              <div className="w-4 h-4 bg-green-400 rounded"></div>
            </button>
            <button
              onClick={() => handleHighlight('blue')}
              className="p-2 hover:bg-gray-700 rounded-lg"
              title="Highlight (Blue)"
            >
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
            </button>
            <div className="w-px h-6 bg-gray-600"></div>
            <button
              onClick={handleAddNote}
              className="p-2 hover:bg-gray-700 rounded-lg"
              title="Add Note"
            >
              <StickyNote size={18} />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-700 rounded-lg"
              title="Copy"
            >
              <Copy size={18} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-700 rounded-lg"
              title="Share"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => { setShowNotes(true); setShowHighlights(false); }}
              className="p-2 hover:bg-gray-700 rounded-lg"
              title="View Notes"
            >
              <Menu size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className={`${currentTheme.bg} border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} px-6 py-4`}>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm ${
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 ' + (theme === 'dark' ? 'hover:bg-gray-800' : '')
            }`}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="flex items-center gap-4">
            <span className={`text-sm ${currentTheme.text}`}>
              Page {currentPage} of {totalPages}
            </span>
            <input
              type="range"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value))}
              className="w-32"
            />
            <span className={`text-xs ${currentTheme.secondary}`}>
              {Math.round((currentPage / totalPages) * 100)}%
            </span>
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm ${
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 ' + (theme === 'dark' ? 'hover:bg-gray-800' : '')
            }`}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Note Creation Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeNoteModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-br from-orange-600 to-red-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                    >
                      <StickyNote size={24} className="text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-black text-white">Create Note</h3>
                      <p className="text-sm text-white/80">Page {currentPage}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeNoteModal}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95 backdrop-blur-sm"
                  >
                    <X size={20} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Selected Text Reference */}
                {selectedText && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <Highlighter size={16} className="text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-1">Referenced Text</p>
                        <p className="text-sm text-gray-700 italic leading-relaxed">"{selectedText}"</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Note Title (Optional) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Title <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Give your note a title..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all text-gray-900 placeholder-gray-400"
                  />
                </motion.div>

                {/* Note Text */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Note <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write your thoughts, reflections, or insights..."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all text-gray-900 placeholder-gray-400 resize-none"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {noteText.length} characters
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3 pt-2"
                >
                  <button
                    onClick={closeNoteModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNoteFromModal}
                    disabled={!noteText.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    Save Note
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

