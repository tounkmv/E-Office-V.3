export type NotificationCategory = 'all' | 'urgent' | 'signature' | 'task' | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'urgent' | 'signature' | 'task' | 'system';
  timestamp: string;
  read: boolean;
  docId?: string;
  docNumber?: string;
  taskId?: string;
  priority?: string;
  actionUrl?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'urgent' | 'warning' | 'info';
  duration?: number;
  docNumber?: string;
}
