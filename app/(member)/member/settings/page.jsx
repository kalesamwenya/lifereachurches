"use client";
import React, { useState, useEffect } from 'react';
import { Lock, Bell, Shield, Globe, Eye, EyeOff, Smartphone, Mail, MessageSquare, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = 'https://content.lifereachchurch.org';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [notifications, setNotifications] = useState({
    emailSermons: true,
    emailEvents: true,
    emailGiving: false,
    pushSermons: true,
    pushEvents: true,
    pushMessages: true,
    smsReminders: false
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showGiving: false,
    showAttendance: true
  });

  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('CAT (Central Africa Time)');

  // Fetch settings on mount
  useEffect(() => {
    if (user?.id) {
      fetchSettings();
    }
  }, [user?.id]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/members/settings.php`, {
        params: { member_id: user.id }
      });

      if (response.data.success) {
        const data = response.data.data;
        setNotifications({
          emailSermons: data.email_sermons,
          emailEvents: data.email_events,
          emailGiving: data.email_giving,
          pushSermons: data.push_sermons,
          pushEvents: data.push_events,
          pushMessages: data.push_messages,
          smsReminders: data.sms_reminders
        });
        setPrivacy({
          showProfile: data.show_profile,
          showGiving: data.show_giving,
          showAttendance: data.show_attendance
        });
        setLanguage(data.language);
        setTimezone(data.timezone);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await axios.put(`${API_URL}/members/update_settings.php`, {
        member_id: user.id,
        email_sermons: notifications.emailSermons,
        email_events: notifications.emailEvents,
        email_giving: notifications.emailGiving,
        push_sermons: notifications.pushSermons,
        push_events: notifications.pushEvents,
        push_messages: notifications.pushMessages,
        sms_reminders: notifications.smsReminders,
        show_profile: privacy.showProfile,
        show_giving: privacy.showGiving,
        show_attendance: privacy.showAttendance,
        language: language,
        timezone: timezone
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords don't match!" });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: "Password must be at least 8 characters" });
      return;
    }

    setChangingPassword(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await axios.post(`${API_URL}/members/change_password.php`, {
        member_id: user.id,
        current_password: currentPassword,
        new_password: newPassword
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setChangingPassword(false);
    }
  };

  // Auto-save settings when they change
  useEffect(() => {
    if (!loading && user?.id) {
      const timer = setTimeout(() => {
        handleSaveSettings();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [notifications, privacy, language, timezone]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={48} className="animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success/Error Message */}
      {message.text && (
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold">{message.text}</span>
        </div>
      )}

      {/* Auto-save indicator */}
      {saving && (
        <div className="bg-blue-50 text-blue-600 rounded-2xl p-4 flex items-center gap-3">
          <Loader2 size={20} className="animate-spin" />
          <span className="font-bold">Saving settings...</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and security</p>
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-3 rounded-2xl">
            <Lock size={24} className="text-orange-600" />
          </div>
          <h2 className="text-xl font-black uppercase">Account Security</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-4 pr-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">New Password</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-4 pr-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
                placeholder="Enter new password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-2">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Confirm New Password</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={changingPassword}
            className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {changingPassword ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-2xl">
            <Bell size={24} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-black uppercase">Notification Preferences</h2>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail size={18} className="text-gray-400" />
              <h3 className="font-bold text-gray-900">Email Notifications</h3>
            </div>
            <div className="space-y-3 ml-6">
              <ToggleRow 
                label="New Sermon Notifications"
                checked={notifications.emailSermons}
                onChange={() => setNotifications({...notifications, emailSermons: !notifications.emailSermons})}
              />
              <ToggleRow 
                label="Event Reminders"
                checked={notifications.emailEvents}
                onChange={() => setNotifications({...notifications, emailEvents: !notifications.emailEvents})}
              />
              <ToggleRow 
                label="Giving Receipts"
                checked={notifications.emailGiving}
                onChange={() => setNotifications({...notifications, emailGiving: !notifications.emailGiving})}
              />
            </div>
          </div>

          {/* Push Notifications */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone size={18} className="text-gray-400" />
              <h3 className="font-bold text-gray-900">Push Notifications</h3>
            </div>
            <div className="space-y-3 ml-6">
              <ToggleRow 
                label="New Sermons"
                checked={notifications.pushSermons}
                onChange={() => setNotifications({...notifications, pushSermons: !notifications.pushSermons})}
              />
              <ToggleRow 
                label="Upcoming Events"
                checked={notifications.pushEvents}
                onChange={() => setNotifications({...notifications, pushEvents: !notifications.pushEvents})}
              />
              <ToggleRow 
                label="Cell Messages"
                checked={notifications.pushMessages}
                onChange={() => setNotifications({...notifications, pushMessages: !notifications.pushMessages})}
              />
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={18} className="text-gray-400" />
              <h3 className="font-bold text-gray-900">SMS Notifications</h3>
            </div>
            <div className="space-y-3 ml-6">
              <ToggleRow 
                label="Cell Meeting Reminders"
                checked={notifications.smsReminders}
                onChange={() => setNotifications({...notifications, smsReminders: !notifications.smsReminders})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-3 rounded-2xl">
            <Shield size={24} className="text-green-600" />
          </div>
          <h2 className="text-xl font-black uppercase">Privacy Settings</h2>
        </div>

        <div className="space-y-4">
          <ToggleRow 
            label="Show my profile to other members"
            description="Allow other cell members to view your profile information"
            checked={privacy.showProfile}
            onChange={() => setPrivacy({...privacy, showProfile: !privacy.showProfile})}
          />
          <ToggleRow 
            label="Show my giving history to leaders"
            description="Allow cell leaders to view your contribution records"
            checked={privacy.showGiving}
            onChange={() => setPrivacy({...privacy, showGiving: !privacy.showGiving})}
          />
          <ToggleRow 
            label="Show my attendance status"
            description="Allow others to see your attendance in cell meetings"
            checked={privacy.showAttendance}
            onChange={() => setPrivacy({...privacy, showAttendance: !privacy.showAttendance})}
          />
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-2xl">
            <Globe size={24} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-black uppercase">Language & Region</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Language</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all font-bold text-gray-900"
            >
              <option>English</option>
              <option>Bemba</option>
              <option>Nyanja</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Timezone</label>
            <select 
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all font-bold text-gray-900"
            >
              <option>CAT (Central Africa Time)</option>
              <option>UTC</option>
              <option>EAT (East Africa Time)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-[2.5rem] p-8 border-2 border-red-100">
        <h2 className="text-xl font-black uppercase text-red-600 mb-4">Danger Zone</h2>
        <p className="text-gray-600 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all active:scale-95">
          Delete Account
        </button>
      </div>
    </div>
  );
}

// Toggle Row Component
function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
      <div className="flex-1">
        <p className="font-bold text-gray-900 text-sm">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-orange-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
