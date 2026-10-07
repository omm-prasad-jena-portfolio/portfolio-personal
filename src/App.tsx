import React from 'react';
import { usePrivateAuth } from './context/PrivateAuthContext';
import { DashboardProvider } from './context/DashboardContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';

import { API_BASE_URL } from './services/privateApi';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, isBackendUnavailable, checkSession } = usePrivateAuth();

  if (isLoading) {
    return (
      <div className="personal-container">
        <div className="loading-text">Checking access...</div>
      </div>
    );
  }

  if (isBackendUnavailable) {
    return (
      <div className="personal-container">
        <div className="personal-card" style={{ maxWidth: '480px', textAlign: 'center' }}>
          <h1>Session Error</h1>
          <p>Unable to connect to the backend server to verify your session.</p>
          <div style={{ margin: '16px 0', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', fontSize: '12px', color: '#94a3b8', wordBreak: 'break-all' }}>
            Backend API: <code style={{ color: '#ff6b35' }}>{API_BASE_URL}</code>
          </div>
          <button type="button" className="btn-primary" onClick={checkSession}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="personal-container">
        <div className="loading-text">Redirecting to public portfolio...</div>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <DashboardLayout currentPath="/">
        <Dashboard />
      </DashboardLayout>
    </DashboardProvider>
  );
};

export default App;
