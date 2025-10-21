import React, { useState } from 'react';
import { registerUser, loginUser, requestPasswordReset } from '../services/databaseService';
// FIX: Import AuthModalView and User from the centralized types file and remove local definitions.
import type { AuthModalView, User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  // FIX: Made initialView prop type more specific to what App.tsx provides.
  initialView: 'login' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialView, onClose, onLoginSuccess }) => {
  const [view, setView] = useState<AuthModalView>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  React.useEffect(() => {
    setView(initialView);
    // Reset states when the modal is reopened with a new initial view
    if (isOpen) {
        setResetEmailSent(false);
        setError(null);
    }
  }, [initialView, isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
        setName('');
        setEmail('');
        setPassword('');
        setError(null);
        setLoading(false);
        setResetEmailSent(false);
    }
  }, [isOpen]);


  if (!isOpen) return null;

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let result;
    if (view === 'login') {
        result = loginUser(email, password);
    } else { // signup
        result = registerUser(name, email, password);
    }
    
    setTimeout(() => {
        if (result.success && result.user) {
            // FIX: Pass the entire user object, which includes the 'balance' property,
            // to satisfy the 'User' type expected by onLoginSuccess.
            onLoginSuccess(result.user);
        } else {
            setError(result.message);
        }
        setLoading(false);
    }, 500);
  };
  
  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    setTimeout(() => {
      requestPasswordReset(email); // This is a simulated call
      setLoading(false);
      setResetEmailSent(true);
    }, 500);
  }

  const renderContent = () => {
    if (view === 'forgotPassword') {
        return (
            <div>
                 <h2 className="text-3xl font-bold text-center text-white mb-2">إعادة تعيين كلمة المرور</h2>
                 {resetEmailSent ? (
                    <div className="text-center">
                        <svg className="w-16 h-16 text-green-500 mx-auto my-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-center text-gray-300 mb-6">
                            إذا كان هذا البريد الإلكتروني مسجلاً لدينا، فسيصلك رابط لإعادة تعيين كلمة المرور قريباً.
                        </p>
                        <button 
                            onClick={() => setView('login')}
                            className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg"
                        >
                            العودة لتسجيل الدخول
                        </button>
                    </div>
                 ) : (
                    <>
                        <p className="text-center text-gray-400 mb-8">
                            أدخل بريدك الإلكتروني وسنرسل لك تعليمات لإعادة تعيين كلمة مرورك.
                        </p>
                        <form onSubmit={handlePasswordReset} className="space-y-6">
                            <div>
                                <label htmlFor="email-reset" className="block text-sm font-medium text-gray-300 mb-2 text-right">البريد الإلكتروني</label>
                                <input 
                                type="email" 
                                id="email-reset" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                placeholder="you@example.com"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <button type="submit" disabled={loading} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-brand-primary/30 transform hover:scale-[1.02] transition-all duration-300 text-lg disabled:bg-gray-500 disabled:cursor-not-allowed">
                                {loading ? '...جاري الإرسال' : 'إرسال رابط الاستعادة'}
                            </button>
                        </form>
                        <p className="mt-8 text-center text-sm text-gray-400">
                           تذكرت كلمة المرور؟{' '}
                          <button 
                            onClick={() => { setView('login'); setError(null); }}
                            className="font-semibold text-brand-primary hover:underline focus:outline-none"
                          >
                             العودة لتسجيل الدخول
                          </button>
                        </p>
                    </>
                 )}
            </div>
        );
    }
      
    const isLoginView = view === 'login';
    return (
      <div>
        <h2 className="text-3xl font-bold text-center text-white mb-2">{isLoginView ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
        <p className="text-center text-gray-400 mb-8">
          {isLoginView ? 'مرحباً بعودتك!' : 'انضم إلينا لتعزيز حضورك الاجتماعي.'}
        </p>
        
        <form onSubmit={handleAuthAction} className="space-y-6">
          {!isLoginView && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 text-right">الاسم</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                placeholder="اسمك الكامل"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 text-right">البريد الإلكتروني</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 text-right">كلمة المرور</label>
                {isLoginView && (
                    <button 
                        type="button"
                        onClick={() => setView('forgotPassword')}
                        className="text-sm text-brand-primary hover:underline focus:outline-none"
                    >
                        هل نسيت كلمة المرور؟
                    </button>
                )}
            </div>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              placeholder="********"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button type="submit" disabled={loading} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-brand-primary/30 transform hover:scale-[1.02] transition-all duration-300 text-lg disabled:bg-gray-500 disabled:cursor-not-allowed">
            {loading ? '...جاري التحميل' : (isLoginView ? 'تسجيل الدخول' : 'إنشاء الحساب')}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          {isLoginView ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
          <button 
            onClick={() => { setView(isLoginView ? 'signup' : 'login'); setError(null); }}
            className="font-semibold text-brand-primary hover:underline focus:outline-none"
          >
            {isLoginView ? 'أنشئ حساباً' : 'سجل الدخول'}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
      onClick={onClose}
    >
      <div 
        className="bg-brand-card rounded-2xl shadow-2xl shadow-brand-primary/20 w-full max-w-md p-8 relative"
        style={{ animation: 'fadeInDown 0.4s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-500 hover:text-white transition-colors z-10">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {renderContent()}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-content {
           animation: fadeInDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;