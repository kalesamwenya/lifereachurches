// import './globals.css';
import React from 'react';
import Navbar from '@/components/header/Navbar';
import Footer from '@/components/footer/footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import { PlayerProvider } from '@/context/PlayerContext';
import './globals.css';
export const metadata = {
    title: 'Life Reach Church',
    description: 'Reaching every soul.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="bg-white text-gray-900 font-sans selection:bg-orange-200 selection:text-orange-900">
        <PlayerProvider>
            <Navbar />
            <main className="min-h-screen pt-0 pb-20 lg:pb-0">
                {children}
            </main>
            <GlobalPlayer />
            <Footer />
        </PlayerProvider>
        </body>
        </html>
    );
}