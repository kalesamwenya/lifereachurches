// import './globals.css';
import React from 'react';
import "./globals.css";
import { SessionProvider } from '@/components/SessionProvider';
import { AppProviders } from '@/context/AppProviders';

// --- Global SEO Configuration ---
export const viewport = {
    themeColor: '#ea580c', // Matches orange-600
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export const metadata = {
    metadataBase: new URL('https://lifereachchurch.org'), // Replace with actual domain in production
    title: {
        default: 'Life Reach Church | Reaching Every Soul',
        template: '%s | Life Reach Church',
    },
    description: 'Welcome to Life Reach Church in Lusaka, Zambia. We exist to reach the lost, raise disciples, and release leaders. Join us for authentic community and powerful worship.',
    keywords: ['Church in Lusaka', 'Zambia Church', 'Life Reach', 'Sermons', 'Christianity', 'Worship', 'Community', 'Bible Study', 'Youth Ministry'],
    authors: [{ name: 'Life Reach Media Team' }],
    creator: 'Life Reach Church',
    publisher: 'Life Reach Church',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    // Open Graph (Facebook, LinkedIn, WhatsApp)
    openGraph: {
        title: 'Life Reach Church | Reaching Every Soul',
        description: 'We are a movement dedicated to showing the world that Jesus is alive. Join us for Sunday services at 9AM & 11AM.',
        url: 'https://lifereachchurch.org',
        siteName: 'Life Reach Church',
        locale: 'en_US', // or 'en_ZM'
        type: 'website',
        images: [
            {
                url: '/imgs/SHIFT2025-212.jpg',
                width: 1200,
                height: 630,
                alt: 'Life Reach Church Worship Service',
            },
        ],
    },
    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        title: 'Life Reach Church',
        description: 'Reaching the lost, Raising disciples, and Releasing leaders. Join the movement.',
        images: ['/imgs/SHIFT2025-212.jpg'],
        creator: '@lifereachchurch',
    },
    // Search Engine Crawlers
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/logo.png', // Points to app/icon.png or public/icon.png
        apple: '/logo.png',
    },
    manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="bg-white text-gray-900 font-sans selection:bg-orange-200 selection:text-orange-900">
            <SessionProvider>
                <AppProviders>
                    {children}
                </AppProviders>
            </SessionProvider>
        </body>
        </html>
    );
}