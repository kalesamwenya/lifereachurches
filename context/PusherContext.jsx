'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import Pusher from 'pusher-js';
import { useAuth } from './AuthContext';

const PusherContext = createContext(null);

export const usePusher = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error('usePusher must be used within PusherProvider');
  }
  return context;
};

export const PusherProvider = ({ children }) => {
  const { user } = useAuth();
  const [pusher, setPusher] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelsRef = useRef(new Map());

  useEffect(() => {
    if (!user?.id) return;

    // Initialize Pusher
    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/pusher/auth.php`,
      auth: {
        params: {
          member_id: user.id,
        },
      },
    });

    // Connection state monitoring
    pusherInstance.connection.bind('connected', () => {
      console.log('✅ Pusher connected');
      setIsConnected(true);
    });

    pusherInstance.connection.bind('disconnected', () => {
      console.log('❌ Pusher disconnected');
      setIsConnected(false);
    });

    pusherInstance.connection.bind('error', (err) => {
      console.error('Pusher error:', err);
    });

    setPusher(pusherInstance);

    return () => {
      // Unsubscribe from all channels
      channelsRef.current.forEach((channel) => {
        pusherInstance.unsubscribe(channel.name);
      });
      channelsRef.current.clear();
      pusherInstance.disconnect();
    };
  }, [user?.id]);

  // Subscribe to a channel
  const subscribe = (channelName, eventHandlers = {}) => {
    if (!pusher) return null;

    // Check if already subscribed
    if (channelsRef.current.has(channelName)) {
      return channelsRef.current.get(channelName);
    }

    const channel = pusher.subscribe(channelName);
    channelsRef.current.set(channelName, channel);

    // Bind event handlers
    Object.entries(eventHandlers).forEach(([eventName, handler]) => {
      channel.bind(eventName, handler);
    });

    return channel;
  };

  // Unsubscribe from a channel
  const unsubscribe = (channelName) => {
    if (!pusher) return;

    if (channelsRef.current.has(channelName)) {
      pusher.unsubscribe(channelName);
      channelsRef.current.delete(channelName);
    }
  };

  // Trigger event on a channel (only works for client events on private/presence channels)
  const trigger = (channelName, eventName, data) => {
    const channel = channelsRef.current.get(channelName);
    if (channel) {
      // Client events must start with "client-"
      channel.trigger(`client-${eventName}`, data);
    }
  };

  const value = {
    pusher,
    isConnected,
    subscribe,
    unsubscribe,
    trigger,
  };

  return (
    <PusherContext.Provider value={value}>
      {children}
    </PusherContext.Provider>
  );
};
