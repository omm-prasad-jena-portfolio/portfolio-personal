import { API_BASE_URL } from './privateApi';

export interface ExamData {
  id?: number;
  subject?: number;
  subject_name?: string;
  title: string;
  exam_date: string;
  exam_time?: string;
  description?: string;
  priority?: string;
  status?: string;
}

export async function fetchExams(): Promise<ExamData[]> {
  const res = await fetch(`${API_BASE_URL}/api/private/exams/`, { credentials: 'include' });
  if (res.ok) return res.json();
  return [];
}

export async function createExam(data: ExamData): Promise<ExamData> {
  const res = await fetch(`${API_BASE_URL}/api/private/exams/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateExamApi(id: number, data: Partial<ExamData>): Promise<ExamData> {
  const res = await fetch(`${API_BASE_URL}/api/private/exams/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteExamApi(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/private/exams/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.ok;
}
