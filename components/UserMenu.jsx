'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function UserMenu() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    async function handleLogout() {
        await signOut({ redirect: false });
        router.push('/');
        setIsOpen(false);
    }

    if (status === 'unauthenticated') {
        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                    Sign In
                </Link>
                <Link
                    href="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                    Join Us
                </Link>
            </div>
        );
    }

    const user = session?.user;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <span className="font-medium text-gray-700">
                    {user?.firstName} {user?.lastName}
                </span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <p className="font-semibold text-gray-900">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>

                        <div className="py-2">
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            >
                                <User size={18} className="text-gray-600" />
                                <span className="text-gray-700">My Profile</span>
                            </Link>
                            <Link
                                href="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            >
                                <Settings size={18} className="text-gray-600" />
                                <span className="text-gray-700">Settings</span>
                            </Link>
                        </div>

                        <div className="border-t border-gray-200 py-2">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors w-full text-left"
                            >
                                <LogOut size={18} className="text-red-600" />
                                <span className="text-red-600 font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
