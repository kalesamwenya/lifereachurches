"use client";
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Check, Loader2, Heart, DollarSign, Calendar, TrendingUp, BookOpen, Bell, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api-config';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/members/dashboard.php`, {
        params: { member_id: user.id }
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={48} className="animate-spin text-orange-600" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-8xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Welcome back, {user?.first_name || user?.firstName}! 👋
          </h1>
          <p className="text-white/80 text-lg">
            {dashboardData.member.membership_duration.years > 0 
              ? `${dashboardData.member.membership_duration.years} year${dashboardData.member.membership_duration.years > 1 ? 's' : ''} of faithful service` 
              : `${dashboardData.member.membership_duration.months} month${dashboardData.member.membership_duration.months > 1 ? 's' : ''} with us`}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Giving"
          value={`K ${dashboardData.giving.total_given.toLocaleString()}`}
          subtitle={dashboardData.giving.level}
          icon={Heart}
          colorClass="bg-pink-50 text-pink-600"
          onClick={() => router.push('/member/giving')}
        />
        <StatCard
          title="This Month"
          value={`K ${dashboardData.giving.this_month.toLocaleString()}`}
          subtitle={`${dashboardData.giving.total_donations} contributions`}
          icon={DollarSign}
          colorClass="bg-orange-50 text-orange-600"
          onClick={() => router.push('/member/giving')}
        />
        <StatCard
          title="Books Reading"
          value={`${dashboardData.reading.books_reading}`}
          subtitle={`${dashboardData.reading.books_completed} completed`}
          icon={BookOpen}
          colorClass="bg-red-50 text-red-600"
          onClick={() => router.push('/member/books')}
        />
        <StatCard
          title="Notifications"
          value={`${dashboardData.notifications.unread_count}`}
          subtitle="Unread messages"
          icon={Bell}
          colorClass="bg-orange-50 text-orange-600"
          badge={dashboardData.notifications.unread_count}
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <QuickActionButton
                title="Give Now"
                description="Make a contribution"
                icon={Heart}
                color="bg-gradient-to-br from-pink-600 to-pink-700"
                onClick={() => router.push('/member/giving')}
              />
              <QuickActionButton
                title="Read Books"
                description="Continue reading"
                icon={BookOpen}
                color="bg-gradient-to-br from-orange-600 to-red-600"
                onClick={() => router.push('/member/books')}
              />
              <QuickActionButton
                title="My Profile"
                description="Update information"
                icon={Star}
                color="bg-gradient-to-br from-orange-500 to-orange-600"
                onClick={() => router.push('/member/profile')}
              />
              <QuickActionButton
                title="Events"
                description="View upcoming events"
                icon={Calendar}
                color="bg-gradient-to-br from-red-600 to-red-700"
                onClick={() => router.push('/events')}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">Recent Activity</h3>
              <button 
                onClick={() => router.push('/member/giving')}
                className="text-orange-600 font-bold text-sm hover:underline flex items-center gap-1"
              >
                View All <ArrowRight size={16} />
              </button>
            </div>
            
            {dashboardData.recent_activity.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recent_activity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
                      <Heart size={20} className="text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">K {parseFloat(activity.value).toLocaleString()} Contribution</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-bold">
                      {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">No recent activity</p>
                <p className="text-sm text-gray-400 mt-2">Your contributions will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Stats Summary */}
        <div className="space-y-8">
          {/* Giving Summary */}
          <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-[2.5rem] p-8 text-white">
            <h3 className="text-xl font-black mb-4">Giving Summary</h3>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                <p className="text-sm text-white/80 mb-1">Total Contributions</p>
                <p className="text-3xl font-black">K {dashboardData.giving.total_given.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                <p className="text-sm text-white/80 mb-1">This Month</p>
                <p className="text-2xl font-black">K {dashboardData.giving.this_month.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <span className="text-sm font-bold">Partnership Level</span>
                <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-black">
                  {dashboardData.giving.level}
                </span>
              </div>
            </div>
            <button 
              onClick={() => router.push('/member/giving')}
              className="w-full mt-6 bg-white text-pink-600 py-4 rounded-2xl font-black hover:bg-pink-50 transition-all active:scale-[0.98]"
            >
              View Giving History
            </button>
          </div>

          {/* Reading Progress */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6">Reading Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
                <div>
                  <p className="text-sm text-gray-500">Books Reading</p>
                  <p className="text-2xl font-black text-gray-900">{dashboardData.reading.books_reading}</p>
                </div>
                <BookOpen size={32} className="text-orange-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-black text-gray-900">{dashboardData.reading.books_completed}</p>
                </div>
                <Check size={32} className="text-green-600" />
              </div>
            </div>
            <button 
              onClick={() => router.push('/member/books')}
              className="w-full mt-6 bg-gradient-to-br from-orange-600 to-red-600 text-white py-4 rounded-2xl font-black hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Browse Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon: Icon, colorClass, onClick, badge }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-[2.5rem] p-6 border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center relative`}>
          <Icon size={24} />
          {badge > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </div>
      </div>
      <h3 className="text-3xl font-black text-gray-900 mb-1">{value}</h3>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({ title, description, icon: Icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white p-6 rounded-2xl hover:opacity-90 transition-all active:scale-[0.98] text-left`}
    >
      <Icon size={32} className="mb-4" />
      <h4 className="font-black text-lg mb-1">{title}</h4>
      <p className="text-sm text-white/80">{description}</p>
    </button>
  );
}