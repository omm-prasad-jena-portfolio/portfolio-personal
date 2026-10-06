import React from 'react';
import {
  Home,
  Calendar,
  BookOpen,
  CheckSquare,
  FileSpreadsheet,
  Timer,
  BarChart2,
  CheckCircle2,
  Sparkles,
  FileText,
  Settings,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath = '/' }) => {
  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Schedule', icon: Calendar, path: '/schedule' },
    { label: 'Subjects', icon: BookOpen, path: '/subjects' },
    { label: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { label: 'Exams', icon: FileSpreadsheet, path: '/exams' },
    { label: 'Focus', icon: Timer, path: '/focus' },
    { label: 'Analytics', icon: BarChart2, path: '/analytics' },
    { label: 'Habits', icon: CheckCircle2, path: '/habits' },
    { label: 'AI Planner', icon: Sparkles, path: '/ai-planner' },
    { label: 'Notes', icon: FileText, path: '/notes' },
  ];

  return (
    <aside className="study-sidebar">
      <div>
        <div className="study-sidebar-logo">
          <div className="study-logo-icon">
            <Zap size={20} fill="#fff" />
          </div>
          <h1>Study</h1>
        </div>

        <ul className="study-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <li key={item.label}>
                <a
                  href={item.path}
                  className={`study-nav-item ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    if (item.path !== '/') {
                      e.preventDefault();
                    }
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="study-sidebar-bottom">
        <a
          href="/settings"
          className="study-nav-item"
          onClick={(e) => e.preventDefault()}
        >
          <Settings size={18} />
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
