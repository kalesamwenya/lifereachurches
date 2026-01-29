"use client";
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const API_URL = 'https://content.lifereachchurch.org';
const SOCKET_URL = 'http://localhost:4000';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [notificationSound, setNotificationSound] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to chat server');
      
      // Authenticate user
      newSocket.emit('authenticate', {
        userId: user.id,
        username: `${user.firstName} ${user.lastName}`,
        token: localStorage.getItem('token')
      });
    });

    newSocket.on('authenticated', () => {
      console.log('✅ Authenticated');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from chat server');
    });

    // Handle new direct messages
    newSocket.on('new_direct_message', (messageData) => {
      console.log('💬 New message received:', messageData);
      
      setMessages(prev => ({
        ...prev,
        [messageData.channelId]: [...(prev[messageData.channelId] || []), messageData]
      }));

      // Play notification sound if not on active channel
      if (messageData.channelId !== activeChannel && notificationSound) {
        notificationSound.play().catch(err => console.log('Sound play failed:', err));
      }

      // Update unread count
      if (messageData.channelId !== activeChannel) {
        setUnreadCount(prev => prev + 1);
      }
    });

    // Handle typing indicator
    newSocket.on('user_typing', ({ channelId, username }) => {
      setIsTyping(prev => ({ ...prev, [channelId]: username }));
    });

    newSocket.on('user_stop_typing', ({ channelId }) => {
      setIsTyping(prev => {
        const updated = { ...prev };
        delete updated[channelId];
        return updated;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Load notification sound
  useEffect(() => {
    const { createNotificationSound } = require('@/utils/notificationSound');
    const audio = createNotificationSound();
    setNotificationSound(audio);
  }, []);

  // Fetch channels
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

  // Fetch messages for a channel
  const fetchMessages = useCallback(async (channelId) => {
    try {
      const response = await fetch(`${API_URL}/chat/messages.php?channel_id=${channelId}&limit=50`);
      const data = await response.json();
      
      if (data.messages) {
        setMessages(prev => ({
          ...prev,
          [channelId]: data.messages
        }));
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, []);

  // Create or get channel
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
        // Refresh channels
        await fetchChannels();
        return data.channel_id;
      }
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
    return null;
  }, [user, fetchChannels]);

  // Send message
  const sendMessage = useCallback((channelId, content, recipientId) => {
    if (!socket || !user) return;

    socket.emit('send_direct_message', {
      recipientId,
      channelId,
      message: content
    });

    // Optimistically add message to UI
    const newMessage = {
      id: Date.now(),
      channelId,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMessage]
    }));
  }, [socket, user]);

  // Typing indicators
  const startTyping = useCallback((channelId, recipientId) => {
    if (!socket) return;
    socket.emit('typing', { channelId, recipientId });
  }, [socket]);

  const stopTyping = useCallback((channelId, recipientId) => {
    if (!socket) return;
    socket.emit('stop_typing', { channelId, recipientId });
  }, [socket]);

  // Mark channel as read
  const markAsRead = useCallback((channelId) => {
    setActiveChannel(channelId);
    setUnreadCount(0);
  }, []);

  const value = {
    socket,
    messages,
    channels,
    activeChannel,
    unreadCount,
    isTyping,
    onlineUsers,
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
