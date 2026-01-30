'use client';

import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaBook, FaClock, FaUsers, FaStar, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const API_BASE = 'https://content.lifereachchurch.org';

export default function EducationPage() {
  const { user: member } = useAuth();
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    fetchCourses();
    if (member) {
      fetchMyCourses();
    }
  }, [member]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/education/courses/get_all.php`, {
        params: { status: 'published' }
      });
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE}/education/my_courses.php`, {
        params: { member_id: member.id }
      });
      if (response.data.success) {
        setMyCourses(response.data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching my courses:', error);
    }
  };

  const isEnrolled = (courseId) => {
    return myCourses.some(c => c.course_id === courseId);
  };

  // Get unique categories
  const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    const matchesFeatured = !showFeaturedOnly || course.is_featured === 1;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesFeatured;
  });

  const getLevelBadge = (level) => {
    const styles = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[level] || styles.beginner}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-400 to-brand-100 text-brand-500 py-16 h-[100vh] w-full flex flex-col justify-center items-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Education & Learning</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Grow in faith and knowledge through our comprehensive courses and teachings
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* My Courses Section */}
        {member && myCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <Link key={course.course_id} href={`/education/courses/${course.course_id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                  >
                    {course.thumbnail_url && (
                      <div className="h-48 bg-gray-200">
                        <img
                          src={course.thumbnail_url.startsWith('http') ? course.thumbnail_url : `${API_BASE}${course.thumbnail_url}`}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{course.progress_percentage}% Complete</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-brand-500 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress_percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {/* Featured Toggle */}
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="w-5 h-5 text-brand-500 border-gray-300 rounded"
              />
              <FaStar className="text-yellow-500" />
              <span className="text-sm font-medium">Featured Only</span>
            </label>
          </div>
        </div>

        {/* All Courses */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {showFeaturedOnly ? 'Featured Courses' : 'All Courses'}
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
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
                      {course.is_featured === 1 && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <FaStar /> Featured
                        </div>
                      )}
                      {isEnrolled(course.course_id) && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Enrolled
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        {getLevelBadge(course.level)}
                        {course.category && (
                          <span className="text-xs text-gray-500">{course.category}</span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <FaBook className="text-brand-500" />
                          <span>{course.total_lessons || 0} Lessons</span>
                        </div>
                        {course.duration_hours > 0 && (
                          <div className="flex items-center gap-2">
                            <FaClock className="text-brand-500" />
                            <span>{course.duration_hours}h</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                          <FaUsers className="text-brand-500" />
                          <span>{course.enrolled_count || 0}</span>
                        </div>
                      </div>

                      {course.instructor_name && (
                        <p className="text-xs text-gray-500 mt-3">
                          Instructor: {course.instructor_name}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
