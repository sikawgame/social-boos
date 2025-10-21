import React, { useState } from 'react';
// FIX: Import View from the centralized types file to fix the module not found error.
import type { View } from '../types';

interface HeaderProps {
  setView: (view: View) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, isAuthenticated, isAdmin, onLoginClick, onSignupClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleNavClick = (view: View, anchor?: string) => {
    setView(view);
    setIsOpen(false);
    setIsUserMenuOpen(false);
    if (view === 'home' && anchor) {
      // Allow time for the view to render before scrolling
      setTimeout(() => {
        document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  const navLinks = [
    { text: 'الرئيسية', action: () => handleNavClick('home', '#home') },
    { text: 'الخدمات', action: () => handleNavClick('home', '#services') },
    { text: 'اطلب الآن', action: () => handleNavClick('home', '#order') },
    { text: 'كيف نعمل', action: () => handleNavClick('home', '#how-it-works') },
    { text: 'من نحن', action: () => handleNavClick('about') },
    { text: 'API', action: () => handleNavClick('api') },
  ];
  
  const closeMobileMenu = () => setIsOpen(false);

  return (
    <header id="home" className="bg-brand-dark/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-brand-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <button onClick={() => handleNavClick('home', '#home')} className="text-2xl font-bold text-white focus:outline-none">
              <span className="text-brand-primary">Social</span>Boost
            </button>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            <nav className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <button
                  key={link.text}
                  onClick={link.action}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  {link.text}
                </button>
              ))}
              {isAdmin && (
                 <button
                  onClick={() => handleNavClick('admin')}
                  className="text-yellow-400 hover:bg-gray-700 hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  لوحة تحكم المسؤول
                </button>
              )}
            </nav>
            <div className="ml-6 flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                   <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center gap-2">
                    <span>حسابي</span>
                     <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isUserMenuOpen && (
                     <div className="absolute left-0 mt-2 w-48 bg-brand-card rounded-md shadow-lg z-20" onMouseLeave={() => setIsUserMenuOpen(false)}>
                        <div className="py-1">
                            <button onClick={() => handleNavClick('dashboard')} className="block w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">لوحة التحكم</button>
                            <button onClick={() => handleNavClick('settings')} className="block w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">الإعدادات</button>
                            <button onClick={onLogout} className="block w-full text-right px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white">تسجيل الخروج</button>
                        </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={onLoginClick} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                    تسجيل الدخول
                  </button>
                  <button onClick={onSignupClick} className="bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 shadow-lg shadow-brand-primary/20 transition-all duration-300">
                    إنشاء حساب
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">فتح القائمة الرئيسية</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.text}
                onClick={() => { link.action(); closeMobileMenu(); }}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-right px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
              >
                {link.text}
              </button>
            ))}
             {isAdmin && (
                 <button
                  onClick={() => { handleNavClick('admin'); closeMobileMenu(); }}
                  className="text-yellow-400 hover:bg-gray-700 hover:text-yellow-300 block w-full text-right px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                >
                  لوحة تحكم المسؤول
                </button>
              )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <button onClick={() => { handleNavClick('dashboard'); closeMobileMenu(); }} className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    لوحة التحكم
                  </button>
                   <button onClick={() => { handleNavClick('settings'); closeMobileMenu(); }} className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    الإعدادات
                  </button>
                   <button onClick={() => { onLogout(); closeMobileMenu(); }} className="block w-full text-center px-4 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-opacity-90 transition-colors duration-300">
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { onLoginClick(); closeMobileMenu(); }} className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-300">
                    تسجيل الدخول
                  </button>
                  <button onClick={() => { onSignupClick(); closeMobileMenu(); }} className="block w-full text-center px-4 py-2 rounded-md text-base font-medium bg-brand-primary text-white hover:bg-opacity-90 transition-colors duration-300">
                    إنشاء حساب
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
