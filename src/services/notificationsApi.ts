import { API_BASE_URL } from './privateApi';

export interface NotificationData {
  id?: number;
  title: string;
  message: string;
  type?: string;
  read?: boolean;
}

export async function fetchNotifications(): Promise<NotificationData[]> {
  const res = await fetch(`${API_BASE_URL}/api/private/notifications/`, { credentials: 'include' });
  if (res.ok) return res.json();
  return [];
}
