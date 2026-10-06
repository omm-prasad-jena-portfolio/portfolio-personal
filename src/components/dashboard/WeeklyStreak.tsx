import React from 'react';
import { Check } from 'lucide-react';
import { useDashboardData } from '../../context/DashboardContext';

export const WeeklyStreak: React.FC = () => {
  const { data } = useDashboardData();
  const { weeklyStreak } = data;

  return (
    <div className="weekly-streak-container">
      {weeklyStreak.map((item) => (
        <div key={item.day} className="streak-day-box">
          <span className="streak-day-label">{item.day}</span>
          <div
            className={`streak-day-circle ${
              item.completed ? 'completed' : item.current ? 'current' : ''
            }`}
          >
            {item.completed ? <Check size={16} /> : item.current ? '●' : ''}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyStreak;
