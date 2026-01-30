'use client';

import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaBook, FaClock, FaUsers, FaCheckCircle, FaPlayCircle, FaFilePdf, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const API_BASE = 'https://content.lifereachchurch.org';

export default function CourseDetailPage() {
  const { user: member } = useAuth();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
    if (member) {
      checkEnrollment();
    }
  }, [courseId, member]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/education/courses/get_one.php`, {
        params: { id: courseId }
      });
      
      // API returns course data directly
      setCourse(response.data);
      setLessons(response.data.lessons || []);
    } catch (error) {
      console.error('Error fetching course:', error);
      if (error.response?.status === 404) {
        setError('Course not found. It may have been removed or you may not have access.');
      } else {
        setError('Failed to load course. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!member?.id) {
      console.log('No member ID available for enrollment check');
      return;
    }
    
    try {
      console.log('Checking enrollment for member:', member.id, 'course:', courseId);
      const response = await axios.get(`${API_BASE}/education/my_courses.php`, {
        params: { member_id: member.id }
      });
      
      console.log('Enrollment check response:', response.data);
      
      if (response.data.success) {
        const enrolled = response.data.courses.find(c => c.course_id === parseInt(courseId));
        console.log('Enrollment found:', enrolled);
        setIsEnrolled(!!enrolled);
        setEnrollmentData(enrolled || null);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!member) {
      alert('Please log in to enroll in courses');
      router.push('/login');
      return;
    }

    setEnrolling(true);
    try {
      const response = await axios.post(`${API_BASE}/education/enroll.php`, {
        course_id: courseId,
        member_id: member.id
      });

      if (response.data.success) {
        alert('Successfully enrolled in course!');
        setIsEnrolled(true);
        checkEnrollment();
      } else {
        alert(response.data.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const getLessonIcon = (contentType) => {
    switch(contentType) {
      case 'video': return <FaPlayCircle className="text-red-500" />;
      case 'pdf': return <FaFilePdf className="text-red-500" />;
      default: return <FaFileAlt className="text-blue-500" />;
    }
  };

  const isLessonCompleted = (lessonId) => {
    // Check if lesson is in completed lessons (you'd track this in progress data)
    return false; // Placeholder
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBook className="text-3xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/education"
            className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-600 transition-colors"
          >
            <FaArrowLeft /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-400 text-white h-[80vh] flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link href="/education">
            <button className="flex items-center gap-2 text-white hover:text-gray-200 mb-6">
              <FaArrowLeft /> Back to Courses
            </button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-gray-200 mb-6">{course.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaBook />
                    <span>{lessons.length} Lessons</span>
                  </div>
                  {course.duration_hours > 0 && (
                    <div className="flex items-center gap-2">
                      <FaClock />
                      <span>{course.duration_hours} Hours</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FaUsers />
                    <span>{course.enrolled_count || 0} Students</span>
                  </div>
                  {course.instructor_name && (
                    <div className="px-3 py-1 bg-white bg-opacity-20 rounded-full">
                      Instructor: {course.instructor_name}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white text-gray-900 rounded-lg p-6 shadow-lg"
              >
                {course.thumbnail_url && (
                  <img
                    src={course.thumbnail_url.startsWith('http') ? course.thumbnail_url : `${API_BASE}${course.thumbnail_url}`}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                {isEnrolled ? (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                        <span className="text-sm text-gray-600">
                          {enrollmentData?.progress_percentage || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-brand-500 h-3 rounded-full transition-all"
                          style={{ width: `${enrollmentData?.progress_percentage || 0}%` }}
                        />
                      </div>
                    </div>

                    <Link href={`/education/courses/${courseId}/lessons/${enrollmentData?.last_accessed_lesson_id || lessons[0]?.lesson_id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-brand-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-600 transition-colors"
                      >
                        Continue Learning
                      </motion.button>
                    </Link>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEnroll}
                    disabled={enrolling || !member}
                    className="w-full bg-brand-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? 'Enrolling...' : member ? 'Enroll in Course' : 'Login to Enroll'}
                  </motion.button>
                )}

                <div className="mt-4 pt-4 border-t space-y-2 text-sm text-gray-600">
                  <p><strong>Level:</strong> <span className="capitalize">{course.level}</span></p>
                  {course.category && <p><strong>Category:</strong> {course.category}</p>}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Lessons</h2>
            
            {lessons.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
                <p className="text-gray-600">No lessons available yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, index) => {
                  const MotionWrapper = motion.div;
                  return (
                    <MotionWrapper
                      key={`lesson-${lesson.lesson_id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {isEnrolled ? (
                      <Link href={`/education/courses/${courseId}/lessons/${lesson.lesson_id}`}>
                        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              {getLessonIcon(lesson.content_type)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                              <p className="text-sm text-gray-500 capitalize">{lesson.content_type}</p>
                            </div>
                            {isLessonCompleted(lesson.lesson_id) && (
                              <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="bg-white rounded-lg shadow-sm p-4 opacity-60">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {getLessonIcon(lesson.content_type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                            <p className="text-sm text-gray-500 capitalize">{lesson.content_type}</p>
                          </div>
                          <span className="text-xs text-gray-500">🔒 Enroll to access</span>
                        </div>
                      </div>
                    )}
                  </MotionWrapper>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About this Course</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <p>{course.description}</p>
                
                {course.instructor_name && (
                  <div className="pt-4 border-t">
                    <p className="font-semibold text-gray-900 mb-1">Instructor</p>
                    <p>{course.instructor_name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
