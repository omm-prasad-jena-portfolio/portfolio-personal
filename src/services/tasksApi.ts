import { API_BASE_URL } from './privateApi';

export interface TaskData {
  id?: number;
  subject?: number;
  subject_name?: string;
  title: string;
  description?: string;
  duration_minutes?: number;
  due_date?: string;
  scheduled_date?: string;
  status?: string;
  priority?: string;
  completed?: boolean;
}

export async function fetchTasks(): Promise<TaskData[]> {
  const res = await fetch(`${API_BASE_URL}/api/private/tasks/`, { credentials: 'include' });
  if (res.ok) return res.json();
  return [];
}

export async function createTask(data: TaskData): Promise<TaskData> {
  const res = await fetch(`${API_BASE_URL}/api/private/tasks/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTask(id: number, data: Partial<TaskData>): Promise<TaskData> {
  const res = await fetch(`${API_BASE_URL}/api/private/tasks/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/private/tasks/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.ok;
}
