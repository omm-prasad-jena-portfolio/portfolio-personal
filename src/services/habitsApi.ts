import { API_BASE_URL } from './privateApi';

export interface HabitData {
  id?: number;
  name: string;
  description?: string;
  frequency?: string;
  target?: number;
  logs?: any[];
}

export async function fetchHabits(): Promise<HabitData[]> {
  const res = await fetch(`${API_BASE_URL}/api/private/habits/`, { credentials: 'include' });
  if (res.ok) return res.json();
  return [];
}
