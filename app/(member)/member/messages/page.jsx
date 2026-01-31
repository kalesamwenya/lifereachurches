"use client";
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePusher } from '@/context/PusherContext';
import axios from 'axios';
import { Search, Send, Phone, Video, MoreVertical, Smile, Paperclip, MessageSquare, Users, Hash, ArrowLeft } from 'lucide-react';

const API_URL = 'https://content.lifereachchurch.org';

export default function MessagesPage() {
  const { user } = useAuth();
  const { subscribe, unsubscribe, isConnected } = usePusher();
  const [channels, setChannels] = useState({ public: [], groups: [], dms: [] });
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch channels for this member
  useEffect(() => {
    if (!user?.id) return;

    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/chat/member_channels.php`, {
          params: { member_id: user.id }
        });

        if (response.data) {
          setChannels({
            public: response.data.publicChannels || [],
            groups: response.data.myGroups || [],
            dms: response.data.directMessages || []
          });
          
          // Auto-select general channel
          if (response.data.publicChannels && response.data.publicChannels.length > 0) {
            setSelectedChannel(response.data.publicChannels[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch channels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [user, API_URL]);

  // Subscribe to Pusher for real-time messages
  useEffect(() => {
    if (!isConnected || !user?.id || !selectedChannel) return;

    console.log('📡 Subscribing to channel:', selectedChannel.id);

    const channelName = `presence-chat-${selectedChannel.id}`;
    
    const channel = subscribe(channelName, {
      'new-message': (data) => {
        console.log('💬 New message received:', data);
        
        // Fetch fresh messages
        fetchMessagesForChannel(selectedChannel.id);
      },
      'typing': (data) => {
        if (data.user_id !== user.id) {
          setIsTyping(prev => ({ ...prev, [selectedChannel.id]: data.user_name }));
          
          setTimeout(() => {
            setIsTyping(prev => {
              const updated = { ...prev };
              delete updated[selectedChannel.id];
              return updated;
            });
          }, 3000);
        }
      }
    });

    return () => {
      unsubscribe(channelName);
    };
  }, [isConnected, user?.id, selectedChannel, subscribe, unsubscribe]);

  const fetchMessagesForChannel = async (channelId) => {
    try {
      const response = await axios.get(`${API_URL}/chat/member_messages.php`, {
        params: { 
          channel_id: channelId,
          member_id: user.id
        }
      });

      if (response.data.messages) {
        setMessages(prev => ({
          ...prev,
          [channelId]: response.data.messages
        }));
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // Fetch messages when channel changes
  useEffect(() => {
    if (!selectedChannel || !user) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/chat/member_messages.php`, {
          params: { 
            channel_id: selectedChannel.id,
            member_id: user.id
          }
        });

        if (response.data.messages) {
          setMessages(prev => ({
            ...prev,
            [selectedChannel.id]: response.data.messages
          }));
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, [selectedChannel, user, API_URL]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChannel]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChannel || !isConnected) return;

    const firstName = user.first_name || user.firstName || '';
    const lastName = user.last_name || user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Member';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'M';

    // Optimistically add message to UI
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      channel_id: selectedChannel.id,
      sender_id: user.id,
      sender_name: fullName,
      content: messageInput,
      avatar: initials,
      created_at: new Date().toISOString(),
      isOptimistic: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedChannel.id]: [...(prev[selectedChannel.id] || []), optimisticMessage]
    }));

    // Send via WebSocket
    wsSeave to database and trigger Pusher
    try {
      await axios.post(`${API_URL}/chat/send_message.php`, {
        channel_id: selectedChannel.id,
        sender_id: user.id,
        content: messageInput
      });
      
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('Failed to save message:', error);
    }

    setMessageInput('');
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);

    if (selectedChannel && isConnected) {
      const fullName = `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || 'Member';
      
      // Trigger typing event via Pusher channel event
      // Note: This would need to be implemented as a client event on presence channel
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        // Stop typing0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const allChannels = [
    ...channels.public.map(c => ({ ...c, category: 'Public' })),
    ...channels.groups.map(c => ({ ...c, category: 'My Groups' })),
    ...channels.dms.map(c => ({ ...c, category: 'Direct Messages' }))
  ];

  const filteredChannels = allChannels.filter(channel =>
    channel.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const channelMessages = selectedChannel ? messages[selectedChannel.id] || [] : [];

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-white rounded-2xl overflow-hidden shadow-lg">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">Messages</h2>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredChannels.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredChannels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
                    selectedChannel?.id === channel.id ? 'bg-orange-50 border-l-4 border-orange-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {channel.type === 'public' ? <Hash size={20} /> : 
                       channel.type === 'dm' ? channel.initials : 
                       channel.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-gray-900 truncate">
                          {channel.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{channel.category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedChannel.type === 'public' ? <Hash size={20} /> : 
                   selectedChannel.initials || selectedChannel.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedChannel.name}</h3>
                  <p className="text-xs text-gray-500">
                    {isTyping[selectedChannel.id] ? 'typing...' : selectedChannel.description || selectedChannel.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Phone size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Video size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {channelMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <MessageSquare size={64} />
                  <p className="mt-4 text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                channelMessages.map((msg, idx) => {
                  const isOwn = msg.sender_id == user?.id;
                  const showName = idx === 0 || channelMessages[idx - 1]?.sender_id !== msg.sender_id;
                  const isOptimistic = msg.isOptimistic || String(msg.id).startsWith('temp-');

                  return (
                    <div key={msg.id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isOptimistic ? 'opacity-60' : ''}`}>
                      <div className={`max-w-[60%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                        {showName && !isOwn && (
                          <span className="text-xs text-gray-500 mb-1 px-2">
                            {msg.sender_name}
                          </span>
                        )}
                        <div 
                          className={`rounded-2xl px-5 py-3 ${
                            isOwn 
                              ? 'bg-orange-600 text-white rounded-br-sm' 
                              : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-2">
                          {getTimeAgo(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              {isTyping[selectedChannel.id] && (
                <div className="flex items-start gap-3">
                  <div className="text-xs text-gray-500">
                    {isTyping[selectedChannel.id]} is typing
                    <span className="inline-flex ml-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={messageInput}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={22} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare size={96} className="mb-4" />
            <h3 className="text-2xl font-bold mb-2">Select a conversation</h3>
            <p className="text-sm">Choose a conversation from the list or start a new chat</p>
          </div>
        )}
      </div>
    </div>
  );
}
