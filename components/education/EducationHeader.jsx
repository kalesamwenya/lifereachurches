'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  FaGraduationCap, 
  FaBook, 
  FaChartLine, 
  FaCertificate,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaBars,
  FaTimes,
  FaHome
} from 'react-icons/fa';

export default function EducationHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/education', label: 'Browse Courses', icon: FaBook },
    { href: '/education/my-courses', label: 'My Learning', icon: FaGraduationCap },
    { href: '/education/progress', label: 'Progress', icon: FaChartLine },
    { href: '/education/certificates', label: 'Certificates', icon: FaCertificate },
  ];

  const isActive = (href) => {
    if (href === '/education') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  // Check if we're on the main education page
  const isMainEducationPage = pathname === '/education';

  // Navbar becomes solid if scrolled OR if mobile menu is open OR if not on main education page
  const isSolid = isScrolled || mobileMenuOpen || !isMainEducationPage;

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${isSolid ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/education" className="flex items-center space-x-2">
              <FaGraduationCap className={`text-3xl transition-colors ${isSolid ? 'text-brand-500' : 'text-white'}`} />
              <div>
                <h1 className={`text-xl font-bold transition-colors ${isSolid ? 'text-gray-900' : 'text-white'}`}>LRC Education</h1>
                <p className={`text-xs transition-colors ${isSolid ? 'text-gray-500' : 'text-white/70'}`}>Life Reach Church</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'bg-brand-500 text-white'
                      : isSolid
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side - User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {/* Back to Main Site */}
            <Link
              href="/"
              className={`hidden md:flex items-center space-x-2 transition-colors ${
                isSolid ? 'text-gray-600 hover:text-brand-500' : 'text-white/90 hover:text-brand-500'
              }`}
            >
              <FaHome />
              <span className="text-sm">Main Site</span>
            </Link>

            {/* User Menu */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                    isSolid ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </span>
                  </div>
                  <span className={`hidden md:block text-sm font-medium transition-colors ${
                    isSolid ? 'text-gray-700' : 'text-white'
                  }`}>
                    {user.first_name}
                  </span>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      href="/education/settings"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaCog />
                      <span>Settings</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isSolid ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
            >
              {mobileMenuOpen ? (
                <FaTimes className={`text-xl ${isSolid ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <FaBars className={`text-xl ${isSolid ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-brand-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
              
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <FaHome />
                <span className="font-medium">Back to Main Site</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
