import { API_BASE_URL } from './privateApi';

export interface StudySessionData {
  id?: number;
  subject?: number;
  task?: number;
  title: string;
  started_at?: string;
  ended_at?: string;
  duration_seconds?: number;
  status?: string;
  notes?: string;
}

export async function fetchCurrentSession(): Promise<StudySessionData | null> {
  const res = await fetch(`${API_BASE_URL}/api/private/study-sessions/current/`, { credentials: 'include' });
  if (res.ok) {
    const data = await res.json();
    return data.id ? data : null;
  }
  return null;
}

export async function startSession(subjectId?: number, taskId?: number, title?: string): Promise<StudySessionData> {
  const res = await fetch(`${API_BASE_URL}/api/private/study-sessions/start/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ subject: subjectId, task: taskId, title }),
  });
  return res.json();
}

export async function stopSession(id: number, notes?: string): Promise<StudySessionData> {
  const res = await fetch(`${API_BASE_URL}/api/private/study-sessions/${id}/stop/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ notes }),
  });
  return res.json();
}
