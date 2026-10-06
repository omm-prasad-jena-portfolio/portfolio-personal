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
  LucideIcon,
} from 'lucide-react';
import Card from '../ui/Card';
import { useDashboardData } from '../../context/DashboardContext';

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Coffee,
  Calculator,
  Code,
  Database,
};

export const TodaysPlan: React.FC = () => {
  const { data } = useDashboardData();
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
