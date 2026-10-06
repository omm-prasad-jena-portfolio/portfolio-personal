import React from 'react';
import { Sigma, Monitor, Code2, Database, Cpu, ArrowRight, LucideIcon } from 'lucide-react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { useDashboardData } from '../../context/DashboardContext';

const iconMap: Record<string, LucideIcon> = {
  Sigma,
  Monitor,
  Code2,
  Database,
  Cpu,
};

export const SubjectProgress: React.FC = () => {
  const { data } = useDashboardData();
  const { subjectProgress } = data;

  return (
    <Card>
      <div className="study-card-title">
        <span>Subject Progress</span>
        <a
          href="/subjects"
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onClick={(e) => e.preventDefault()}
        >
          View All <ArrowRight size={14} />
        </a>
      </div>

      <div className="subject-progress-list">
        {subjectProgress.map((item) => {
          const IconComp = iconMap[item.iconName] || Monitor;
          return (
            <div key={item.name} className="subject-progress-item">
              <div className="subject-info-row">
                <div className="subject-info-left">
                  <IconComp size={16} color={item.color} />
                  <span>{item.name}</span>
                </div>
                <span className="subject-info-right">{item.percentage}%</span>
              </div>
              <ProgressBar percentage={item.percentage} color={item.color} height={6} />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SubjectProgress;
