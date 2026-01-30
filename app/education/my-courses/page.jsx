'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaBook, FaClock, FaCheckCircle, FaPlay, FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const API_BASE = 'https://content.lifereachchurch.org';

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, in-progress, completed

  useEffect(() => {
    if (user) {
      fetchMyCourses();
    }
  }, [user]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/education/my_courses.php`, {
        params: { member_id: user.id }
      });
      
      // Handle both response formats
      const coursesData = response.data.success 
        ? response.data.courses 
        : (Array.isArray(response.data) ? response.data : []);
      
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'in-progress') return !course.completed_at && course.progress_percentage > 0;
    if (filter === 'completed') return course.completed_at;
    return true;
  });

  const stats = {
    total: courses.length,
    inProgress: courses.filter(c => !c.completed_at && c.progress_percentage > 0).length,
    completed: courses.filter(c => c.completed_at).length,
    totalHours: courses.reduce((sum, c) => sum + (c.duration_hours || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 pt-[4rem] pb-[4rem]">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
        <p className="text-gray-600">Track your progress and continue your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FaBook className="text-4xl text-brand-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <FaPlay className="text-4xl text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalHours}</p>
            </div>
            <FaClock className="text-4xl text-purple-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-brand-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Courses ({stats.total})
        </button>
        <button
          onClick={() => setFilter('in-progress')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'in-progress'
              ? 'bg-brand-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          In Progress ({stats.inProgress})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-brand-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Completed ({stats.completed})
        </button>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' ? "You haven't enrolled in any courses yet" : `No ${filter} courses`}
          </p>
          <Link
            href="/education"
            className="inline-block bg-brand-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-600 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.course_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/education/courses/${course.course_id}`}>
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer h-full flex flex-col">
                  {/* Thumbnail */}
                  <div className="h-48 bg-gray-200 relative">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url.startsWith('http') ? course.thumbnail_url : `${API_BASE}${course.thumbnail_url}`}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-400">
                        <FaBook className="text-white text-6xl opacity-50" />
                      </div>
                    )}
                    
                    {course.completed_at && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <FaTrophy /> Completed
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span className="font-semibold">{course.progress_percentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress_percentage || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <FaBook className="text-brand-500" />
                        <span>{course.completed_lessons || 0}/{course.total_lessons || 0} Lessons</span>
                      </div>
                      {course.duration_hours > 0 && (
                        <div className="flex items-center gap-2">
                          <FaClock className="text-brand-500" />
                          <span>{course.duration_hours}h</span>
                        </div>
                      )}
                    </div>

                    {course.last_accessed_lesson_id && (
                      <button className="mt-4 w-full bg-brand-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-600 transition-colors">
                        Continue Learning
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
