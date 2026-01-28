"use client";
import "../globals.css";
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }) {

  return (
    <AuthProvider>
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
       </main>
    </AuthProvider>
  );
}