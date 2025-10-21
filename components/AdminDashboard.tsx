import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { User, Order, Platform, View } from '../types';

interface AdminDashboardProps {
    users: User[];
    orders: Order[];
    onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
    onUpdateUserBalance: (email: string, newBalance: number) => void;
    onDeleteUser: (email: string) => void;
    onUpdateUserName: (email: string, newName: string) => void;
    onUpdateUserEmail: (currentEmail: string, newEmail: string) => void;
    onUpdateUserPassword: (email: string, newPassword: string) => void;
    onSendMessage: (email: string, message: string) => void;
    platforms: Record<string, Platform>;
    setView: (view: View) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-brand-card p-6 rounded-xl shadow-lg flex items-center space-x-4 space-x-reverse">
        <div className="bg-brand-primary/20 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

// Generic Modal Component
const Modal: React.FC<{ children: React.ReactNode; title: string; onClose: () => void }> = ({ children, title, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4 animate-fade-in-down" onClick={onClose}>
        <div className="bg-brand-card rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
            {children}
        </div>
    </div>
);


const EditBalanceModal: React.FC<{ user: User, onClose: () => void, onSave: (email: string, newBalance: number) => void }> = ({ user, onClose, onSave }) => {
    const [balance, setBalance] = useState(user.balance.toString());
    const handleSave = () => {
        const newBalance = parseFloat(balance);
        if (!isNaN(newBalance) && newBalance >= 0) {
            onSave(user.email, newBalance);
            onClose();
        } else {
            alert("الرجاء إدخال رصيد صالح.");
        }
    };
    return (
        <Modal title={`تعديل رصيد: ${user.name}`} onClose={onClose}>
            <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white" placeholder="أدخل الرصيد الجديد" />
            <div className="mt-6 flex justify-end space-x-4 space-x-reverse">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">إلغاء</button>
                <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90">حفظ</button>
            </div>
        </Modal>
    );
};

const EditNameModal: React.FC<{ user: User, onClose: () => void, onSave: (email: string, newName: string) => void }> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const handleSave = () => {
        if (name.trim()) {
            onSave(user.email, name.trim());
            onClose();
        } else {
            alert("الرجاء إدخال اسم صالح.");
        }
    };
    return (
        <Modal title={`تعديل اسم: ${user.name}`} onClose={onClose}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white" placeholder="أدخل الاسم الجديد" />
            <div className="mt-6 flex justify-end space-x-4 space-x-reverse">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">إلغاء</button>
                <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90">حفظ</button>
            </div>
        </Modal>
    );
};

const EditEmailModal: React.FC<{ user: User, onClose: () => void, onSave: (currentEmail: string, newEmail: string) => void }> = ({ user, onClose, onSave }) => {
    const [email, setEmail] = useState(user.email);
    const handleSave = () => {
        if (email.trim() && email.includes('@')) {
            onSave(user.email, email.trim());
            onClose();
        } else {
            alert("الرجاء إدخال بريد إلكتروني صالح.");
        }
    };
    return (
        <Modal title={`تعديل البريد الإلكتروني لـ: ${user.name}`} onClose={onClose}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white" placeholder="أدخل البريد الإلكتروني الجديد" />
            <div className="mt-6 flex justify-end space-x-4 space-x-reverse">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">إلغاء</button>
                <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90">حفظ</button>
            </div>
        </Modal>
    );
};

const SendMessageModal: React.FC<{ user: User, onClose: () => void, onSend: (email: string, message: string) => void }> = ({ user, onClose, onSend }) => {
    const [message, setMessage] = useState('');
    const handleSend = () => {
        if (message.trim()) {
            onSend(user.email, message.trim());
            onClose();
        } else {
            alert("لا يمكن إرسال رسالة فارغة.");
        }
    };
    return (
        <Modal title={`إرسال رسالة إلى: ${user.name}`} onClose={onClose}>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white h-32" placeholder="اكتب رسالتك هنا..."></textarea>
            <div className="mt-6 flex justify-end space-x-4 space-x-reverse">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">إلغاء</button>
                <button onClick={handleSend} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90">إرسال</button>
            </div>
        </Modal>
    );
};

const ChangePasswordModal: React.FC<{ user: User, onClose: () => void, onSave: (email: string, newPassword: string) => void }> = ({ user, onClose, onSave }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const handleSave = () => {
        if (!newPassword || newPassword.length < 6) {
            alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("كلمتا المرور غير متطابقتين.");
            return;
        }
        onSave(user.email, newPassword);
        onClose();
    };

    return (
        <Modal title={`تغيير كلمة مرور: ${user.name}`} onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 text-right">كلمة المرور الجديدة</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white" placeholder="********" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 text-right">تأكيد كلمة المرور</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white" placeholder="********" />
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4 space-x-reverse">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">إلغاء</button>
                <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90">حفظ</button>
            </div>
        </Modal>
    );
};

const DeleteUserModal: React.FC<{ user: User, onClose: () => void, onConfirm: (email: string) => void }> = ({ user, onClose, onConfirm }) => (
    <Modal title="تأكيد الحذف" onClose={onClose}>
        <p className="text-gray-400 mb-6">هل أنت متأكد أنك تريد حذف المستخدم <strong className="text-white">{user.name}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="mt-6 flex justify-end space-x-4 space-x-reverse">
            <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">إلغاء</button>
            <button onClick={() => { onConfirm(user.email); onClose(); }} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500">حذف</button>
        </div>
    </Modal>
);

const ActionsDropdown: React.FC<{
    user: User;
    onEditName: () => void;
    onEditEmail: () => void;
    onEditBalance: () => void;
    onChangePassword: () => void;
    onSendMessage: () => void;
    onDelete: () => void;
}> = ({ user, onEditName, onEditEmail, onEditBalance, onChangePassword, onSendMessage, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                إجراءات
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-brand-card rounded-md shadow-lg z-20 border border-gray-700">
                    <div className="py-1">
                        <button onClick={() => handleAction(onEditName)} className="block w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">تعديل الاسم</button>
                        <button onClick={() => handleAction(onEditEmail)} className="block w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">تعديل الإيميل</button>
                        <button onClick={() => handleAction(onEditBalance)} className="block w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">تعديل الرصيد</button>
                        <button onClick={() => handleAction(onChangePassword)} className="block w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">تغيير كلمة المرور</button>
                        <button onClick={() => handleAction(onSendMessage)} className="block w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">إرسال رسالة</button>
                        <div className="border-t border-gray-600 my-1"></div>
                        <button onClick={() => handleAction(onDelete)} className="block w-full text-right px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white">حذف المستخدم</button>
                    </div>
                </div>
            )}
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, orders, onUpdateOrderStatus, onUpdateUserBalance, onDeleteUser, onUpdateUserName, onUpdateUserEmail, onUpdateUserPassword, onSendMessage, setView, platforms }) => {
    const [modalState, setModalState] = useState<{ type: 'editBalance' | 'editName' | 'editEmail' | 'sendMessage' | 'delete' | 'changePassword' | null, user: User | null }>({ type: null, user: null });

    const adminAnalytics = useMemo(() => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.cost, 0);
        const totalOrders = orders.length;
        const totalUsers = users.length;
        return { totalRevenue, totalOrders, totalUsers };
    }, [orders, users]);
    
    const userMap = useMemo(() => {
        const map = new Map<string, User>();
        users.forEach(user => {
            map.set(user.email.toLowerCase(), user);
        });
        return map;
    }, [users]);
    
    const closeModal = () => setModalState({ type: null, user: null });

    return (
        <div className="py-12 sm:py-20 bg-black bg-opacity-20 animate-fade-in-down">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">لوحة تحكم المسؤول</h1>
                    <div className="flex flex-wrap gap-4">
                         <button 
                            onClick={() => setView('admin/funds')}
                            className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-green-600/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>إدارة طلبات شحن الرصيد</span>
                        </button>
                        <button 
                            onClick={() => setView('admin/prices')}
                            className="bg-brand-accent text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-brand-accent/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
                            </svg>
                            <span>إدارة أسعار الخدمات</span>
                        </button>
                        <button 
                            onClick={() => setView('admin/payments')}
                            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-purple-600/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span>إدارة طرق الدفع</span>
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                     <StatCard title="إجمالي الإيرادات" value={`$${adminAnalytics.totalRevenue.toFixed(2)}`} icon={<svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                    <StatCard title="إجمالي الطلبات" value={adminAnalytics.totalOrders} icon={<svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
                    <StatCard title="إجمالي المستخدمين" value={adminAnalytics.totalUsers} icon={<svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                </div>

                {/* Users Management */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">إدارة المستخدمين</h2>
                    <div className="bg-brand-card rounded-xl shadow-lg overflow-x-auto">
                        <table className="w-full text-right">
                             <thead className="border-b border-gray-700">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-300">الاسم</th>
                                    <th className="p-4 font-semibold text-gray-300">البريد الإلكتروني</th>
                                    <th className="p-4 font-semibold text-gray-300">الرصيد</th>
                                    <th className="p-4 font-semibold text-gray-300">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.email} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-white">{user.name}</td>
                                        <td className="p-4 text-gray-400">{user.email}</td>
                                        <td className="p-4 text-brand-primary font-bold">${user.balance.toFixed(2)}</td>
                                        <td className="p-4">
                                            <ActionsDropdown 
                                                user={user}
                                                onEditName={() => setModalState({ type: 'editName', user })}
                                                onEditEmail={() => setModalState({ type: 'editEmail', user })}
                                                onEditBalance={() => setModalState({ type: 'editBalance', user })}
                                                onChangePassword={() => setModalState({ type: 'changePassword', user })}
                                                onSendMessage={() => setModalState({ type: 'sendMessage', user })}
                                                onDelete={() => setModalState({ type: 'delete', user })}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Orders Management */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">إدارة الطلبات</h2>
                    <div className="bg-brand-card rounded-xl shadow-lg overflow-x-auto">
                         <table className="w-full text-right">
                            <thead className="border-b border-gray-700">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-300">رقم الطلب</th>
                                    <th className="p-4 font-semibold text-gray-300">التاريخ</th>
                                    <th className="p-4 font-semibold text-gray-300">بريد المستخدم</th>
                                    <th className="p-4 font-semibold text-gray-300">اسم العميل</th>
                                    <th className="p-4 font-semibold text-gray-300">المنصة</th>
                                    <th className="p-4 font-semibold text-gray-300">الخدمة</th>
                                    <th className="p-4 font-semibold text-gray-300">الكمية</th>
                                    <th className="p-4 font-semibold text-gray-300">الرابط</th>
                                    <th className="p-4 font-semibold text-gray-300">التكلفة</th>
                                    <th className="p-4 font-semibold text-gray-300">الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => {
                                     let platformName = 'غير معروف';
                                    if (order.platform === 'internal_fund_transfer') {
                                        platformName = 'رصيد الحساب';
                                    } else if (platforms[order.platform]) {
                                        platformName = platforms[order.platform].name;
                                    } else {
                                        platformName = order.platform;
                                    }
                                    const customer = userMap.get(order.userEmail.toLowerCase());
                                    return (
                                     <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-gray-400 font-mono text-sm whitespace-nowrap">{order.id}</td>
                                        <td className="p-4 text-gray-400 whitespace-nowrap">{order.date}</td>
                                        <td className="p-4 text-gray-400">{order.userEmail}</td>
                                        <td className="p-4 text-white">{customer ? customer.name : 'مستخدم محذوف'}</td>
                                        <td className="p-4 text-white">{platformName}</td>
                                        <td className="p-4 text-white">{order.service}</td>
                                        <td className="p-4 text-gray-300">{order.quantity.toLocaleString()}</td>
                                         <td className="p-4 text-gray-400 max-w-xs">
                                            {order.link && order.link.startsWith('http') ? (
                                                <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline truncate block" title={order.link}>
                                                    {order.link}
                                                </a>
                                            ) : (
                                                 <span className="truncate block" title={order.link}>{order.link}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-brand-primary font-bold">${order.cost.toFixed(2)}</td>
                                        <td className="p-4">
                                            <select 
                                                value={order.status} 
                                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                                className="bg-gray-700 border-gray-600 rounded-md p-1 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                            >
                                                <option value="Pending">قيد الانتظار</option>
                                                <option value="In Progress">قيد التنفيذ</option>
                                                <option value="Completed">مكتمل</option>
                                            </select>
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                         </table>
                    </div>
                </div>
            </div>
            {modalState.type === 'editBalance' && modalState.user && <EditBalanceModal user={modalState.user} onClose={closeModal} onSave={onUpdateUserBalance} />}
            {modalState.type === 'editName' && modalState.user && <EditNameModal user={modalState.user} onClose={closeModal} onSave={onUpdateUserName} />}
            {modalState.type === 'editEmail' && modalState.user && <EditEmailModal user={modalState.user} onClose={closeModal} onSave={onUpdateUserEmail} />}
            {modalState.type === 'changePassword' && modalState.user && <ChangePasswordModal user={modalState.user} onClose={closeModal} onSave={onUpdateUserPassword} />}
            {modalState.type === 'sendMessage' && modalState.user && <SendMessageModal user={modalState.user} onClose={closeModal} onSend={onSendMessage} />}
            {modalState.type === 'delete' && modalState.user && <DeleteUserModal user={modalState.user} onClose={closeModal} onConfirm={onDeleteUser} />}
        </div>
    );
};

export default AdminDashboard;