"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCheck, Volume2, VolumeX, Hash, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = 'https://content.lifereachchurch.org';

export default function MessagesDropdown({ isOpen }) {
    const { user } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef(null);
    const previousCountRef = useRef(0);
    const pollingIntervalRef = useRef(null);

    // Load sound preference from localStorage
    useEffect(() => {
        const savedSoundPref = localStorage.getItem('member_message_sound_enabled');
        if (savedSoundPref !== null) {
            setSoundEnabled(savedSoundPref === 'true');
        }
    }, []);

    // Initialize audio element with custom notification sound
    useEffect(() => {
        try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.volume = 0.7;
            audio.preload = 'auto';
            
            audio.addEventListener('loadeddata', () => {
                console.log('✅ Member notification sound loaded successfully');
            });
            
            audio.addEventListener('error', () => {
                // Gracefully handle audio loading errors - not critical
                console.warn('⚠️ Member notification sound not available, continuing without sound');
            });
            
            audioRef.current = audio;
        } catch (error) {
            // If audio initialization fails, continue without sound
            console.warn('⚠️ Could not initialize notification sound:', error.message);
        }
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
                audioRef.current = null;
            }
        };
    }, []);

    // Fetch unread messages
    const fetchUnreadMessages = async () => {
        if (!user?.id) {
            console.log('No user ID, skipping fetch');
            return;
        }
        
        setLoading(true);
        try {
            console.log('Fetching unread messages for member_id:', user.id);
            const response = await axios.get(`${API_URL}/chat/member_unread_messages.php`, {
                params: { member_id: user.id, limit: 10 }
            });

            console.log('Unread messages response:', response.data);

            if (response.data.success) {
                const newCount = response.data.data.unread_count;
                const newMessages = response.data.data.messages;
                
                console.log('Fetched messages:', newMessages);
                
                // Play sound if count increased and sound is enabled
                if (soundEnabled && newCount > previousCountRef.current && previousCountRef.current > 0) {
                    playNotificationSound();
                }
                
                previousCountRef.current = newCount;
                setUnreadCount(newCount);
                setMessages(newMessages);
            } else {
                console.error('API returned success=false:', response.data);
            }
        } catch (error) {
            console.error('Failed to fetch unread messages:', error);
            console.error('Error details:', error.response?.data || error.message);
            console.error('Request URL:', `${API_URL}/chat/member_unread_messages.php?member_id=${user.id}`);
        } finally {
            setLoading(false);
        }
    };

    // Poll for new messages every 5 seconds
    useEffect(() => {
        if (!user?.id) return;

        console.log('🔄 Member: Starting message polling for user:', user.id);

        // Initial fetch
        fetchUnreadMessages();

        // Poll every 5 seconds
        pollingIntervalRef.current = setInterval(() => {
            fetchUnreadMessages();
        }, 5000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                console.log('🛑 Member: Stopped message polling');
            }
        };
    }, [user?.id, soundEnabled]);

    const playNotificationSound = () => {
        console.log('🔊 Attempting to play notification sound...', { 
            hasAudio: !!audioRef.current, 
            soundEnabled,
            readyState: audioRef.current?.readyState,
            networkState: audioRef.current?.networkState,
            error: audioRef.current?.error
        });
        
        if (!audioRef.current) {
            console.error('❌ Audio element not initialized');
            return;
        }
        
        if (!soundEnabled) {
            console.log('🔇 Sound is muted');
            return;
        }
        
        // Check if audio source had an error loading
        if (audioRef.current.error) {
            console.warn('⚠️ Audio source has an error, skipping playback');
            return;
        }
        
        // Check if audio is ready to play (readyState >= 2 means we have enough data)
        if (audioRef.current.readyState < 2) {
            console.warn('⚠️ Audio not ready yet, skipping playback');
            return;
        }
        
        try {
            audioRef.current.currentTime = 0;
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('✅ Notification sound played successfully');
                    })
                    .catch(err => {
                        console.error('❌ Could not play notification sound:', err.name, err.message);
                        if (err.name === 'NotAllowedError') {
                            console.log('💡 Tip: User interaction may be required first');
                        }
                    });
            }
        } catch (err) {
            console.error('❌ Audio playback error:', err);
        }
    };

    const toggleSound = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        localStorage.setItem('member_message_sound_enabled', newValue.toString());
        
        // Play test sound when enabling
        if (newValue) {
            setTimeout(() => {
                console.log('🎵 Playing test sound...');
                playNotificationSound();
            }, 100);
        }
    };

    const handleMessageClick = (message) => {
        // Mark as read and navigate to messages page
        if (user?.id && message.channel_id) {
            axios.post(`${API_URL}/chat/mark_as_read.php`, {
                user_id: user.id,
                channel_id: message.channel_id
            }).catch(err => console.error('Failed to mark as read:', err));
        }
        
        router.push(`/member/messages?channel=${message.channel_id}`);
    };

    const handleViewAll = () => {
        router.push('/member/messages');
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Messages</h3>
                    {unreadCount > 0 && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Connection Status */}
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} 
                         title={isConnected ? 'Connected to Pusher' : 'Disconnected'} />
                    
                    <button 
                        onClick={toggleSound}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        title={soundEnabled ? 'Mute notifications' : 'Unmute notifications'}
                    >
                        {soundEnabled ? (
                            <Volume2 size={16} className="text-gray-600" />
                        ) : (
                            <VolumeX size={16} className="text-gray-400" />
                        )}
                    </button>
                </div>
            </div>

            <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="text-xs mt-2">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <Mail size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-medium">No unread messages</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const channelType = msg.channel_type || 
                            (msg.channel_id?.startsWith('dm_') ? 'dm' : 
                             msg.channel_id?.startsWith('group_') ? 'group' : 'public');
                        
                        // Determine display name based on channel type
                        let displayName = '';
                        let channelName = '';
                        
                        if (channelType === 'dm') {
                            // For DMs with staff, show the staff member's name
                            displayName = msg.sender_name || `${msg.first_name || ''} ${msg.last_name || ''}`.trim() || 'Staff';
                            channelName = msg.role === 'Staff' ? 'Staff Message' : 'Direct Message';
                        } else if (channelType === 'public') {
                            // For public channels, show channel name
                            const channel = msg.channel_id === 'general' ? 'General' : 
                                          msg.channel_id === 'announcements' ? 'Announcements' : 
                                          msg.channel_id;
                            displayName = msg.sender_name || 'Unknown';
                            channelName = channel;
                        } else if (channelType === 'group') {
                            // For group channels, show sender name
                            displayName = msg.sender_name || 'Unknown';
                            channelName = msg.channel_id.replace('group_', '').replace(/_/g, ' ');
                        }
                        
                        const initials = msg.avatar || displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                        
                        // Choose icon based on channel type
                        const isChannel = channelType !== 'dm';
                        const unreadInChannel = msg.unread_count_in_channel || 1;
                        
                        return (
                            <div 
                                key={msg.id || i} 
                                onClick={() => handleMessageClick(msg)}
                                className="p-4 hover:bg-orange-50/50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 flex gap-4 group"
                            >
                                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100 group-hover:border-orange-200 transition-colors flex items-center justify-center relative ${
                                    isChannel ? 'bg-blue-100' : 'bg-orange-100'
                                }`}>
                                    {isChannel ? (
                                        channelType === 'public' ? 
                                            <Hash size={18} className="text-blue-600" /> : 
                                            <Users size={18} className="text-blue-600" />
                                    ) : (
                                        <span className="text-orange-600 font-bold text-xs">
                                            {initials}
                                        </span>
                                    )}
                                    {unreadInChannel > 1 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {unreadInChannel}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-gray-900 group-hover:text-orange-700 transition-colors truncate">
                                                    {displayName}
                                                </p>
                                                {unreadInChannel > 1 && (
                                                    <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                                                        {unreadInChannel}
                                                    </span>
                                                )}
                                            </div>
                                            {isChannel && (
                                                <p className="text-[10px] text-gray-400 font-medium truncate">
                                                    in #{channelName}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium flex-shrink-0 ml-2">
                                            {formatTime(msg.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate group-hover:text-gray-700 transition-colors">
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                <button 
                    onClick={handleViewAll}
                    className="text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors"
                >
                    View All Messages
                </button>
            </div>
        </div>
    );
}
