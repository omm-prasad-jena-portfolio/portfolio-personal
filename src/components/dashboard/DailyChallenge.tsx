import React from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import { useDashboardData } from '../../context/DashboardContext';

export const DailyChallenge: React.FC = () => {
  const { data } = useDashboardData();
  const { dailyChallenge } = data;

  return (
    <Card className="daily-challenge-card">
      <div className="daily-challenge-info">
        <h3>
          <Zap size={18} color="#ff6b35" fill="#ff6b35" />
          Daily Challenge
        </h3>
        <p>{dailyChallenge.text}</p>
        <button type="button" className="daily-challenge-btn" aria-label="Start Challenge">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="daily-target-visual">
        <div className="target-outer-ring" />
        <div className="target-inner-dot">
          <Zap size={22} color="#fff" fill="#fff" />
        </div>
      </div>
    </Card>
  );
};

export default DailyChallenge;
