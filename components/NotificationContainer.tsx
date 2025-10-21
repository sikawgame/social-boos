import React from 'react';
import type { Notification } from '../types';

interface NotificationToastProps {
  notification: Notification;
  onRemove: (id: number) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onRemove }) => {
  const typeClasses = {
    success: 'bg-green-500/90 border-green-400',
    info: 'bg-blue-500/90 border-blue-400',
    error: 'bg-red-500/90 border-red-400',
  };

  const Icon = ({ type }: { type: Notification['type'] }) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default: return null;
    }
  };

  return (
    <div className={`flex items-start p-4 mb-4 rounded-lg shadow-2xl border-l-4 w-full max-w-sm text-white ${typeClasses[notification.type]} animate-toast-in`}>
      <div className="flex-shrink-0">
        <Icon type={notification.type} />
      </div>
      <div className="flex-grow mr-3">
        <p className="font-bold">{notification.message}</p>
      </div>
      <button onClick={() => onRemove(notification.id)} className="flex-shrink-0 opacity-70 hover:opacity-100">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, removeNotification }) => {
  return (
    <>
      <div className="fixed top-5 left-5 z-[200] space-y-2">
        {notifications.map(notification => (
          <NotificationToast key={notification.id} notification={notification} onRemove={removeNotification} />
        ))}
      </div>
      <style>{`
        @keyframes toast-in {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-toast-in {
          animation: toast-in 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default NotificationContainer;
