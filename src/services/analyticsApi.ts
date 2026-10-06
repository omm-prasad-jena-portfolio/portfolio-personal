import { API_BASE_URL } from './privateApi';

export async function fetchAnalyticsOverview() {
  const res = await fetch(`${API_BASE_URL}/api/private/analytics/overview/`, { credentials: 'include' });
  if (res.ok) return res.json();
  return null;
}

export async function fetchStudyTimeHistory() {
  const res = await fetch(`${API_BASE_URL}/api/private/analytics/study-time/`, { credentials: 'include' });
  if (res.ok) return res.json();
  return { history: [] };
}
