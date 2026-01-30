'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Book, Calendar, Mic, FileText, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const API_URL = 'https://content.lifereachchurch.org';

export default function NotificationDropdown({ isOpen }) {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/notifications/get_member_notifications.php?member_id=${user.id}`);
      
      // Debug logging
      console.log('Notifications API Response:', res.data);
      
      if (res.data.success === false) {
        console.error('API returned error:', res.data.message);
        setNotifications([]);
        return;
      }
      
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      console.error('Error details:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`${API_URL}/notifications/mark_as_read.php`, {
        notification_id: notificationId
      });
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: 1 } : n
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    const data = notification.data ? JSON.parse(notification.data) : {};
    
    switch (notification.type) {
      case 'event':
        router.push('/member/events');
        break;
      case 'blog':
        router.push(`/blog/${data.blog_id}`);
        break;
      case 'book':
        router.push('/member/books');
        break;
      case 'podcast':
        router.push(`/podcast/${data.podcast_id}`);
        break;
      case 'sermon':
        router.push('/member/sermons');
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event':
        return <Calendar size={18} className="text-blue-600" />;
      case 'blog':
        return <FileText size={18} className="text-green-600" />;
      case 'book':
        return <Book size={18} className="text-purple-600" />;
      case 'podcast':
        return <Mic size={18} className="text-orange-600" />;
      case 'sermon':
        return <Mic size={18} className="text-red-600" />;
      default:
        return <Bell size={18} className="text-gray-600" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notifDate = new Date(timestamp);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Notifications</h3>
        {notifications.some(n => n.is_read === 0) && (
          <button
            onClick={() => {
              notifications.forEach(n => {
                if (n.is_read === 0) markAsRead(n.id);
              });
            }}
            className="text-xs font-bold text-orange-600 hover:text-orange-700"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-500">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">We'll notify you when something new happens</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
                  notification.is_read === 0 ? 'bg-orange-50/30' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">
                        {notification.title}
                      </p>
                      {notification.is_read === 0 && (
                        <div className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => router.push('/member/notifications')}
            className="w-full text-center text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
