import React from 'react';
import type { Order } from '../types';

const CheckIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const ProcessingIcon: React.FC = () => (
    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const PendingIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface OrderTimelineProps {
    status: Order['status'];
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
    const steps = [
        { name: 'تم استلام الطلب', status: 'Pending' },
        { name: 'قيد التنفيذ', status: 'In Progress' },
        { name: 'اكتمل الطلب', status: 'Completed' },
    ];

    const statusMap: Record<Order['status'], number> = {
        'Pending': 0,
        'In Progress': 1,
        'Completed': 2,
    };

    const currentStatusIndex = statusMap[status];

    return (
        <div className="p-4 bg-gray-800/70 rounded-lg animate-fade-in-down">
            <h4 className="text-lg font-bold text-white mb-6 text-center">مراحل تقدم الطلب</h4>
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;

                    const iconContainerColor = isCompleted ? 'bg-green-500' : isCurrent ? 'bg-brand-primary' : 'bg-gray-600';
                    const textColor = isCompleted ? 'text-green-400' : isCurrent ? 'text-white font-bold' : 'text-gray-400';
                    const lineColor = isCompleted ? 'bg-green-500' : 'bg-gray-600';

                    return (
                        <React.Fragment key={step.name}>
                            <div className="flex flex-col items-center text-center w-1/3 z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${iconContainerColor} transition-colors duration-500`}>
                                    {isCompleted ? <CheckIcon /> : isCurrent ? <ProcessingIcon /> : <PendingIcon />}
                                </div>
                                <p className={`mt-2 text-sm ${textColor} transition-colors duration-500`}>{step.name}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-grow h-1 ${lineColor} transition-colors duration-500`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTimeline;
