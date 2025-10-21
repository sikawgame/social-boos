import React, { useState } from 'react';
import type { User, View } from '../types';

interface SettingsProps {
    user: User;
    setView: (view: View) => void;
    onUpdateName: (newName: string) => void;
    onUpdatePassword: (currentPassword: string, newPassword: string) => boolean;
    onUpdateProfilePicture: (pictureDataUrl: string) => void;
    onUpdateEmail: (newEmail: string, password: string) => boolean;
    onRegenerateApiKey: () => void;
}

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-brand-card rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);


const Settings: React.FC<SettingsProps> = ({ user, setView, onUpdateName, onUpdatePassword, onUpdateProfilePicture, onUpdateEmail, onRegenerateApiKey }) => {
    // State for forms
    const [name, setName] = useState(user.name);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [newEmail, setNewEmail] = useState('');
    const [confirmPasswordForEmail, setConfirmPasswordForEmail] = useState('');
    const [copied, setCopied] = useState(false);


    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() !== user.name) {
            onUpdateName(name.trim());
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("كلمتا المرور الجديدتان غير متطابقتين.");
            return;
        }
        if (newPassword.length < 6) {
            alert("يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل.");
            return;
        }
        const success = onUpdatePassword(currentPassword, newPassword);
        if (success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };
    
    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handlePictureSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (profilePicture) {
            onUpdateProfilePicture(profilePicture);
            setProfilePicture(null);
        }
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail.trim() || !confirmPasswordForEmail.trim()) {
            alert("الرجاء ملء جميع الحقول.");
            return;
        }
        if (newEmail.toLowerCase() === user.email.toLowerCase()) {
            alert("البريد الإلكتروني الجديد يجب أن يكون مختلفًا.");
            return;
        }
        const success = onUpdateEmail(newEmail, confirmPasswordForEmail);
        if (success) {
            setNewEmail('');
            setConfirmPasswordForEmail('');
        }
    };

    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(user.apiKey).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleRegenerateApiKey = () => {
        if (window.confirm('هل أنت متأكد أنك تريد إنشاء مفتاح API جديد؟ سيتم إبطال مفتاحك الحالي على الفور.')) {
            onRegenerateApiKey();
        }
    };
    
    const UserAvatar: React.FC<{ src?: string; alt: string }> = ({ src, alt }) => {
        const hasImage = src && src.startsWith('data:image');
        return (
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-brand-primary overflow-hidden">
                {hasImage ? (
                    <img src={src} alt={alt} className="w-full h-full object-cover" />
                ) : (
                    <span>{alt.charAt(0).toUpperCase()}</span>
                )}
            </div>
        );
    };

    return (
        <div className="py-12 sm:py-20 bg-black bg-opacity-20 animate-fade-in-down">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">إعدادات الحساب</h1>
                            <p className="text-gray-400">إدارة معلومات حسابك وتفضيلاتك.</p>
                        </div>
                        <button onClick={() => setView('dashboard')} className="text-brand-primary hover:underline">
                            &larr; العودة إلى لوحة التحكم
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Profile Picture Settings */}
                        <SettingsCard title="صورة الملف الشخصي">
                            <form onSubmit={handlePictureSubmit} className="flex flex-col sm:flex-row items-center gap-6">
                                <UserAvatar src={profilePicture || user.profilePicture} alt={user.name} />
                                <div className="flex-grow text-center sm:text-right">
                                    <input
                                        id="picture-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePictureChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="picture-upload" className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                                        اختر صورة
                                    </label>
                                    {profilePicture && (
                                        <div className="flex items-center gap-4 mt-4 justify-center sm:justify-start">
                                             <button type="submit" className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90">
                                                حفظ الصورة
                                            </button>
                                            <button type="button" onClick={() => setProfilePicture(null)} className="text-gray-400 hover:text-white">
                                                إلغاء
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </SettingsCard>
                    
                        {/* Name Settings */}
                        <SettingsCard title="تغيير الاسم">
                            <form onSubmit={handleNameSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">الاسم</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary"
                                    />
                                </div>
                                <div className="text-left">
                                    <button type="submit" className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-opacity-90 disabled:bg-gray-500" disabled={name === user.name}>
                                        حفظ التغييرات
                                    </button>
                                </div>
                            </form>
                        </SettingsCard>

                        {/* Email Settings */}
                        <SettingsCard title="تغيير البريد الإلكتروني">
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="currentEmail" className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني الحالي</label>
                                    <input
                                        type="email"
                                        id="currentEmail"
                                        value={user.email}
                                        disabled
                                        className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="newEmail" className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني الجديد</label>
                                    <input
                                        type="email"
                                        id="newEmail"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        required
                                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPasswordForEmail" className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور للتأكيد</label>
                                    <input
                                        type="password"
                                        id="confirmPasswordForEmail"
                                        value={confirmPasswordForEmail}
                                        onChange={(e) => setConfirmPasswordForEmail(e.target.value)}
                                        required
                                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary"
                                        placeholder="أدخل كلمة مرورك الحالية"
                                    />
                                </div>
                                <div className="text-left">
                                    <button type="submit" className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-opacity-90">
                                        تغيير البريد الإلكتروني
                                    </button>
                                </div>
                            </form>
                        </SettingsCard>

                        {/* Password Settings */}
                        <SettingsCard title="تغيير كلمة المرور">
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="currentPassword"  className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور الحالية</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary"
                                    />
                                </div>
                                <div>
                                     <label htmlFor="newPassword"  className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور الجديدة</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary"
                                    />
                                </div>
                                 <div>
                                     <label htmlFor="confirmPassword"  className="block text-sm font-medium text-gray-300 mb-2">تأكيد كلمة المرور الجديدة</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary"
                                    />
                                </div>
                                <div className="text-left">
                                    <button type="submit" className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-opacity-90">
                                        تغيير كلمة المرور
                                    </button>
                                </div>
                            </form>
                        </SettingsCard>
                        
                        {/* API Key Settings */}
                        <SettingsCard title="مفتاح API">
                            <p className="text-gray-400 mb-4">استخدم هذا المفتاح للمصادقة على طلبات API الخاصة بك. حافظ عليه سراً!</p>
                            <div className="flex items-center gap-4 bg-gray-900 p-3 rounded-lg">
                                <input
                                    type="text"
                                    readOnly
                                    value={user.apiKey}
                                    className="flex-grow bg-transparent text-gray-300 font-mono focus:outline-none"
                                />
                                <button onClick={handleCopyApiKey} className="text-gray-400 hover:text-white">
                                    {copied ? 'تم النسخ!' : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    )}
                                </button>
                            </div>
                             <div className="mt-4 text-left">
                                <button onClick={handleRegenerateApiKey} className="bg-red-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-opacity-90">
                                    إنشاء مفتاح جديد
                                </button>
                            </div>
                        </SettingsCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
