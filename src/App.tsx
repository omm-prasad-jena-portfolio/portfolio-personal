import React from 'react';
import { usePrivateAuth } from './context/PrivateAuthContext';
import { DashboardProvider } from './context/DashboardContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';

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
        <div className="personal-card">
          <h1>Session Error</h1>
          <p>Unable to verify your session. Please try again.</p>
          <button type="button" className="btn-primary" onClick={checkSession}>
            Retry
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
