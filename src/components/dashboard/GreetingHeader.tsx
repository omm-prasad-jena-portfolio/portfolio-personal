import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { useDashboardData } from '../../context/DashboardContext';

export const GreetingHeader: React.FC = () => {
  const { data } = useDashboardData();
  const { user, dateInfo } = data;
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  return (
    <div className="study-greeting-section">
      <div className="study-greeting-text">
        <h2>Hello, {user.name} 👋</h2>
        <p>Discipline today, better tomorrow.</p>
      </div>

      <div className="study-greeting-controls">
        <div className="study-date-badge">
          <Calendar size={14} color="#a855f7" />
          <span>{dateInfo.formatted}</span>
          <div className="study-date-arrows">
            <button type="button" className="study-date-arrow-btn" aria-label="Previous Day">
              <ChevronLeft size={14} />
            </button>
            <button type="button" className="study-date-arrow-btn" aria-label="Next Day">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="study-theme-toggle">
          <button
            type="button"
            className={`study-theme-btn ${isDarkTheme ? 'active' : ''}`}
            onClick={() => setIsDarkTheme(true)}
            aria-label="Dark Mode"
          >
            <Moon size={14} />
          </button>
          <button
            type="button"
            className={`study-theme-btn ${!isDarkTheme ? 'active' : ''}`}
            onClick={() => setIsDarkTheme(false)}
            aria-label="Light Mode"
          >
            <Sun size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GreetingHeader;
