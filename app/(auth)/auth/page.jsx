"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, KeyRound, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api-config';

export default function AuthPage() {
    const searchParams = useSearchParams();
    const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset' | 'verify'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login, isLoading } = useAuth();
    const router = useRouter();

    // Handle URL parameters for reset/verify flows
    useEffect(() => {
        const token = searchParams.get('token');
        const modeParam = searchParams.get('mode');
        
        if (token && modeParam === 'reset') {
            setMode('reset');
            setResetToken(token);
        } else if (modeParam === 'verify') {
            setMode('verify');
        }
    }, [searchParams]);

    const getHeadingText = () => {
        switch (mode) {
            case 'register': return "Start Your Journey Here.";
            case 'forgot': return "Reset Your Password.";
            case 'reset': return "Create New Password.";
            case 'verify': return "Verify Your Account.";
            default: return "Welcome Back to the Family.";
        }
    };

    const getFormTitle = () => {
        switch (mode) {
            case 'register': return 'Create Account';
            case 'forgot': return 'Forgot Password';
            case 'reset': return 'Reset Password';
            case 'verify': return 'Verify Email';
            default: return 'Sign In';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const callbackUrl = searchParams.get('callbackUrl') || '/member';

        try {
            if (mode === 'login') {
                const result = await login(email, password);
                if (result.success) {
                    router.push(callbackUrl);
                } else {
                    setError(result.error || 'Login failed');
                }
            } else if (mode === 'register') {
                // Split full name into first and last name
                const nameParts = fullName.trim().split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || nameParts[0];

                const response = await axios.post(`${API_URL}/auth/register.php`, {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                });

                if (response.data.success) {
                    setSuccess('Account created! Please check your email to verify your account.');
                    setTimeout(() => setMode('verify'), 3000);
                } else {
                    setError(response.data.message || 'Registration failed');
                }
            } else if (mode === 'forgot') {
                const response = await axios.post(`${API_URL}/auth/forgot_password.php`, {
                    email: email
                });

                if (response.data.success) {
                    setSuccess('Password reset link has been sent to your email.');
                    setTimeout(() => setMode('login'), 3000);
                } else {
                    setError(response.data.message || 'Failed to send reset link');
                }
            } else if (mode === 'reset') {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }

                const response = await axios.post(`${API_URL}/auth/reset_password.php`, {
                    token: resetToken,
                    password: password
                });

                if (response.data.success) {
                    setSuccess('Password has been reset successfully. Redirecting to login...');
                    setTimeout(() => {
                        setMode('login');
                        router.push('/auth');
                    }, 2000);
                } else {
                    setError(response.data.message || 'Failed to reset password');
                }
            } else if (mode === 'verify') {
                const response = await axios.post(`${API_URL}/auth/verify_email.php`, {
                    email: email,
                    code: verificationCode
                });

                if (response.data.success) {
                    setSuccess('Email verified successfully! You can now login.');
                    setTimeout(() => setMode('login'), 2000);
                } else {
                    setError(response.data.message || 'Verification failed');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-32">
            <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden grid md:grid-cols-2">
                
                {/* Visual Side */}
                <div className="bg-gray-900 p-12 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <h2 className="text-4xl font-black mb-6 relative z-10">
                        {getHeadingText()}
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 relative z-10">
                        "Creating a city where no one walks alone."
                    </p>
                    <div className="h-1.5 w-16 bg-orange-600 rounded-full"></div>
                </div>

                {/* Form Side */}
                <div className="p-12 md:p-16">
                    <div className="mb-10">
                        <h3 className="text-2xl font-black text-gray-900">{getFormTitle()}</h3>
                        <p className="text-gray-500 mt-2">
                            {mode === 'forgot' && 'Enter your email to receive a reset link.'}
                            {mode === 'reset' && 'Enter your new password below.'}
                            {mode === 'verify' && 'Enter the verification code sent to your email.'}
                            {(mode === 'login' || mode === 'register') && 'Enter your details to access the portal.'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
                            <AlertCircle size={20} />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
                            <CheckCircle size={20} />
                            <span className="text-sm font-medium">{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name - Register only */}
                        {mode === 'register' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="text" 
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email - All modes except reset with token */}
                        {mode !== 'reset' && mode !== 'verify' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                                        placeholder="name@email.com"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Verification Code - Verify mode only */}
                        {mode === 'verify' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                                            placeholder="name@email.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Verification Code</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            type="text" 
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-center text-2xl tracking-widest font-bold" 
                                            placeholder="000000"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Password - Login, Register, Reset */}
                        {(mode === 'login' || mode === 'register' || mode === 'reset') && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-gray-700">
                                    {mode === 'reset' ? 'New Password' : 'Password'}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Confirm Password - Register and Reset */}
                        {(mode === 'register' || mode === 'reset') && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Forgot Password Link - Login only */}
                        {mode === 'login' && (
                            <div className="flex justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => setMode('forgot')}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-bold"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Please wait...' : (
                                mode === 'login' ? 'Sign In' :
                                mode === 'register' ? 'Create Account' :
                                mode === 'forgot' ? 'Send Reset Link' :
                                mode === 'reset' ? 'Reset Password' :
                                'Verify Email'
                            )}
                            {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    {/* Demo Credentials - Login only */}
                    {mode === 'login' && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <p className="text-xs font-bold text-blue-900 mb-2">Demo Credentials:</p>
                            <p className="text-xs text-blue-700 font-mono">samuel@lifereach.org / password123</p>
                            <p className="text-xs text-blue-700 font-mono">test@test.com / test123</p>
                        </div>
                    )}

                    {/* Mode Switcher */}
                    <div className="mt-8 text-center space-y-2">
                        {mode === 'login' && (
                            <button 
                                onClick={() => {
                                    setMode('register');
                                    setError('');
                                    setSuccess('');
                                }}
                                className="text-gray-500 hover:text-orange-600 font-medium transition-colors"
                            >
                                Don't have an account? <span className="font-bold">Sign Up</span>
                            </button>
                        )}
                        {mode === 'register' && (
                            <button 
                                onClick={() => {
                                    setMode('login');
                                    setError('');
                                    setSuccess('');
                                }}
                                className="text-gray-500 hover:text-orange-600 font-medium transition-colors"
                            >
                                Already a member? <span className="font-bold">Sign In</span>
                            </button>
                        )}
                        {mode === 'forgot' && (
                            <button 
                                onClick={() => {
                                    setMode('login');
                                    setError('');
                                    setSuccess('');
                                }}
                                className="text-gray-500 hover:text-orange-600 font-medium transition-colors"
                            >
                                Remember your password? <span className="font-bold">Sign In</span>
                            </button>
                        )}
                        {(mode === 'reset' || mode === 'verify') && (
                            <button 
                                onClick={() => {
                                    setMode('login');
                                    router.push('/auth');
                                }}
                                className="text-gray-500 hover:text-orange-600 font-medium transition-colors"
                            >
                                <span className="font-bold">Back to Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
