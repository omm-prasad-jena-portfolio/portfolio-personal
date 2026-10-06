import { API_BASE_URL } from './privateApi';

export interface SubjectData {
  id?: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  target_minutes?: number;
}

export async function fetchSubjects(): Promise<SubjectData[]> {
  const res = await fetch(`${API_BASE_URL}/api/private/subjects/`, { credentials: 'include' });
  if (res.ok) return res.json();
  return [];
}

export async function createSubject(data: SubjectData): Promise<SubjectData> {
  const res = await fetch(`${API_BASE_URL}/api/private/subjects/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateSubject(id: number, data: Partial<SubjectData>): Promise<SubjectData> {
  const res = await fetch(`${API_BASE_URL}/api/private/subjects/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteSubject(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/private/subjects/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.ok;
}
