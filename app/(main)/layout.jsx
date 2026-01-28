// import './globals.css';
"use client";
import React from 'react';
import Navbar from '@/components/header/Navbar';
import Footer from '@/components/footer/footer';
import { AuthProvider } from '@/context/AuthContext';
import "../globals.css";


export default function MainLayout({ children }) {
    return (
        <AuthProvider>
            <div>
            <Navbar />
            <main className="min-h-screen pt-0 pb-20 lg:pb-0">
                {children}
            </main>
            <Footer />
            </div>
        </AuthProvider>
    );
}