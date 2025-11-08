import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Notification } from '../types';

// Lucide React Icons (as SVG paths to avoid external dependencies)
const InfoIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>);
const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const XCircleIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>);
const AlertTriangleIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>);


interface NotificationToastProps {
    notification: Notification | null;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification }) => {
    if (!notification) return null;

    const { message, type } = notification;

    let bgColorClass = 'bg-blue-500';
    let icon = <InfoIcon className="w-5 h-5 text-white" />;

    switch (type) {
        case 'success':
            bgColorClass = 'bg-green-500';
            icon = <CheckCircleIcon className="w-5 h-5 text-white" />;
            break;
        case 'error':
            bgColorClass = 'bg-red-500';
            icon = <XCircleIcon className="w-5 h-5 text-white" />;
            break;
        case 'warning':
            bgColorClass = 'bg-yellow-500';
            icon = <AlertTriangleIcon className="w-5 h-5 text-white" />;
            break;
        case 'info':
        default:
            bgColorClass = 'bg-blue-500';
            icon = <InfoIcon className="w-5 h-5 text-white" />;
            break;
    }

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    key="notification-toast"
                    initial={{ opacity: 0, y: -50, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -50, x: "-50%" }}
                    transition={{ duration: 0.3 }}
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center space-x-3 text-white ${bgColorClass}`}
                    role="alert"
                >
                    {icon}
                    <p className="text-base font-semibold">{message}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationToast;