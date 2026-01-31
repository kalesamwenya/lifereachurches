'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
    const { user } = useAuth();
    const [ws, setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!user?.id) return;

        // Initialize WebSocket connection
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
        
        const websocket = new WebSocket(wsUrl);
        wsRef.current = websocket;

        websocket.onopen = () => {
            console.log('✓ WebSocket connected');
            setIsConnected(true);

            // Authenticate
            websocket.send(JSON.stringify({
                type: 'auth',
                userId: user.id,
                userName: `${user.first_name} ${user.last_name}`,
                userEmail: user.email
            }));
        };

        websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WebSocket message:', data);

                switch (data.type) {
                    case 'chat_message':
                        setMessages(prev => [...prev, data]);
                        break;
                    case 'notification':
                        setNotifications(prev => [...prev, data.notification]);
                        // Show browser notification if permitted
                        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                            new Notification(data.notification.title || 'New Notification', {
                                body: data.notification.message,
                                icon: '/logo.png'
                            });
                        }
                        break;
                    case 'typing':
                    case 'user_online':
                    case 'user_offline':
                        // Handle these in specific components
                        break;
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        websocket.onclose = () => {
            console.log('✗ WebSocket disconnected');
            setIsConnected(false);
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setWs(websocket);

        // Cleanup on unmount
        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
        };
    }, [user?.id]);

    // Request notification permission
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, []);

    const sendMessage = (message, recipientId = null, conversationId = null) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.error('WebSocket not connected');
            return;
        }

        wsRef.current.send(JSON.stringify({
            type: 'chat_message',
            message,
            recipientId,
            conversationId
        }));
    };

    const sendTypingIndicator = (isTyping, recipientId = null, conversationId = null) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        wsRef.current.send(JSON.stringify({
            type: 'typing',
            isTyping,
            recipientId,
            conversationId
        }));
    };

    const sendReadReceipt = (messageId, recipientId) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        wsRef.current.send(JSON.stringify({
            type: 'read_receipt',
            messageId,
            recipientId
        }));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const value = {
        ws: wsRef.current,
        isConnected,
        messages,
        notifications,
        sendMessage,
        sendTypingIndicator,
        sendReadReceipt,
        clearNotifications
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within WebSocketProvider');
    }
    return context;
}
