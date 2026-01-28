"use client";
import React, { useState, useEffect } from 'react';
import { Bell, Mail, User, Settings, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';
import MessagesDropdown from '@/components/MessagesDropdown';
import NotificationDropdown from '@/components/NotificationDropdown';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';
import { API_URL } from '@/lib/api-config';

const DropdownWrapper = ({ title, icon: Icon, children, isOpen, onClick, badge }) => (
  <div className="relative">
    <button 
      onClick={(e) => onClick(e)} 
      className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 relative"
    >
      <Icon size={22} />
      {badge > 0 && (
        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-orange-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
    {isOpen && children}
  </div>
);

export default function Header({ isSidebarOpen, onToggleSidebar, activeDropdown, toggleDropdown }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useChat();
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchNotificationCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotificationCount = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications/get_member_notifications.php?member_id=${user.id}`);
      setNotificationCount(res.data.unread_count || 0);
    } catch (err) {
      console.error('Failed to fetch notification count:', err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 px-6 flex items-center justify-between shrink-0">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white shadow-lg relative">
          <Image
            src="/logo.png"
            fill={true}
            className="object-contain"
            alt="life reach church logo"
          />
        </div>
        <span className="font-black text-xl tracking-tighter uppercase hidden sm:block">Life Reach</span>
      </Link>

      <div className="flex items-center gap-2 md:gap-4">
        <DropdownWrapper 
          title="Messages" 
          icon={Mail} 
          isOpen={activeDropdown === 'messages'} 
          onClick={(e) => toggleDropdown(e, 'messages')}
          badge={unreadCount}
        >
          <MessagesDropdown isOpen={activeDropdown === 'messages'} />
        </DropdownWrapper>

        <DropdownWrapper 
          title="Notifications" 
          icon={Bell} 
          isOpen={activeDropdown === 'notifs'} 
          onClick={(e) => toggleDropdown(e, 'notifs')}
          badge={notificationCount}
        >
          <NotificationDropdown isOpen={activeDropdown === 'notifs'} />
        </DropdownWrapper>

        <div className="h-8 w-px bg-gray-100 mx-1 md:mx-2"></div>

    

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={(e) => toggleDropdown(e, 'profile')}
            className="flex items-center gap-2 md:gap-3 p-1 pr-3 hover:bg-gray-50 rounded-2xl transition-all"
          >
            <img 
              src={user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
              className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover" 
              alt="User" 
            />
            <div className="hidden lg:block text-left leading-none">
              <p className="text-sm font-black text-gray-900">
                {user ? `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() : 'Loading...'}
              </p>
              <p className="text-[10px] text-orange-600 font-bold uppercase tracking-tighter">{user?.role || 'Member'}</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          
          {activeDropdown === 'profile' && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
              <button 
                onClick={() => router.push('/member/profile')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <User size={18}/> My Profile
              </button>
              <button 
                onClick={() => router.push('/member/settings')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Settings size={18}/> Settings
              </button>
              <hr className="my-2 border-gray-50" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
              >
                <LogOut size={18}/> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Sidebar Toggle */}
        <button onClick={(e) => onToggleSidebar(e)} className="p-2 ml-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}