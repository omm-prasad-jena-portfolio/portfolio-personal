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
