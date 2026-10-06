import { API_BASE_URL } from './privateApi';

export interface NoteData {
  id?: number;
  subject?: number;
  subject_name?: string;
  title: string;
  content?: string;
  tags?: string[];
}

export async function fetchNotes(): Promise<NoteData[]> {
  const res = await fetch(`${API_BASE_URL}/api/private/notes/`, { credentials: 'include' });
  if (res.ok) return res.json();
  return [];
}

export async function createNote(data: NoteData): Promise<NoteData> {
  const res = await fetch(`${API_BASE_URL}/api/private/notes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}
