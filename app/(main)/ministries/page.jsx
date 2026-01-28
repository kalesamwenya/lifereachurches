'use client';

import React from 'react';
import {User, Sun, Coffee, Music, Users, BookOpen, SchoolIcon, ChurchIcon, CrossIcon} from 'lucide-react';
import { motion } from 'framer-motion';
import {BiChild, BiMask} from "react-icons/bi";

// --- Local Components & Data ---

const Card = ({ children, className = "" }) => (
    <motion.div whileHover={{ y: -5 }} className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>{children}</motion.div>
);

const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-16">
        <h3 className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-3">{subtitle}</h3>
        <h2 className="text-4xl font-extrabold text-gray-900">{title}</h2>
        <div className="h-1.5 w-24 bg-orange-600 mt-6 rounded-full"></div>
    </div>
);

const mockDepts = [
    { id: 'campus',
        name: "Campus",
        icon: <SchoolIcon size={32} />,
        description: "We are the Life Reach Church  Campus ministry,  a sect of the church that is committed to ensuring that every student experiences the power and beauty of fellowship right in the comfort of their campus.\n",
        head: ""
    },
    { id: 'cell',
        name: "Cell",
        icon: <Users size={32} />,
        description: "Life Reach Church Cell Ministry is comprised of small groups of church members that takes place during the week apart from church services. The cell ministry is primarily for fellowship and discipleship it is there for members to share the word, encourage each other and build a family culture within the church",
        head: ""
    },
    { id: 'children',
        name: "Children",
        icon: <BiChild size={32} />,
        description: "",
        head: ""
    },
    { id: 'evangelism',
        name: "Evangelism",
        icon: <ChurchIcon size={32} />,
        description: "Evangelism Ministry is one of the fundamental ministries within the body of Christ. It stands as a dedicated group that takes up the responsibility of ensuring that the souls are saved and come to the knowledge of truth, making sure that the house of God is full and make obedient disciples.",
        head: ""
    },
    { id: 'men',
        name: "Men's",
        icon: <Users size={32} />,
        description: "",
        head: ""
    },
    { id: 'prayer',
        name: "Prayer",
        icon: <CrossIcon size={32} />,
        description: "The prayer ministry exists to coordinate the prayer activities of the church, to ensure that the prayer culture is established and sustained within the church at every level.",
        head: ""
    },
    { id: 'stretch',
        name: "Stretch",
        icon: <BiMask size={32} />,
        description: "",
        head: ""
    },
];

// --------------------------------

export default function MinistriesPage() {
    return (
        <div className="py-24 bg-white pt-32">
            <div className="container mx-auto px-6">
                <SectionTitle title="Ministries" subtitle="Connect & Grow" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockDepts.map((dept, index) => (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="border border-gray-100 hover:border-orange-200 h-full">
                                <div className="p-10">
                                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                                        {dept.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{dept.name}</h3>
                                    <p className="text-gray-600 mb-8 leading-relaxed">{dept.description}</p>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 border-t border-gray-100 pt-6">
                                        <User size={16} className="text-orange-400" /> Lead: <span className="text-gray-900 font-medium">{dept.head}</span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}