export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export interface SessionResponse {
  authenticated: boolean;
  message?: string;
}

export async function checkPrivateSession(): Promise<SessionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/private/session/`, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.status === 200) {
    const data = await response.json();
    return { authenticated: Boolean(data.authenticated) };
  } else if (response.status === 401) {
    return { authenticated: false };
  } else {
    throw new Error(`Unexpected status code: ${response.status}`);
  }
}

export async function logoutPrivate(): Promise<SessionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/private/logout/`, {
    method: 'POST',
    credentials: 'include',
  });

  if (response.status === 200) {
    const data = await response.json();
    return { authenticated: Boolean(data.authenticated) };
  }
  return { authenticated: false };
}
