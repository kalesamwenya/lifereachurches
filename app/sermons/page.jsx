'use client';

import React, { useEffect, useState } from 'react';
import { Play, User, Calendar, ArrowRight } from 'lucide-react';
import { Button, SectionTitle, Card } from '../../components/UIComponents';
import { api } from '../../utils/mockData';

export default function SermonsPage() {
    const [sermons, setSermons] = useState([]);

    useEffect(() => {
        api.getSermons().then(setSermons);
    }, []);

    return (
        <div className="py-24 bg-gray-50 pt-32">
            <div className="container mx-auto px-6">
                <SectionTitle title="Sermon Archive" subtitle="Watch & Listen" />

                {/* Search/Filter Mock */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-16 flex flex-col md:flex-row gap-4 border border-gray-100">
                    <input type="text" placeholder="Search by title, series, or speaker..." className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                    <select className="px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white min-w-[200px]">
                        <option>All Series</option>
                        <option>Limitless</option>
                        <option>Community</option>
                        <option>Freedom</option>
                    </select>
                    <Button>Search</Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {sermons.map((sermon) => (
                        <Card key={sermon.id} className="group">
                            <div className="relative aspect-video overflow-hidden">
                                <img src={sermon.image} alt={sermon.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center pl-1 transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                        <Play size={28} className="text-orange-600" fill="currentColor" />
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                    {sermon.series}
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{sermon.title}</h3>
                                <p className="text-gray-500 text-sm mb-6 flex items-center gap-2">
                                    <User size={14} /> {sermon.preacher}
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <Calendar size={14} /> {sermon.date}
                                </p>
                                <div className="flex gap-3">
                                    <Button variant="secondary" className="flex-1 text-xs">Watch</Button>
                                    <Button variant="outline" className="text-gray-400 border-gray-200 hover:border-orange-500 hover:text-orange-500"><ArrowRight size={16}/></Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}