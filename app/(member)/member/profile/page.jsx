"use client";
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { API_URL } from '@/lib/api-config';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/members/profile.php`, {
        params: { member_id: user.id }
      });

      if (response.data.success) {
        setUserData(response.data.data);
        setEditedData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await axios.put(`${API_URL}/members/update_profile.php`, {
        id: user.id,
        first_name: editedData.first_name,
        last_name: editedData.last_name,
        email: editedData.email,
        phone: editedData.phone,
        birthday: editedData.birthday,
        address: editedData.address,
        gender: editedData.gender,
        notes: editedData.notes
      });

      if (response.data.success) {
        setUserData(editedData);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={48} className="text-orange-600 animate-spin mb-4" />
        <p className="text-gray-500 font-bold">Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <p className="text-gray-500 font-bold">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Success/Error Message */}
      {message.text && (
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold">{message.text}</span>
        </div>
      )}

      {/* Header with Profile Picture */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative group">
            <img 
              src={userData.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"}
              className="w-32 h-32 rounded-3xl object-cover border-4 border-white/20 shadow-2xl"
              alt="Profile" 
            />
            <button className="absolute bottom-2 right-2 bg-white text-orange-600 p-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} />
            </button>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black mb-2">{userData.first_name} {userData.last_name}</h1>
            <p className="text-white/80 mb-4">{userData.notes || 'Church member'}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold">
                {userData.role || 'Member'}
              </span>
              {userData.join_date && (
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold">
                  Member since {new Date(userData.join_date).getFullYear()}
                </span>
              )}
            </div>
          </div>

          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={saving}
            className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              <>
                <Save size={18} />
                Save Profile
              </>
            ) : (
              <>
                <Edit2 size={18} />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black uppercase">Personal Information</h2>
          {isEditing && (
            <button 
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm font-bold"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">First Name</label>
            {isEditing ? (
              <input 
                type="text"
                value={editedData.first_name}
                onChange={(e) => setEditedData({...editedData, first_name: e.target.value})}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <User size={20} className="text-gray-400" />
                <span className="font-bold text-gray-900">{userData.first_name}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Last Name</label>
            {isEditing ? (
              <input 
                type="text"
                value={editedData.last_name}
                onChange={(e) => setEditedData({...editedData, last_name: e.target.value})}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <User size={20} className="text-gray-400" />
                <span className="font-bold text-gray-900">{userData.last_name}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Email Address</label>
            {isEditing ? (
              <input 
                type="email"
                value={editedData.email || ''}
                onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <Mail size={20} className="text-gray-400" />
                <span className="font-bold text-gray-900">{userData.email || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Phone Number</label>
            {isEditing ? (
              <input 
                type="tel"
                value={editedData.phone || ''}
                onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <Phone size={20} className="text-gray-400" />
                <span className="font-bold text-gray-900">{userData.phone || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Date of Birth</label>
            {isEditing ? (
              <input 
                type="date"
                value={editedData.birthday || ''}
                onChange={(e) => setEditedData({...editedData, birthday: e.target.value})}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <Calendar size={20} className="text-gray-400" />
                <span className="font-bold text-gray-900">
                  {userData.birthday ? new Date(userData.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided'}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Gender</label>
            {isEditing ? (
              <select
                value={editedData.gender || ''}
                onChange={(e) => setEditedData({...editedData, gender: e.target.value})}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <User size={20} className="text-gray-400" />
                <span className="font-bold text-gray-900">{userData.gender || 'Not specified'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Address</label>
            {isEditing ? (
              <input 
                type="text"
                value={editedData.address || ''}
                onChange={(e) => setEditedData({...editedData, address: e.target.value})}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <MapPin size={20} className="text-gray-400" />
                <span className="font-bold text-gray-900">{userData.address || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Membership Status</label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                userData.membership_status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {userData.membership_status}
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Bio / Notes</label>
            {isEditing ? (
              <textarea 
                value={editedData.notes || ''}
                onChange={(e) => setEditedData({...editedData, notes: e.target.value})}
                rows={3}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-600 outline-none transition-all resize-none"
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-2xl">
                <span className="text-gray-900">{userData.notes || 'No bio provided'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ministry Information */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100">
        <h2 className="text-xl font-black uppercase mb-6">Ministry Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-orange-50 p-6 rounded-2xl">
            <p className="text-xs font-bold uppercase text-orange-600 mb-2">Member Type</p>
            <p className="text-2xl font-black text-gray-900">{userData.member_type || 'Regular'}</p>
            <p className="text-sm text-gray-600 mt-1">Role: {userData.role || 'Member'}</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl">
            <p className="text-xs font-bold uppercase text-blue-600 mb-2">Member Since</p>
            <p className="text-2xl font-black text-gray-900">
              {userData.join_date ? new Date(userData.join_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
            </p>
            {userData.join_date && (
              <p className="text-sm text-gray-600 mt-1">
                {Math.floor((new Date() - new Date(userData.join_date)) / (1000 * 60 * 60 * 24 * 365))} years of fellowship
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
