import React, { useState, useMemo } from 'react';
import type { FundTransferRequest, View } from '../types';

interface FundRequestManagementProps {
    requests: FundTransferRequest[];
    onApprove: (requestId: string) => void;
    onReject: (requestId: string) => void;
    setView: (view: View) => void;
}

const StatusBadge: React.FC<{ status: FundTransferRequest['status'] }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
    const statusClasses = {
        Approved: "bg-green-500/20 text-green-400",
        Rejected: "bg-red-500/20 text-red-400",
        Pending: "bg-blue-500/20 text-blue-400",
    };
    const statusText = {
        Approved: "موافق عليه",
        Rejected: "مرفوض",
        Pending: "قيد الانتظار",
    }
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{statusText[status]}</span>
};

const ImageViewerModal: React.FC<{ imageUrl: string, onClose: () => void }> = ({ imageUrl, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="إثبات التحويل" className="max-w-full max-h-[90vh] object-contain rounded-lg"/>
                <button onClick={onClose} className="absolute -top-4 -right-4 bg-white text-black rounded-full h-10 w-10 flex items-center justify-center text-2xl font-bold">
                    &times;
                </button>
            </div>
        </div>
    );
};


const FundRequestManagement: React.FC<FundRequestManagementProps> = ({ requests, onApprove, onReject, setView }) => {
    const [filterStatus, setFilterStatus] = useState<FundTransferRequest['status'] | 'All'>('Pending');
    const [viewingImage, setViewingImage] = useState<string | null>(null);

    const displayedRequests = useMemo(() => {
        if (filterStatus === 'All') return requests;
        return requests.filter(r => r.status === filterStatus);
    }, [requests, filterStatus]);
    
    const filterOptions: {label: string, value: FundTransferRequest['status'] | 'All'}[] = [
        { label: 'قيد الانتظار', value: 'Pending' },
        { label: 'موافق عليه', value: 'Approved' },
        { label: 'مرفوض', value: 'Rejected' },
        { label: 'الكل', value: 'All' },
    ];

    return (
        <div className="py-12 sm:py-20 bg-black bg-opacity-20 animate-fade-in-down">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">إدارة طلبات شحن الرصيد</h1>
                            <p className="text-gray-400">مراجعة والموافقة على طلبات التحويل البنكي.</p>
                        </div>
                         <button onClick={() => setView('admin')} className="text-brand-primary hover:underline">
                            &larr; العودة إلى لوحة تحكم المسؤول
                        </button>
                    </div>

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

                    {displayedRequests.length > 0 ? (
                        <div className="bg-brand-card rounded-xl shadow-lg overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="border-b border-gray-700">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-300">بريد المستخدم</th>
                                        <th className="p-4 font-semibold text-gray-300">التاريخ</th>
                                        <th className="p-4 font-semibold text-gray-300">المبلغ</th>
                                        <th className="p-4 font-semibold text-gray-300">البنك</th>
                                        <th className="p-4 font-semibold text-gray-300 text-center">الإثبات</th>
                                        <th className="p-4 font-semibold text-gray-300 text-center">الحالة</th>
                                        <th className="p-4 font-semibold text-gray-300">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedRequests.map(req => (
                                        <tr key={req.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="p-4 text-gray-300">{req.userEmail}</td>
                                            <td className="p-4 text-gray-400 whitespace-nowrap">{req.date}</td>
                                            <td className="p-4 text-brand-primary font-bold">${req.amount.toFixed(2)}</td>
                                            <td className="p-4 text-white">{req.bankName}</td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => setViewingImage(req.screenshotDataUrl)} className="text-blue-400 hover:underline">
                                                    عرض الإثبات
                                                </button>
                                            </td>
                                            <td className="p-4 text-center">
                                                <StatusBadge status={req.status} />
                                            </td>
                                            <td className="p-4">
                                                {req.status === 'Pending' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => onApprove(req.id)} className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-500">موافقة</button>
                                                        <button onClick={() => onReject(req.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500">رفض</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
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
                            <p className="mt-1 text-sm text-gray-400">حاول اختيار فلتر مختلف لعرض الطلبات.</p>
                        </div>
                    )}

                </div>
            </div>
            {viewingImage && <ImageViewerModal imageUrl={viewingImage} onClose={() => setViewingImage(null)} />}
        </div>
    );
};

export default FundRequestManagement;
