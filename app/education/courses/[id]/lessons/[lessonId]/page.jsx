'use client';

import { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaStickyNote, FaHighlighter } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import BookReader from '@/components/BookReader';

const API_BASE = 'https://content.lifereachchurch.org';

export default function LessonViewerPage() {
  const { user: member } = useAuth();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;
  const lessonId = params.lessonId;
  
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [notes, setNotes] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  
  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    if (!member) {
      alert('Please log in to access lessons');
      router.push('/login');
      return;
    }
    fetchLessonData();
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [lessonId, member]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      
      // Fetch course with lessons
      const courseResponse = await axios.get(`${API_BASE}/education/courses/get_one.php`, {
        params: { id: courseId }
      });
      
      if (courseResponse.data.success) {
        setCourse(courseResponse.data.course);
        const allLessons = courseResponse.data.lessons || [];
        setLessons(allLessons);
        
        const currentLesson = allLessons.find(l => l.lesson_id === parseInt(lessonId));
        setLesson(currentLesson);
      }
      
      // Fetch notes
      await fetchNotes();
      
      // Fetch highlights
      await fetchHighlights();
      
      // Start tracking progress
      startProgressTracking();
      
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/education/notes/get.php`, {
        params: {
          lesson_id: lessonId,
          member_id: member.id
        }
      });
      
      if (response.data.success) {
        setNotes(response.data.notes || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchHighlights = async () => {
    try {
      const response = await axios.get(`${API_BASE}/education/highlights/get.php`, {
        params: {
          lesson_id: lessonId,
          member_id: member.id
        }
      });
      
      if (response.data.success) {
        setHighlights(response.data.highlights || []);
      }
    } catch (error) {
      console.error('Error fetching highlights:', error);
    }
  };

  const startProgressTracking = () => {
    // Track progress every 30 seconds
    progressIntervalRef.current = setInterval(() => {
      updateProgress();
    }, 30000);
  };

  const updateProgress = async (completed = false) => {
    try {
      const timeSpent = 0.5; // 30 seconds = 0.5 minutes
      await axios.post(`${API_BASE}/education/lessons/update_progress.php`, {
        lesson_id: lessonId,
        member_id: member.id,
        time_spent_minutes: timeSpent,
        is_completed: completed ? 1 : 0
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) {
      alert('Please enter a note');
      return;
    }

    setSavingNote(true);
    try {
      const response = await axios.post(`${API_BASE}/education/notes/save.php`, {
        lesson_id: lessonId,
        member_id: member.id,
        note_text: noteText,
        page_number: null, // For general notes; PDFReader will handle page-specific
        timestamp: lesson?.content_type === 'video' && videoRef.current 
          ? Math.floor(videoRef.current.currentTime)
          : null
      });

      if (response.data.success) {
        setNoteText('');
        await fetchNotes();
        alert('Note saved!');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleSaveHighlight = async (highlightData) => {
    try {
      await axios.post(`${API_BASE}/education/highlights/save.php`, {
        lesson_id: lessonId,
        member_id: member.id,
        ...highlightData
      });
      await fetchHighlights();
    } catch (error) {
      console.error('Error saving highlight:', error);
    }
  };

  const markAsComplete = async () => {
    await updateProgress(true);
    alert('Lesson marked as complete!');
    
    // Navigate to next lesson if available
    const currentIndex = lessons.findIndex(l => l.lesson_id === parseInt(lessonId));
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      router.push(`/education/courses/${courseId}/lessons/${nextLesson.lesson_id}`);
    } else {
      router.push(`/education/courses/${courseId}`);
    }
  };

  const getCurrentLessonIndex = () => {
    return lessons.findIndex(l => l.lesson_id === parseInt(lessonId));
  };

  const hasPrevious = () => getCurrentLessonIndex() > 0;
  const hasNext = () => getCurrentLessonIndex() < lessons.length - 1;

  const goToPrevious = () => {
    const index = getCurrentLessonIndex();
    if (index > 0) {
      router.push(`/education/courses/${courseId}/lessons/${lessons[index - 1].lesson_id}`);
    }
  };

  const goToNext = () => {
    const index = getCurrentLessonIndex();
    if (index < lessons.length - 1) {
      router.push(`/education/courses/${courseId}/lessons/${lessons[index + 1].lesson_id}`);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
          <p className="mt-4 text-white">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Lesson not found</h2>
          <Link href={`/education/courses/${courseId}`}>
            <button className="text-brand-500 hover:underline">Back to Course</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white border-b border-gray-700 h-[80vh] flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/education/courses/${courseId}`}>
                <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                  <FaArrowLeft /> Back to Course
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">{lesson.title}</h1>
                <p className="text-sm text-gray-400">{course?.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showNotes ? 'bg-brand-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FaStickyNote /> Notes ({notes.length})
              </button>
              
              <button
                onClick={markAsComplete}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <FaCheckCircle /> Mark Complete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {lesson.content_type === 'video' && lesson.video_url && (
                <div className="aspect-video">
                  {lesson.video_url.includes('youtube.com') || lesson.video_url.includes('youtu.be') ? (
                    <iframe
                      ref={videoRef}
                      src={getYouTubeEmbedUrl(lesson.video_url)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={lesson.video_url}
                      controls
                      className="w-full h-full"
                    />
                  )}
                </div>
              )}

              {lesson.content_type === 'pdf' && lesson.pdf_path && (
                <BookReader
                  bookId={lessonId}
                  pdfUrl={lesson.pdf_path.startsWith('http') ? lesson.pdf_path : `${API_BASE}${lesson.pdf_path}`}
                  bookTitle={lesson.title}
                  apiEndpoint="education" // Uses education notes/highlights APIs
                  memberId={member.id}
                  onSaveNote={fetchNotes}
                  onSaveHighlight={handleSaveHighlight}
                />
              )}

              {lesson.content_type === 'text' && (
                <div className="p-8">
                  <div className="prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: lesson.text_content?.replace(/\n/g, '<br/>') }} />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={goToPrevious}
                disabled={!hasPrevious()}
                className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowLeft /> Previous Lesson
              </button>
              
              <button
                onClick={goToNext}
                disabled={!hasNext()}
                className="flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Lesson <FaArrowRight />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {showNotes ? (
              <div className="bg-gray-800 rounded-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4">My Notes</h3>
                
                {/* Add Note */}
                <div className="mb-6">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write a note..."
                    rows="4"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white"
                  />
                  <button
                    onClick={handleSaveNote}
                    disabled={savingNote}
                    className="mt-2 w-full bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 disabled:opacity-50"
                  >
                    {savingNote ? 'Saving...' : 'Save Note'}
                  </button>
                </div>

                {/* Notes List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notes.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">No notes yet</p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.note_id} className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm">{note.note_text}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {note.page_number ? `Page ${note.page_number}` : ''}
                          {note.timestamp ? ` ${Math.floor(note.timestamp / 60)}:${(note.timestamp % 60).toString().padStart(2, '0')}` : ''}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Course Lessons</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {lessons.map((l, index) => (
                    <Link key={l.lesson_id} href={`/education/courses/${courseId}/lessons/${l.lesson_id}`}>
                      <div
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          l.lesson_id === parseInt(lessonId)
                            ? 'bg-brand-500'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{index + 1}.</span>
                          <span className="text-sm flex-1">{l.title}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
