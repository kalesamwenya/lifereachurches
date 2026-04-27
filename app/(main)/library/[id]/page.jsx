import BookDetailClient from '@/components/BookDetailClient';
import React from 'react';


const API_URL = 'https://content.lifereachchurch.org';

/**
 * SERVER SIDE: Metadata & SEO
 * Fixed to await params for Next.js 15+
 */
export async function generateMetadata({ params }) {
    // UNWRAP params first
    const { id } = await params; 
    
    try {
        const res = await fetch(`${API_URL}/library/get_one.php?id=${id}`, { 
            next: { revalidate: 3600 } 
        });
        const book = await res.json();

        if (!book) return { title: 'Book Not Found | Life Reach' };

        const description = book.description?.substring(0, 160) + '...';
        const imageUrl = `${API_URL}/${book.cover_url || book.image}`;

        return {
            title: `${book.title} | Life Reach Library`,
            description: description,
            openGraph: {
                title: book.title,
                description: description,
                images: [{ url: imageUrl }],
                type: 'book',
            },
            twitter: {
                card: 'summary_large_image',
                title: book.title,
                description: description,
                images: [imageUrl],
            },
        };
    } catch (error) {
        return { title: 'Library | Life Reach Church' };
    }
}

/**
 * MAIN PAGE COMPONENT
 * Also updated to use React.use() or await for params
 */
export default async function Page({ params }) {
    // UNWRAP params first
    const { id } = await params;

    return <BookDetailClient id={id} />;
}