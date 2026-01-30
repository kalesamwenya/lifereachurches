'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BookReader from '@/components/BookReader';
import axios from 'axios';
import { FaArrowLeft, FaBook, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

const API_BASE = 'https://content.lifereachchurch.org';

export default function CourseMaterialReader() {
  const { user: member } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { id: courseId, materialId } = params;

  const [material, setMaterial] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readerOpen, setReaderOpen] = useState(false);

  useEffect(() => {
    if (!member) {
      router.push('/auth?callbackUrl=/education/courses/' + courseId);
      return;
    }
    fetchMaterial();
  }, [materialId, member]);

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseRes = await axios.get(`${API_BASE}/education/courses/get_one.php`, {
        params: { course_id: courseId }
      });
      
      if (courseRes.data.success) {
        setCourse(courseRes.data.course);
      }

      // Fetch material details
      const materialRes = await axios.get(`${API_BASE}/education/materials/get_one.php`, {
        params: { material_id: materialId }
      });
      
      if (materialRes.data.success) {
        setMaterial(materialRes.data.material);
        setReaderOpen(true); // Auto-open reader
      }
    } catch (error) {
      console.error('Error fetching material:', error);
      alert('Failed to load reading material');
      router.push(`/education/courses/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-brand-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Loading reading material...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBook className="text-gray-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Material Not Found</h2>
          <Link
            href={`/education/courses/${courseId}`}
            className="text-brand-500 hover:underline flex items-center gap-2 justify-center mt-4"
          >
            <FaArrowLeft /> Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navigation Bar */}
      <div className="bg-white border-b sticky top-16 z-40 ">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href={`/education/courses/${courseId}`}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-500 transition-colors"
          >
            <FaArrowLeft />
            <span className="font-medium">Back to Course</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">{material.title}</h1>
            <p className="text-sm text-gray-500">{course?.title}</p>
          </div>

          <div className="w-32"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* BookReader Component */}
      <BookReader
        book={{
          id: material.id,
          title: material.title,
          author: course?.instructor_name || 'Course Instructor',
          cover_url: material.cover_image || course?.thumbnail_url,
          file_url: material.file_url, // PDF URL
          description: material.description,
          type: material.type || 'pdf', // pdf, epub, etc
          course_id: courseId,
          material_id: materialId
        }}
        isOpen={readerOpen}
        onClose={() => {
          setReaderOpen(false);
          router.push(`/education/courses/${courseId}`);
        }}
        userId={member.id}
      />
    </>
  );
}
