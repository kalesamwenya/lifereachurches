'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaDownload, FaShare, FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const API_BASE = 'https://content.lifereachchurch.org';

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/education/my_courses.php`, {
        params: { member_id: user.id }
      });
      
      // Filter for completed courses only
      const completed = Array.isArray(response.data) 
        ? response.data.filter(c => c.completed_at) 
        : [];
      
      setCertificates(completed);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
          <p className="mt-4 text-gray-600">Loading your certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 pt-[4rem] pb-[2rem]">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
        <p className="text-gray-600">Your achievements and course completions</p>
      </div>

      {/* Achievement Stats */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-400 text-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Total Certificates Earned</h2>
            <p className="text-4xl font-bold">{certificates.length}</p>
          </div>
          <FaTrophy className="text-8xl opacity-20" />
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaCertificate className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No certificates yet</h3>
          <p className="text-gray-500 mb-6">
            Complete courses to earn certificates and showcase your achievements
          </p>
          <a
            href="/education"
            className="inline-block bg-brand-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-600 transition-colors"
          >
            Browse Courses
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((course, index) => (
            <motion.div
              key={course.course_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              {/* Certificate Preview */}
              <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 p-8 border-b-4 border-amber-400">
                <div className="absolute top-4 right-4">
                  <FaTrophy className="text-4xl text-amber-500" />
                </div>
                
                <div className="text-center mt-8">
                  <FaCertificate className="mx-auto text-6xl text-amber-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.category}</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-amber-200">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Completed</span>
                    <span className="font-semibold">
                      {new Date(course.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 space-y-2">
                <button
                  className="w-full bg-brand-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
                  onClick={() => alert('Certificate download feature coming soon!')}
                >
                  <FaDownload /> Download Certificate
                </button>
                
                <button
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  onClick={() => alert('Share feature coming soon!')}
                >
                  <FaShare /> Share Achievement
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Coming Soon Features */}
      {certificates.length > 0 && (
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Download PDF certificates</li>
            <li>• Share certificates on social media</li>
            <li>• Public certificate verification</li>
            <li>• Digital badge collection</li>
          </ul>
        </div>
      )}
    </div>
  );
}
