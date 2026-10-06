import React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import { useDashboardData } from '../../context/DashboardContext';

export const LearningOverview: React.FC = () => {
  const { data } = useDashboardData();
  const { learningOverview } = data;

  return (
    <Card>
      <div className="study-card-title">
        <span>Learning Overview</span>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 2px 0' }}>
            Average completion rate
          </p>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: '0 0 2px 0' }}>
            {learningOverview.averageRate}%
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
            {learningOverview.dateRange}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button type="button" className="study-date-arrow-btn" aria-label="Previous Week">
            <ChevronLeft size={14} />
          </button>
          <button type="button" className="study-date-arrow-btn" aria-label="Next Week">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="chart-bars-wrapper">
        {learningOverview.bars.map((bar) => (
          <div key={bar.day} className="chart-bar-column">
            <div className="chart-bar-container">
              <div
                className="chart-bar-fill"
                style={{ height: `${bar.rate}%` }}
              >
                <span className="chart-bar-label">{bar.rate}%</span>
              </div>
            </div>
            <span className="chart-day-text">{bar.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LearningOverview;
