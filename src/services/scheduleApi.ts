import { API_BASE_URL } from './privateApi';

export interface ScheduleItemData {
  id?: number;
  subject?: number;
  task?: number;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
  type?: string;
  color?: string;
  completed?: boolean;
}

export async function fetchSchedule(): Promise<ScheduleItemData[]> {
  const res = await fetch(`${API_BASE_URL}/api/private/schedule/`, { credentials: 'include' });
  if (res.ok) return res.json();
  return [];
}

export async function createScheduleItem(data: ScheduleItemData): Promise<ScheduleItemData> {
  const res = await fetch(`${API_BASE_URL}/api/private/schedule/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateScheduleItem(id: number, data: Partial<ScheduleItemData>): Promise<ScheduleItemData> {
  const res = await fetch(`${API_BASE_URL}/api/private/schedule/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteScheduleItem(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/private/schedule/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.ok;
}
