'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  X, BookOpen, Type, Sun, Moon, Bookmark, Share2, Copy, 
  ChevronLeft, ChevronRight, Menu, Highlighter, StickyNote, 
  Eye, Settings, ZoomIn, ZoomOut, Minus, Plus, Volume2, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '@/lib/api-config';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker - use unpkg CDN which is more reliable
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PDFBookReader({ book, isOpen, onClose, userId }) {
  // Reader Settings
  const [fontSize, setFontSize] = useState(18);
  const [scale, setScale] = useState(1.0);
  const [theme, setTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  
  // Accessibility
  const [highContrast, setHighContrast] = useState(false);
  
  // Interactions
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [notes, setNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  
  const contentRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState('');

  // Load saved data
  useEffect(() => {
    if (book && userId) {
      // Set PDF URL - assume book has a file_path property
      setPdfUrl(`${API_URL}/${book.file_path}`);
      loadUserProgress();
      loadHighlights();
      loadNotes();
      loadBookmarks();
      loadSettings();
    }
  }, [book, userId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const loadUserProgress = async () => {
    try {
      const response = await axios.get(`${API_URL}/library/progress.php`, {
        params: { member_id: userId, book_id: book.id }
      });
      if (response.data.success) {
        setCurrentPage(response.data.data.current_page || 1);
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
        total_pages: numPages
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

  const saveHighlight = async (highlight) => {
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

  const saveNote = async (note) => {
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

  const toggleBookmark = async () => {
    const existingIndex = bookmarks.findIndex(b => b.page === currentPage);
    
    if (existingIndex > -1) {
      const updated = bookmarks.filter((_, i) => i !== existingIndex);
      setBookmarks(updated);
    } else {
      const newBookmark = { page: currentPage, timestamp: new Date().toISOString() };
      setBookmarks([...bookmarks, newBookmark]);
    }
    
    try {
      await axios.post(`${API_URL}/library/bookmarks.php`, {
        member_id: userId,
        book_id: book.id,
        page: currentPage
      });
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem(`user_${userId}_reader_settings`);
    if (saved) {
      const settings = JSON.parse(saved);
      setScale(settings.scale || 1.0);
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
    
    const id = await saveHighlight(newHighlight);
    if (id) {
      newHighlight.id = id;
      setHighlights([...highlights, newHighlight]);
    }
    
    setSelectedText('');
    setSelectionPosition(null);
  };

  // Add note
  const handleAddNote = async () => {
    const noteText = prompt('Enter your note:');
    if (noteText) {
      const newNote = {
        text: noteText,
        reference: selectedText,
        page: currentPage,
        timestamp: new Date().toISOString()
      };
      
      const id = await saveNote(newNote);
      if (id) {
        newNote.id = id;
        setNotes([...notes, newNote]);
      }
    }
    setSelectedText('');
    setSelectionPosition(null);
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

  // Navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= numPages) {
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
          {/* Zoom Controls */}
          <button
            onClick={() => {
              const newScale = Math.max(0.5, scale - 0.1);
              setScale(newScale);
              saveSettings({ scale: newScale, theme, highContrast });
            }}
            className={`p-2 rounded-full hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-800' : ''}`}
            title="Zoom out"
          >
            <ZoomOut size={18} className={currentTheme.text} />
          </button>
          <span className={`text-sm font-bold ${currentTheme.text} min-w-[50px] text-center`}>
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => {
              const newScale = Math.min(2.0, scale + 0.1);
              setScale(newScale);
              saveSettings({ scale: newScale, theme, highContrast });
            }}
            className={`p-2 rounded-full hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-800' : ''}`}
            title="Zoom in"
          >
            <ZoomIn size={18} className={currentTheme.text} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              const newTheme = theme === 'light' ? 'sepia' : theme === 'sepia' ? 'dark' : 'light';
              setTheme(newTheme);
              saveSettings({ scale, theme: newTheme, highContrast });
            }}
            className={`p-2 rounded-full hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-800' : ''}`}
            title="Change theme"
          >
            {theme === 'dark' ? <Moon size={20} className={currentTheme.text} /> : <Sun size={20} className={currentTheme.text} />}
          </button>

          {/* High Contrast */}
          <button
            onClick={() => {
              setHighContrast(!highContrast);
              saveSettings({ scale, theme, highContrast: !highContrast });
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

          {/* Notes & Highlights Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-2 rounded-full hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-800' : ''}`}
            title="Notes & Highlights"
          >
            <Menu size={20} className={currentTheme.text} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Viewer */}
        <div
          ref={contentRef}
          className={`flex-1 overflow-y-auto ${currentTheme.bg} ${highContrast ? 'filter contrast-150' : ''} flex flex-col items-center py-8`}
          onMouseUp={handleTextSelection}
        >
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={48} className="text-orange-600 animate-spin mb-4" />
              <p className={`text-sm ${currentTheme.secondary}`}>Loading book...</p>
            </div>
          )}
          
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading=""
            className="pdf-document"
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              className="pdf-page shadow-2xl"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>

          {/* Show highlights for current page */}
          {highlights.filter(h => h.page === currentPage).length > 0 && (
            <div className="mt-8 max-w-2xl w-full px-4">
              <h3 className={`text-sm font-bold ${currentTheme.text} mb-3`}>Highlights on this page:</h3>
              {highlights.filter(h => h.page === currentPage).map(highlight => (
                <div key={highlight.id} className={`p-3 rounded-lg mb-2 ${
                  highlight.color === 'yellow' ? 'bg-yellow-100' :
                  highlight.color === 'green' ? 'bg-green-100' :
                  highlight.color === 'blue' ? 'bg-blue-100' :
                  'bg-pink-100'
                }`}>
                  <p className="text-sm font-medium">{highlight.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Panel for Notes/Highlights */}
        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className={`w-80 ${currentTheme.bg} border-l ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} overflow-y-auto`}
            >
              <div className="p-4">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => { setShowHighlights(false); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold ${!showHighlights ? 'bg-orange-600 text-white' : 'bg-gray-100'}`}
                  >
                    Notes ({notes.length})
                  </button>
                  <button
                    onClick={() => { setShowHighlights(true); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold ${showHighlights ? 'bg-orange-600 text-white' : 'bg-gray-100'}`}
                  >
                    Highlights ({highlights.length})
                  </button>
                </div>

                {!showHighlights && (
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
                      <div key={highlight.id} className={`p-3 rounded-lg cursor-pointer hover:opacity-80 ${
                        highlight.color === 'yellow' ? 'bg-yellow-100' :
                        highlight.color === 'green' ? 'bg-green-100' :
                        highlight.color === 'blue' ? 'bg-blue-100' :
                        'bg-pink-100'
                      }`}
                      onClick={() => goToPage(highlight.page)}
                      >
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
              Page {currentPage} of {numPages || '...'}
            </span>
            {numPages > 0 && (
              <>
                <input
                  type="range"
                  min="1"
                  max={numPages}
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value))}
                  className="w-32"
                />
                <span className={`text-xs ${currentTheme.secondary}`}>
                  {Math.round((currentPage / numPages) * 100)}%
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === numPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm ${
              currentPage === numPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 ' + (theme === 'dark' ? 'hover:bg-gray-800' : '')
            }`}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

