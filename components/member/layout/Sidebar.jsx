"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, User, Heart, PlayCircle, BookOpen, Settings, Users, X, MessageSquare, Calendar, GraduationCap
} from 'lucide-react';

export default function Sidebar({ open, setOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/member/" },
    { icon: MessageSquare, label: "Messages", href: "/member/messages" },
    { icon: Calendar, label: "Events", href: "/member/events" },
    { icon: GraduationCap, label: "Education", href: "/education" },
    { icon: User, label: "Profile", href: "/member/profile" },
    { icon: Heart, label: "Giving & Tithes", href: "/member/giving" },
    { icon: PlayCircle, label: "Sermon Reviews", href: "/member/sermons" },
    { icon: BookOpen, label: "Book Reading", href: "/member/books" },
    { icon: Settings, label: "Settings", href: "/member/settings" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden" 
          onClick={() => setOpen(false)} 
        />
      )}

      <aside className={`
        bg-white border-l border-gray-100 flex-shrink-0 transition-all duration-300 ease-in-out
        /* Mobile: Fixed on the right */
        fixed inset-y-0 right-0 z-50 w-72 transform ${open ? 'translate-x-0' : 'translate-x-full'}
        /* Desktop: Relative margin on the right */
        lg:relative lg:translate-x-0 ${open ? 'lg:w-72 opacity-100' : 'lg:w-0 lg:opacity-0 lg:overflow-hidden lg:border-none'}
      `}>
        
        {/* Header with Close Button (No Logo) */}
        <div className="h-20 flex items-center justify-end px-6 border-b border-gray-50">
          <button 
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
            title="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="p-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => window.innerWidth < 1024 && setOpen(false)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                    : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <Icon 
                  size={20} 
                  className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-600'} 
                />
                <span className="font-bold text-sm uppercase tracking-wide whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Cell Info Section */}
        <div className="absolute bottom-10 left-6 right-6">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex gap-3 items-center whitespace-nowrap">
              <div className="bg-orange-100 p-2 rounded-xl">
                <Users size={18} className="text-orange-600" />
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900 uppercase">Apex Youth</p>
                <p className="text-[10px] text-gray-500">Manda Hill Cell</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}