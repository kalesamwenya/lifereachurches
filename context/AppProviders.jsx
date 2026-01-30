'use client';

import { createContext, useContext } from 'react';
import { AuthProvider as FrontendAuthProvider } from './AuthContext';
import { PusherProvider } from './PusherContext';

const ProvidersContext = createContext(null);

/**
 * Combined providers wrapper for frontend
 * Includes Auth and Pusher for real-time features
 */
export function AppProviders({ children }) {
  return (
    <FrontendAuthProvider>
      <PusherProvider>
        {children}
      </PusherProvider>
    </FrontendAuthProvider>
  );
}

export const useProviders = () => useContext(ProvidersContext);
