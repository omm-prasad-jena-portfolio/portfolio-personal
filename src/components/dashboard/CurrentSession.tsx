import React from 'react';
import { Play } from 'lucide-react';
import Card from '../ui/Card';
import { useDashboardData } from '../../context/DashboardContext';

export const CurrentSession: React.FC = () => {
  const { data } = useDashboardData();
  const { currentSession } = data;

  return (
    <Card className="current-session-card">
      <div className="current-session-banner">
        <span className="session-overlay-badge">{currentSession.subject}</span>
      </div>

      <div className="current-session-body">
        <div className="current-session-title">
          <p style={{ fontSize: '11px', color: '#a855f7', fontWeight: 600, margin: '0 0 2px 0' }}>
            Current Session
          </p>
          <h4>{currentSession.title}</h4>
          <p>{currentSession.current}</p>
        </div>

        <button type="button" className="session-play-btn" aria-label="Play Session">
          <Play size={18} fill="#fff" />
        </button>
      </div>
    </Card>
  );
};

export default CurrentSession;
