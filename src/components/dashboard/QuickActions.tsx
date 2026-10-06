import React from 'react';
import {
  PlusCircle,
  BookOpen,
  Calendar,
  Sparkles,
  Timer,
  FileText,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import Card from '../ui/Card';
import { mockDashboardData } from '../../data/mockDashboardData';

const iconMap: Record<string, LucideIcon> = {
  PlusCircle,
  BookOpen,
  Calendar,
  Sparkles,
  Timer,
  FileText,
};


export const QuickActions: React.FC = () => {
  const { quickActions } = mockDashboardData;

  return (
    <Card>
      <div className="study-card-title">
        <span>Quick Actions</span>
        <a
          href="/customize"
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
          Customize <ArrowRight size={14} />
        </a>
      </div>

      <div className="quick-actions-grid">
        {quickActions.map((action) => {
          const IconComp = iconMap[action.iconName] || PlusCircle;
          return (
            <button
              key={action.id}
              type="button"
              className="quick-action-btn"
              onClick={() => alert(`Action clicked: ${action.label}`)}
            >
              <div
                className="quick-action-icon"
                style={{ backgroundColor: action.bg, color: action.color }}
              >
                <IconComp size={18} />
              </div>
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
