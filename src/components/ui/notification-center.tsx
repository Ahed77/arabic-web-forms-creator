
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: number;
}

interface NotificationCenterProps {
  className?: string;
}

const NOTIFICATIONS_STORAGE_KEY = 'app-notifications';

const iconMap = {
  info: <Info className="h-4 w-4 text-blue-500" />,
  success: <Check className="h-4 w-4 text-green-500" />,
  warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
  error: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const bgColorMap = {
  info: 'bg-blue-50',
  success: 'bg-green-50',
  warning: 'bg-amber-50',
  error: 'bg-red-50',
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (
    title: string,
    message: string,
    type: NotificationType = 'info'
  ) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      read: false,
      timestamp: Date.now(),
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep only 50 notifications
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const { 
    notifications, 
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${className}`}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex justify-between items-center border-b p-3">
          <h3 className="font-medium">الإشعارات</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                تعليم الكل كمقروء
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                مسح الكل
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
              <Bell className="h-10 w-10 mb-2 opacity-20" />
              <p>لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-3 hover:bg-gray-50 ${!notif.read ? bgColorMap[notif.type] : ''}`}
                >
                  <div className="flex justify-between">
                    <div className="flex gap-3">
                      {iconMap[notif.type]}
                      <div>
                        <h4 className="font-medium text-sm">{notif.title}</h4>
                        <p className="text-sm text-gray-600">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimestamp(notif.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {!notif.read && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => markAsRead(notif.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeNotification(notif.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
