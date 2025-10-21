import React from 'react';
import type { FundTransferRequest } from '../types';

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


interface FundRequestTrackerModalProps {
    requests: FundTransferRequest[];
    onClose: () => void;
}

const FundRequestTrackerModal: React.FC<FundRequestTrackerModalProps> = ({ requests, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4 animate-fade-in-down"
            onClick={onClose}
        >
            <div 
                className="bg-brand-card rounded-2xl shadow-2xl w-full max-w-3xl p-6" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">حالة طلبات شحن الرصيد</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    {requests.length > 0 ? (
                        <table className="w-full text-right">
                            <thead className="sticky top-0 bg-brand-card">
                                <tr>
                                    <th className="p-3 font-semibold text-gray-300">التاريخ</th>
                                    <th className="p-3 font-semibold text-gray-300">المبلغ</th>
                                    <th className="p-3 font-semibold text-gray-300">البنك</th>
                                    <th className="p-3 font-semibold text-gray-300 text-center">الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id} className="border-b border-gray-700/50">
                                        <td className="p-3 text-gray-400 whitespace-nowrap">{req.date}</td>
                                        <td className="p-3 text-brand-primary font-bold">${req.amount.toFixed(2)}</td>
                                        <td className="p-3 text-white">{req.bankName}</td>
                                        <td className="p-3 text-center">
                                            <StatusBadge status={req.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                               <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-white">لا توجد طلبات شحن رصيد</h3>
                            <p className="mt-1 text-sm text-gray-400">عندما تقوم بطلب شحن رصيد جديد، سيظهر هنا.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FundRequestTrackerModal;