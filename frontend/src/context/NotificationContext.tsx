import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  timestamp: Date;
  read: boolean;
  requestId?: string;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// Generate contextual notifications from app state
export function generateCitizenNotifications(): Notification[] {
  return [
    {
      id: 'n-c-1',
      title: 'Pickup Scheduled',
      message: 'Your E-Waste pickup (Old HP Pavilion Laptop) is confirmed for tomorrow, 3:00–5:00 PM.',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      requestId: 'WW1020'
    },
    {
      id: 'n-c-2',
      title: 'Request #WW1042 Assigned',
      message: 'Your inverter battery collection has been assigned to a pickup team.',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      requestId: 'WW1042'
    },
    {
      id: 'n-c-3',
      title: 'E-Waste Processing Complete',
      message: 'Your HP laptop was processed at Chakan Green Tech Park. 94.2% materials recovered.',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      requestId: 'WW1020'
    }
  ];
}

export function generateAdminNotifications(): Notification[] {
  return [
    {
      id: 'n-a-1',
      title: '4 Requests Need Attention',
      message: 'High-priority hazardous waste requests are waiting >2 days and require immediate dispatch.',
      type: 'urgent',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      read: false,
    },
    {
      id: 'n-a-2',
      title: 'Smart Batch Opportunity',
      message: '3 Wakad pickups can be combined into a single collection run. Estimated savings: 4.2 kg CO₂.',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: false,
    },
    {
      id: 'n-a-3',
      title: 'New Hazardous Waste Request',
      message: 'Dr. Gaikwad (Aundh) submitted pharmaceutical disposal — classified HIGH priority.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: false,
      requestId: 'WW1052'
    },
    {
      id: 'n-a-4',
      title: 'Batch B-001 En Route',
      message: 'Pawan Jadhav (MH-12-WW-4028) is currently collecting Wakad Glass waste.',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: true,
    }
  ];
}

export const NotificationProvider: React.FC<{ children: ReactNode; role: 'citizen' | 'admin' }> = ({ children, role }) => {
  const [notifications, setNotifications] = useState<Notification[]>(
    role === 'admin' ? generateAdminNotifications() : generateCitizenNotifications()
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [{
      ...n,
      id: `n-${Date.now()}`,
      timestamp: new Date(),
      read: false
    }, ...prev]);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllRead, addNotification, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}

export function formatNotificationTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
