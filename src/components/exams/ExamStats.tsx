import React from 'react';
import { Calendar, CheckCircle2, BookOpen, Clock } from 'lucide-react';
import Card from '../ui/Card';
import { useExams } from '../../context/ExamsContext';

export const ExamStats: React.FC = () => {
  const { stats } = useExams();

  const statItems = [
    {
      id: 'upcoming',
      label: 'Upcoming Exams',
      value: stats.upcomingCount,
      icon: Calendar,
      color: '#ff6b35',
      bg: 'rgba(255, 107, 53, 0.15)',
    },
    {
      id: 'progress',
      label: 'Syllabus Covered',
      value: `${stats.overallProgress}%`,
      icon: CheckCircle2,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)',
    },
    {
      id: 'topics',
      label: 'Topics Completed',
      value: `${stats.completedTopics}/${stats.totalTopics}`,
      icon: BookOpen,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.15)',
    },
    {
      id: 'countdown',
      label: 'Days to Next Exam',
      value: stats.daysToNext !== null ? (stats.daysToNext === 0 ? 'Today' : `${stats.daysToNext}d`) : '—',
      icon: Clock,
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.15)',
    },
  ];

  return (
    <div className="exam-stats-grid">
      {statItems.map((item) => {
        const IconComp = item.icon;
        return (
          <Card key={item.id} className="exam-stat-card">
            <div className="exam-stat-icon-wrapper" style={{ backgroundColor: item.bg, color: item.color }}>
              <IconComp size={18} />
            </div>
            <div>
              <div className="exam-stat-value">{item.value}</div>
              <div className="exam-stat-label">{item.label}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ExamStats;
