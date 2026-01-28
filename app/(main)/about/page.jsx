'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, MapPin, Users, BookOpen, Shield, Gift } from 'lucide-react';

// --- Local Components (Inlined for consistency) ---

const SectionTitle = ({ title, subtitle, centered = true }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-16 ${centered ? 'text-center' : ''}`}
    >
        <h3 className="font-bold uppercase tracking-widest text-sm mb-3 text-orange-600">{subtitle}</h3>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900">{title}</h2>
        <div className={`h-1.5 w-24 bg-orange-600 mt-6 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
    </motion.div>
);

const Card = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);

// --- Mock Data ---

const values = [
    { title: "Biblical Authority", desc: "We believe the Bible is the inspired Word of God and our final authority.", icon: <BookOpen className="text-orange-600" size={32} /> },
    { title: "Authentic Community", desc: "We are better together. We prioritize real relationships over religious performance.", icon: <Users className="text-orange-600" size={32} /> },
    { title: "Extravagant Generosity", desc: "We give because He gave. Generosity is our privilege, not just our duty.", icon: <Gift className="text-orange-600" size={32} /> },
    { title: "Servant Leadership", desc: "We lead by serving others, just as Jesus washed the feet of His disciples.", icon: <Shield className="text-orange-600" size={32} /> },
];

const team = [
    { name: "Mary Poppins", role: "Reach Kids Director", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
    { name: "Mike Chang", role: "Apex Youth Pastor", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
    { name: "David Psalm", role: "Worship Pastor", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
    { name: "Sarah Connect", role: "Groups Director", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
];

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Header / Hero */}
            <div className="relative h-[400px] flex items-center justify-center bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-40"></div>
                <div className="relative z-10 text-center text-white px-6 mt-16">
                    <h1 className="text-5xl md:text-7xl font-black mb-4">Our Story</h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto">Discover the heart, history, and vision behind Life Reach Church.</p>
                </div>
            </div>

            <div className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    {/* About Section */}
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-orange-600 font-bold uppercase tracking-widest mb-2">Since 2018</h3>
                            <h2 className="text-4xl font-black text-gray-900 mb-6">More Than Just Sunday</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                Life Reach Church started in a living room with 12 people and a dream to reach our city. We realized that church wasn't about a building, but about a people passionate for God.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Today, we are a diverse family of believers united by one mission: to know Jesus and make Him known. Whether you are young or old, single or married, there is a place for you here.
                            </p>
                            <div className="flex gap-4">
                                <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-32">
                                    <div className="text-3xl font-black text-orange-600 mb-1">6+</div>
                                    <div className="text-xs uppercase font-bold text-gray-400">Years</div>
                                </div>
                                <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-32">
                                    <div className="text-3xl font-black text-orange-600 mb-1">500+</div>
                                    <div className="text-xs uppercase font-bold text-gray-400">Members</div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-orange-500/20 rounded-3xl transform rotate-3"></div>
                            <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800" alt="Community" className="rounded-3xl shadow-2xl relative z-10 w-full" />
                        </motion.div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mb-32">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white p-12 rounded-3xl shadow-xl border-l-8 border-orange-500"
                        >
                            <Sun className="text-orange-500 mb-6" size={48} />
                            <h3 className="text-3xl font-bold mb-4 text-gray-900">Our Vision</h3>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                "To be a beacon of hope, reaching every soul with the transformative love of Christ, creating a city where no one walks alone."
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gray-900 p-12 rounded-3xl shadow-xl border-r-8 border-orange-500 text-white"
                        >
                            <MapPin className="text-orange-500 mb-6" size={48} />
                            <h3 className="text-3xl font-bold mb-4 text-white">Our Mission</h3>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                "We exist to <span className="text-orange-500 font-bold">Reach</span> the lost, <span className="text-orange-500 font-bold">Raise</span> disciples, and <span className="text-orange-500 font-bold">Release</span> leaders into their God-given destiny."
                            </p>
                        </motion.div>
                    </div>

                    {/* Core Values */}
                    <SectionTitle title="What We Believe" subtitle="Our Core Values" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                        {values.map((val, idx) => (
                            <Card key={idx} className="p-8 text-center h-full">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    {val.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-3">{val.title}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{val.desc}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Senior Pastor Section */}
                    <div className="mb-32">
                        <SectionTitle title="Our Leadership" subtitle="Senior Pastor" />
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
                            <div className="grid md:grid-cols-2">
                                <div className="h-[500px] md:h-auto relative">
                                    <img
                                        src="/imgs/pastor.png"
                                        alt="Pastor Gomezyo Shamane"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:hidden"></div>
                                </div>
                                <div className="p-12 md:p-20 flex flex-col justify-center text-white">
                                    <h3 className="text-orange-500 font-bold uppercase tracking-widest mb-2">Senior Pastor</h3>
                                    <h2 className="text-4xl md:text-5xl font-black mb-6">Gomezyo Shamane</h2>
                                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                        Prophet Gomezyo Shamane is the founder and senior pastor of Life Reach Church. Born on the 12th of January, he grew up and completed his primary and secondary education in Lusaka, Zambia. He is married to Mrs Stacy Shamane who is a co-labourer in the gospel.
                                    </p>
                                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                        Prophet Gomezyo Shamane is an auditor by profession as well as an entrepreneur in different industries. He is also currently pursuing his degree in Ministries and Theology.
                                    </p>
                                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                        As a minister of the gospel, he is passionate about reaching out to many lives and utilizes various platforms to achieve this including the successful release of books he has authored. Beautiful vs Beauty-fool, The Warrior Within and 5 volumes of a devotional book called The Word-full are Power-full are pieces of literature that deliver uncompromising biblical truths which have encouraged many to walk in their identity and grow in the knowledge of God. Furthermore, all his sermons are available as podcasts on listening platforms including but not limited to Google podcasts and Apple podcasts.
                                    </p>
                                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                        Among other gifts, music plays a vital role in his ministry which is to minister to the heart of God and futher reach out to bless the lives of people. The creation of GNS (Gomezyo Nesher Shamane) music saw to the release of the single ‘Your Glory’. In addition to this, Prophet and Mrs Shamane, collectively known as The Shays, released the singles ‘Ichebo Chenu’, ‘Perfect Bride’ and 'Oh my Soul'. The Shays also have a YouTube channel on which the video of the acoustic version of Ichebo Chenu and the Lyric video of Oh my soul is available.
                                    </p>
                                    <div className="flex gap-4">
                                        <button className="text-orange-500 font-bold hover:text-white transition-colors">Follow on Instagram</button>
                                        <button className="text-orange-500 font-bold hover:text-white transition-colors">Listen to Podcast</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Department Heads */}
                    <SectionTitle title="Ministry Directors" subtitle="Our Team" />
                    <div className="grid md:grid-cols-4 gap-8">
                        {team.map((member, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="group"
                            >
                                <div className="rounded-2xl overflow-hidden mb-6 shadow-lg border border-gray-100 relative">
                                    <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                    <img src={member.img} alt={member.name} className="w-full h-80 object-cover" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 text-center">{member.name}</h4>
                                <p className="text-orange-600 font-medium text-sm text-center uppercase tracking-wide">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}