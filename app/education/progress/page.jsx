'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaChartLine, FaClock, FaBook, FaAward, FaFire } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const API_BASE = 'https://content.lifereachchurch.org';

export default function ProgressPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      // Fetch user's learning statistics
      const response = await axios.get(`${API_BASE}/education/my_courses.php`, {
        params: { member_id: user.id }
      });
      
      const courses = Array.isArray(response.data) ? response.data : [];
      
      // Calculate statistics
      const totalCourses = courses.length;
      const completedCourses = courses.filter(c => c.completed_at).length;
      const inProgressCourses = courses.filter(c => !c.completed_at && c.progress_percentage > 0).length;
      const totalLessons = courses.reduce((sum, c) => sum + (c.total_lessons || 0), 0);
      const completedLessons = courses.reduce((sum, c) => sum + (c.completed_lessons || 0), 0);
      const totalHours = courses.reduce((sum, c) => sum + (c.duration_hours || 0), 0);
      const completionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

      setStats({
        totalCourses,
        completedCourses,
        inProgressCourses,
        totalLessons,
        completedLessons,
        totalHours,
        completionRate,
        courses
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
          <p className="mt-4 text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 pt-[4rem] pb-[4rem]">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Progress</h1>
        <p className="text-gray-600">Track your learning achievements and milestones</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-brand-600 to-brand-400 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">Completion Rate</p>
              <p className="text-4xl font-bold">{stats?.completionRate || 0}%</p>
            </div>
            <FaTrophy className="text-5xl opacity-30" />
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${stats?.completionRate || 0}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Courses</p>
              <p className="text-4xl font-bold text-green-600">{stats?.completedCourses || 0}</p>
              <p className="text-xs text-gray-500 mt-1">of {stats?.totalCourses || 0} enrolled</p>
            </div>
            <FaAward className="text-5xl text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Study Time</p>
              <p className="text-4xl font-bold text-purple-600">{stats?.totalHours || 0}</p>
              <p className="text-xs text-gray-500 mt-1">hours</p>
            </div>
            <FaClock className="text-5xl text-purple-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaFire className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.inProgressCourses || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaBook className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lessons Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.completedLessons || 0}/{stats?.totalLessons || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-2xl text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Learning Streak</p>
              <p className="text-2xl font-bold text-gray-900">0 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Course Details</h2>
        
        {stats?.courses && stats.courses.length > 0 ? (
          <div className="space-y-6">
            {stats.courses.map((course) => (
              <div key={course.course_id} className="border-b pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.category}</p>
                  </div>
                  {course.completed_at && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaTrophy /> Completed
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {course.progress_percentage || 0}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      course.completed_at ? 'bg-green-500' : 'bg-brand-500'
                    }`}
                    style={{ width: `${course.progress_percentage || 0}%` }}
                  />
                </div>
                
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <span>
                    {course.completed_lessons || 0} of {course.total_lessons || 0} lessons
                  </span>
                  {course.duration_hours && <span>{course.duration_hours} hours</span>}
                  {course.completed_at && (
                    <span>Completed on {new Date(course.completed_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500">No course progress yet. Start learning today!</p>
          </div>
        )}
      </div>
    </div>
  );
}
