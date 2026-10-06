import React from 'react';
import { Flame } from 'lucide-react';
import Card from '../ui/Card';
import { useDashboardData } from '../../context/DashboardContext';

export const StreakCard: React.FC = () => {
  const { data } = useDashboardData();
  const { streak } = data;

  return (
    <Card>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
        Streak
      </span>

      <div className="streak-card-content">
        <div className="streak-fire-icon">
          <Flame size={24} fill="#ff6b35" />
        </div>
        <div className="streak-info">
          <h4>{streak.label}</h4>
          <p>{streak.subtitle}</p>
        </div>
      </div>
    </Card>
  );
};

export default StreakCard;
