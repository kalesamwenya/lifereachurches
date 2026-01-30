'use client';

import EducationHeader from '@/components/education/EducationHeader';
import ProtectedEducationRoute from '@/components/education/ProtectedEducationRoute';
import { AuthProvider } from '@/context/AuthContext';
import '../globals.css';
import Footer from '@/components/footer/footer';

export default function EducationLayout({ children }) {
  return (
    <AuthProvider>
      <ProtectedEducationRoute>
        <div className="min-h-screen bg-gray-50">
          <EducationHeader />
          <main className="min-h-screen">
            {children}
          </main>
        </div>
        <Footer/>
      </ProtectedEducationRoute>
    </AuthProvider>
  );
}
