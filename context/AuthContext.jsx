'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const loading = status === 'loading';

    useEffect(() => {
        if (session?.user) {
            setUser(session.user);
            setToken(session.user.accessToken || null);
        } else {
            setUser(null);
            setToken(null);
        }
    }, [session]);

    const login = async (email, password) => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.ok) {
                const updatedSession = await getSession();
                if (updatedSession?.user) {
                    setUser(updatedSession.user);
                    setToken(updatedSession.user.accessToken || null);
                }
                return { success: true };
            }

            const errorMessage =
                result?.error === 'CredentialsSignin'
                    ? 'Invalid email or password'
                    : result?.error || 'Login failed';
            return { success: false, message: errorMessage };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/auth/proxy-register', userData);

            if (response.data.success) {
                return { success: true, data: response.data.data };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        signOut({ redirect: false });
        setUser(null);
        setToken(null);
        return { success: true };
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const value = {
        user,
        token,
        loading,
        isLoading: loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
