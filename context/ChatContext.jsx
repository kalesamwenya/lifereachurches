"use client";
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const API_URL = 'https://content.lifereachchurch.org';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState({});
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState({});
  const [notificationSound, setNotificationSound] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { createNotificationSound } = require('@/utils/notificationSound');
      const audio = createNotificationSound();
      setNotificationSound(audio);
    }
  }, []);

  const fetchChannels = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/chat/channels.php?user_id=${user.id}`);
      const data = await response.json();
      if (data.channels) {
        setChannels(data.channels);
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  }, [user]);

  const fetchMessages = useCallback(async (channelId) => {
    try {
      const response = await fetch(`${API_URL}/chat/messages.php?channel_id=${channelId}&limit=50`);
      const data = await response.json();
      if (data.messages) {
        setMessages(prev => ({ ...prev, [channelId]: data.messages }));
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, []);

  const createChannel = useCallback(async (recipientId, recipientName) => {
    if (!user) return null;
    try {
      const response = await fetch(`${API_URL}/chat/channels.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user1_id: user.id,
          user2_id: recipientId,
          type: 'dm',
          name: recipientName
        })
      });
      const data = await response.json();
      if (data.channel_id) {
        await fetchChannels();
        return data.channel_id;
      }
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
    return null;
  }, [user, fetchChannels]);

  const sendMessage = useCallback(() => {}, []);
  const startTyping = useCallback(() => {}, []);
  const stopTyping = useCallback(() => {}, []);
  const markAsRead = useCallback((channelId) => {
    setActiveChannel(channelId);
    setUnreadCount(0);
  }, []);

  const value = {
    messages,
    channels,
    activeChannel,
    setActiveChannel,
    unreadCount,
    setUnreadCount,
    isTyping,
    fetchChannels,
    fetchMessages,
    createChannel,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
