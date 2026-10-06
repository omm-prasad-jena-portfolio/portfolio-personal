import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { mockDashboardData } from '../../data/mockDashboardData';

export const Topbar: React.FC = () => {
  const { user } = mockDashboardData;

  return (
    <header className="study-topbar">
      <div className="study-search-bar">
        <Search size={16} color="#94a3b8" />
        <input
          type="text"
          className="study-search-input"
          placeholder="Search subjects, tasks, notes..."
        />
        <span className="study-search-key">⌘K</span>
      </div>

      <div className="study-topbar-right">
        <div className="study-notification-icon" title="Notifications">
          <Bell size={18} />
          <div className="study-notification-dot" />
        </div>

        <div className="study-profile-badge">
          <img
            src={user.avatar}
            alt={user.name}
            className="study-profile-avatar"
          />
          <div className="study-profile-info">
            <span className="study-profile-name">Hello, {user.name}</span>
            <span className="study-profile-sub">{user.greeting}</span>
          </div>
          <ChevronDown size={14} color="#94a3b8" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
