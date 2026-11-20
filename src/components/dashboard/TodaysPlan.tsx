import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Coffee,
  Calculator,
  Code,
  Database,
  ArrowRight,
  Check,
  ChevronRight,
  FileSpreadsheet,
  LucideIcon,
} from 'lucide-react';
import Card from '../ui/Card';
import { useDashboardData } from '../../context/DashboardContext';
import { useExams } from '../../context/ExamsContext';

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Coffee,
  Calculator,
  Code,
  Database,
};

export const TodaysPlan: React.FC = () => {
  const { data } = useDashboardData();
  const { stats } = useExams();
  const [plansList, setPlansList] = useState(data.todaysPlan);

  useEffect(() => {
    setPlansList(data.todaysPlan);
  }, [data.todaysPlan]);

  const toggleCheck = (id: string) => {
    setPlansList(
      plansList.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p))
    );
  };

  return (
    <Card>
      <div className="study-card-title">
        <span>Today's Plan</span>
        <a
          href="/schedule"
          style={{
            fontSize: '12px',
            color: 'var(--accent-orange)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onClick={(e) => e.preventDefault()}
        >
          See All <ArrowRight size={14} />
        </a>
      </div>

      {stats.nextExam && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            marginBottom: '16px',
            background: 'rgba(255, 107, 53, 0.08)',
            border: '1px solid rgba(255, 107, 53, 0.25)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          }}
          onClick={() => {
            window.history.pushState({}, '', '/exams');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          title="Go to Exams"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={15} color="var(--accent-orange)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Next Exam: {stats.nextExam.subjectName}
            </span>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--accent-orange)',
              background: 'rgba(255, 107, 53, 0.2)',
              padding: '2px 8px',
              borderRadius: '9999px',
            }}
          >
            {stats.nextExam.derived.daysLeftLabel}
          </span>
        </div>
      )}

      <div className="plan-rows-list">
        {plansList.map((plan) => {
          const IconComp = iconMap[plan.icon] || BookOpen;
          return (
            <div key={plan.id} className="plan-row-item">
              <div className="plan-row-left">
                <span className="plan-time">{plan.time}</span>
                <div
                  className="plan-bar-indicator"
                  style={{ backgroundColor: plan.color }}
                />
                <div
                  className="plan-icon-box"
                  style={{
                    backgroundColor: `${plan.color}20`,
                    color: plan.color,
                  }}
                >
                  <IconComp size={16} />
                </div>
                <div className="plan-details">
                  <h5>{plan.subject}</h5>
                  <p>{plan.category}</p>
                </div>
              </div>

              <button
                type="button"
                className={`plan-action-check ${plan.completed ? 'completed' : ''}`}
                onClick={() => toggleCheck(plan.id)}
              >
                {plan.completed ? <Check size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TodaysPlan;
