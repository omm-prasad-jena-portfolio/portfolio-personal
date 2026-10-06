import React from 'react';
import GreetingHeader from '../components/dashboard/GreetingHeader';
import DailyChallenge from '../components/dashboard/DailyChallenge';
import WeeklyStreak from '../components/dashboard/WeeklyStreak';
import StudyHoursCard from '../components/dashboard/StudyHoursCard';
import StreakCard from '../components/dashboard/StreakCard';
import CurrentSession from '../components/dashboard/CurrentSession';
import TodaysPlan from '../components/dashboard/TodaysPlan';
import LearningOverview from '../components/dashboard/LearningOverview';
import QuickActions from '../components/dashboard/QuickActions';
import SubjectProgress from '../components/dashboard/SubjectProgress';
import TasksCard from '../components/dashboard/TasksCard';
import StudyAnalytics from '../components/dashboard/StudyAnalytics';

export const Dashboard: React.FC = () => {
  return (
    <div style={{ width: '100%' }}>
      <GreetingHeader />

      {/* Row 1: Top Dashboard Cards */}
      <div className="dashboard-grid-top">
        <DailyChallenge />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <WeeklyStreak />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <StudyHoursCard />
            <StreakCard />
          </div>
        </div>
        <CurrentSession />
      </div>

      {/* Row 2: Today's Plan, Learning Overview, Quick Actions */}
      <div className="dashboard-grid-main">
        <TodaysPlan />
        <LearningOverview />
        <QuickActions />
      </div>

      {/* Row 3: Subject Progress, Tasks, Study Analytics */}
      <div className="dashboard-grid-bottom">
        <SubjectProgress />
        <TasksCard />
        <StudyAnalytics />
      </div>
    </div>
  );
};

export default Dashboard;
