import React, { useState, useMemo } from 'react';
import type { Order, View, User, Platform, FundTransferRequest, Message } from '../types';
import OrderTimeline from './OrderTimeline';
import FundRequestTrackerModal from './FundRequestTrackerModal';

interface AnalyticsData {
    totalOrders: number;
    totalSpent: number;
    followersGained: number;
}

interface DashboardProps {
    user: User;
    orders: Order[];
    fundRequests: FundTransferRequest[];
    messages: Message[];
    analytics: AnalyticsData;
    setView: (view: View) => void;
    platforms: Record<string, Platform>;
    onMarkMessagesAsRead: () => void;
}

const MessagesModal: React.FC<{ messages: Message[], onClose: () => void }> = ({ messages, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4 animate-fade-in-down"
            onClick={onClose}
        >
            <div 
                className="bg-brand-card rounded-2xl shadow-2xl w-full max-w-2xl p-6" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">الرسائل الواردة</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                    {messages.length > 0 ? (
                        messages.map(msg => (
                            <div key={msg.id} className={`p-4 rounded-lg ${msg.read ? 'bg-gray-800/50' : 'bg-brand-primary/20 border-r-4 border-brand-primary'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-white">من: الإدارة</span>
                                    <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleString('ar-SA')}</span>
                                </div>
                                <p className="text-gray-300">{msg.message}</p>
                            </div>
                        ))
                    ) : (
                         <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-white">لا توجد رسائل</h3>
                            <p className="mt-1 text-sm text-gray-400">صندوق الوارد الخاص بك فارغ حاليًا.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


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

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
    const statusClasses = {
        Completed: "bg-green-500/20 text-green-400",
        'In Progress': "bg-yellow-500/20 text-yellow-400",
        Pending: "bg-blue-500/20 text-blue-400",
    };
    const statusText = {
        Completed: "مكتمل",
        'In Progress': "قيد التنفيذ",
        Pending: "قيد الانتظار",
    }
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{statusText[status]}</span>
};


const Dashboard: React.FC<DashboardProps> = ({ user, orders, fundRequests, messages, analytics, setView, platforms, onMarkMessagesAsRead }) => {
    const [filterStatus, setFilterStatus] = useState<Order['status'] | 'All'>('All');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
    const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

    const handleOrderNow = () => {
        setView('home');
        setTimeout(() => {
            document.querySelector('#order')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleOpenMessages = () => {
        setIsMessagesModalOpen(true);
        onMarkMessagesAsRead();
    };

    const unreadMessagesCount = useMemo(() => messages.filter(m => !m.read).length, [messages]);

    const displayedOrders = useMemo(() => {
        const filtered = orders.filter(order => {
            if (filterStatus === 'All') return true;
            return order.status === filterStatus;
        });

        return filtered.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (sortOrder === 'newest') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });
    }, [orders, filterStatus, sortOrder]);


    const filterOptions: {label: string, value: Order['status'] | 'All'}[] = [
        { label: 'الكل', value: 'All' },
        { label: 'مكتمل', value: 'Completed' },
        { label: 'قيد التنفيذ', value: 'In Progress' },
        { label: 'قيد الانتظار', value: 'Pending' }
    ];

    return (
        <div className="py-12 sm:py-20 bg-black bg-opacity-20 animate-fade-in-down">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">لوحة التحكم</h1>
                        <p className="text-gray-400">مرحباً بعودتك، {user.name}! إليك نظرة عامة على نشاطك.</p>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <button 
                            onClick={handleOrderNow}
                            className="bg-brand-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-brand-primary/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>اطلب الآن</span>
                        </button>
                        <button 
                            onClick={() => setView('addFunds')}
                            className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-green-600/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>إضافة رصيد</span>
                        </button>
                         <button 
                            onClick={() => setIsTrackingModalOpen(true)}
                            className="bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-yellow-600/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 9h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <span>تتبع طلبات الشحن</span>
                        </button>
                         <button onClick={handleOpenMessages} className="relative bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-indigo-600/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>الرسائل</span>
                            {unreadMessagesCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-brand-dark">
                                    {unreadMessagesCount}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={() => setView('settings')}
                            className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>إعدادات الحساب</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard 
                        title="رصيد الحساب" 
                        value={`$${user.balance.toFixed(2)}`}
                        icon={<svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>}
                    />
                    <StatCard 
                        title="إجمالي الطلبات" 
                        value={analytics.totalOrders} 
                        icon={<svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} 
                    />
                    <StatCard 
                        title="إجمالي المنفق" 
                        value={`$${analytics.totalSpent.toFixed(2)}`}
                        icon={<svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} 
                    />
                     <StatCard 
                        title="المتابعين المكتسبين" 
                        value={analytics.followersGained.toLocaleString()}
                        icon={<svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} 
                    />
                </div>

                {/* Order History Table */}
                <div>
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <h2 className="text-2xl font-bold text-white">سجل الطلبات</h2>
                         {orders.length > 0 && (
                            <div className="flex items-center gap-2">
                                <label htmlFor="sort-orders" className="text-gray-400 font-semibold">ترتيب حسب:</label>
                                <div className="relative">
                                    <select
                                        id="sort-orders"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                        className="bg-gray-700 text-white font-semibold py-2 pl-4 pr-8 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    >
                                        <option value="newest">الأحدث أولاً</option>
                                        <option value="oldest">الأقدم أولاً</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-400">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                         )}
                    </div>
                     {orders.length > 0 ? (
                        <>
                            {/* Filter controls */}
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="text-gray-400 font-semibold">فلترة حسب الحالة:</span>
                                {filterOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => setFilterStatus(option.value)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${filterStatus === option.value ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>

                            {displayedOrders.length > 0 ? (
                                <div className="bg-brand-card rounded-xl shadow-lg overflow-x-auto">
                                    <table className="w-full text-right">
                                        <thead className="border-b border-gray-700">
                                            <tr>
                                                <th className="p-4 font-semibold text-gray-300">رقم الطلب</th>
                                                <th className="p-4 font-semibold text-gray-300">التاريخ</th>
                                                <th className="p-4 font-semibold text-gray-300">المنصة</th>
                                                <th className="p-4 font-semibold text-gray-300">الخدمة</th>
                                                <th className="p-4 font-semibold text-gray-300">الكمية</th>
                                                <th className="p-4 font-semibold text-gray-300">التكلفة</th>
                                                <th className="p-4 font-semibold text-gray-300 text-center">الحالة</th>
                                                <th className="p-4 font-semibold text-gray-300 w-12"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedOrders.map(order => (
                                                <React.Fragment key={order.id}>
                                                    <tr className="border-b border-gray-700/50 hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                                                        <td className="p-4 text-gray-400 font-mono text-sm">{order.id}</td>
                                                        <td className="p-4 text-gray-400">{order.date}</td>
                                                        <td className="p-4 text-white font-semibold">
                                                            {order.platform === 'internal_fund_transfer' 
                                                                ? 'رصيد الحساب' 
                                                                : (platforms[order.platform]?.name || order.platform)
                                                            }
                                                        </td>
                                                        <td className="p-4 text-gray-300">{order.service}</td>
                                                        <td className="p-4 text-gray-300">{order.quantity.toLocaleString()}</td>
                                                        <td className="p-4 text-brand-primary font-bold">${order.cost.toFixed(2)}</td>
                                                        <td className="p-4 text-center"><StatusBadge status={order.status} /></td>
                                                        <td className="p-4 text-center">
                                                            <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </td>
                                                    </tr>
                                                    {expandedOrderId === order.id && (
                                                        <tr className="bg-gray-800/50">
                                                            <td colSpan={8} className="p-4">
                                                                <OrderTimeline status={order.status} />
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-brand-card rounded-xl">
                                    <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-white">لا توجد طلبات تطابق هذا الفلتر</h3>
                                    <p className="mt-1 text-sm text-gray-400">حاول اختيار فلتر مختلف لعرض طلباتك.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 bg-brand-card rounded-xl">
                            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-white">لا توجد طلبات</h3>
                            <p className="mt-1 text-sm text-gray-400">ابدأ بطلبك الأول ليظهر هنا.</p>
                        </div>
                    )}
                </div>
            </div>
            {isTrackingModalOpen && (
                <FundRequestTrackerModal
                    requests={fundRequests}
                    onClose={() => setIsTrackingModalOpen(false)}
                />
            )}
            {isMessagesModalOpen && (
                <MessagesModal
                    messages={messages}
                    onClose={() => setIsMessagesModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;