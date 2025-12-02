'use client';

import React from 'react';
import { Calendar, User, Share2, Facebook, Twitter, ArrowLeft } from 'lucide-react';

export default function BlogPost() {
    return (
        <div className="bg-white pt-32 pb-24">
            {/* Hero Image */}
            <div className="h-[400px] md:h-[500px] w-full relative">
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container mx-auto px-6 text-center text-white">
                        <span className="bg-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">Devotional</span>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-4xl mx-auto leading-tight">Finding Peace in a Chaotic World</h1>
                        <div className="flex items-center justify-center gap-6 text-sm md:text-base font-medium">
                            <span className="flex items-center gap-2"><User size={18} /> Sarah Jenkins</span>
                            <span className="flex items-center gap-2"><Calendar size={18} /> Oct 24, 2023</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-3xl -mt-20 relative z-10">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl">
                    <article className="prose prose-lg prose-orange mx-auto text-gray-600 leading-relaxed">
                        <p className="lead text-xl text-gray-900 font-medium mb-8">
                            In a world that never stops moving, finding true stillness can feel impossible. Yet, it is in the quiet moments that God often speaks the loudest.
                        </p>
                        <p className="mb-6">
                            We live in an age of constant notification. Our phones buzz, our emails pile up, and the demands of life pull us in a thousand different directions. It’s easy to feel overwhelmed, anxious, and disconnected from the source of our peace. But Jesus offers us a different way.
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">The Invitation to Rest</h3>
                        <p className="mb-6">
                            In Matthew 11:28, Jesus says, "Come to me, all you who are weary and burdened, and I will give you rest." Notice that He doesn't offer a strategy for time management or a hack for productivity. He offers Himself. Peace is not a place; it's a person.
                        </p>
                        <blockquote className="border-l-4 border-orange-500 pl-6 italic text-gray-800 my-8 bg-gray-50 py-4 pr-4 rounded-r-xl">
                            "Peace is not the absence of trouble, but the presence of Christ."
                        </blockquote>
                        <p className="mb-6">
                            When we prioritize His presence over our performance, everything changes. The chaos may still be there, but it no longer has the power to consume us.
                        </p>
                    </article>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                        <a href="/blog" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold transition-colors">
                            <ArrowLeft size={20} /> Back to Blog
                        </a>
                        <div className="flex gap-4">
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"><Facebook size={18} /></button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-sky-500 hover:text-white transition-colors"><Twitter size={18} /></button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-800 hover:text-white transition-colors"><Share2 size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}