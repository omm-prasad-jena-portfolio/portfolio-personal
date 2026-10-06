import React from 'react';
import { Clock, CheckCircle2, Flame, Timer, ChevronDown } from 'lucide-react';
import Card from '../ui/Card';
import { useDashboardData } from '../../context/DashboardContext';

export const StudyAnalytics: React.FC = () => {
  const { data } = useDashboardData();
  const { studyAnalytics } = data;

  const maxHours = 6;

  return (
    <Card>
      <div className="study-card-title">
        <span>Study Analytics</span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            background: 'var(--bg-input)',
            padding: '4px 10px',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          <span>This Week</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="analytics-stats-grid">
        <div className="analytics-stat-item">
          <div className="analytics-stat-icon" style={{ background: 'rgba(255, 107, 53, 0.15)', color: '#ff6b35' }}>
            <Clock size={16} />
          </div>
          <div className="analytics-stat-info">
            <h5>{studyAnalytics.totalTime}</h5>
            <p>Total Study Time</p>
          </div>
        </div>

        <div className="analytics-stat-item">
          <div className="analytics-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle2 size={16} />
          </div>
          <div className="analytics-stat-info">
            <h5>{studyAnalytics.tasksCompleted}</h5>
            <p>Tasks Completed</p>
          </div>
        </div>

        <div className="analytics-stat-item">
          <div className="analytics-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Timer size={16} />
          </div>
          <div className="analytics-stat-info">
            <h5>{studyAnalytics.avgFocus}</h5>
            <p>Average Focus</p>
          </div>
        </div>

        <div className="analytics-stat-item">
          <div className="analytics-stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
            <Flame size={16} />
          </div>
          <div className="analytics-stat-info">
            <h5>{studyAnalytics.longestStreak}</h5>
            <p>Longest Streak</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, margin: '0 0 12px 0' }}>
          Study Time
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '110px' }}>
          {studyAnalytics.weeklyTimeBars.map((bar) => {
            const heightPercent = (bar.hours / maxHours) * 100;
            return (
              <div key={bar.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '6px' }}>
                <div style={{ width: '18px', height: '80px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${heightPercent}%`,
                      background: 'linear-gradient(180deg, #a855f7 0%, #7e22ce 100%)',
                      borderRadius: '10px',
                      transition: 'height 0.6s ease',
                    }}
                  />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{bar.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default StudyAnalytics;
