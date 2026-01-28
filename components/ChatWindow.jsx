"use client";
import { useEffect, useState, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { X, Send, Search, MessageSquare, Phone, Video, MoreVertical, Smile } from 'lucide-react';

export default function ChatWindow({ isOpen, onClose, recipientId, recipientName }) {
  const { user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    fetchMessages, 
    createChannel,
    startTyping,
    stopTyping,
    isTyping
  } = useChat();
  
  const [channelId, setChannelId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize channel
  useEffect(() => {
    if (!isOpen || !recipientId) return;

    const initChannel = async () => {
      setIsLoading(true);
      const newChannelId = await createChannel(recipientId, recipientName);
      if (newChannelId) {
        setChannelId(newChannelId);
        await fetchMessages(newChannelId);
      }
      setIsLoading(false);
    };

    initChannel();
  }, [isOpen, recipientId, recipientName]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, channelId]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !channelId) return;

    sendMessage(channelId, messageInput, recipientId);
    setMessageInput('');
    stopTyping(channelId, recipientId);
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);

    // Start typing indicator
    if (channelId) {
      startTyping(channelId, recipientId);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(channelId, recipientId);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  const channelMessages = channelId ? messages[channelId] || [] : [];

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
            {recipientName?.charAt(0) || '?'}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{recipientName || 'Loading...'}</h3>
            <p className="text-xs text-gray-500">
              {isTyping[channelId] ? 'typing...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone size={18} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Video size={18} className="text-gray-600" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={18} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : channelMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare size={48} />
            <p className="mt-2 text-sm">No messages yet</p>
            <p className="text-xs">Start the conversation!</p>
          </div>
        ) : (
          channelMessages.map((msg, idx) => {
            const isOwn = msg.senderId == user?.id || msg.sender_id == user?.id;
            const showName = idx === 0 || channelMessages[idx - 1]?.senderId !== msg.senderId;

            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                  {showName && !isOwn && (
                    <span className="text-xs text-gray-500 mb-1 px-2">{msg.senderName || msg.sender_name}</span>
                  )}
                  <div 
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn 
                        ? 'bg-orange-600 text-white rounded-br-sm' 
                        : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-2">
                    {new Date(msg.created_at || msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Smile size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={messageInput}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
