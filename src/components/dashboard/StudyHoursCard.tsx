import React from 'react';
import { Clock } from 'lucide-react';
import Card from '../ui/Card';
import ProgressRing from '../ui/ProgressRing';
import { useDashboardData } from '../../context/DashboardContext';

export const StudyHoursCard: React.FC = () => {
  const { data } = useDashboardData();
  const { studyHours } = data;

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7' }}>
        <Clock size={16} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Study Hours
        </span>
      </div>

      <div className="study-hours-content">
        <div className="study-hours-text">
          <h4>{studyHours.formattedCurrent}</h4>
          <p>of {studyHours.goalHours}h goal</p>
        </div>
        <ProgressRing percentage={studyHours.percentage} color="#ff6b35" size={54} />
      </div>
    </Card>
  );
};

export default StudyHoursCard;
