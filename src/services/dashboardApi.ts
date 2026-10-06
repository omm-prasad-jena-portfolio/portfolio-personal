import { API_BASE_URL } from './privateApi';
import { DashboardData, mockDashboardData } from '../data/mockDashboardData';

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/private/dashboard/`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.status === 200) {
      const data = await response.json();
      
      const profile = data.profile || {};
      const challenge = data.daily_challenge || {};
      const studyHours = data.study_hours || {};
      const streak = data.streak || {};
      const currentSession = data.current_session;

      const formattedData: DashboardData = {
        user: {
          name: profile.display_name || 'Omm',
          greeting: profile.bio || "Let's study and grow!",
          avatar: profile.avatar || mockDashboardData.user.avatar,
        },
        dateInfo: {
          formatted: data.date || mockDashboardData.dateInfo.formatted,
        },
        dailyChallenge: {
          targetHours: Math.round((challenge.target_minutes || 60) / 60),
          text: challenge.description || challenge.title || "Complete today's challenge!",
        },
        weeklyStreak: data.weekly_streak || mockDashboardData.weeklyStreak,
        studyHours: {
          currentHours: studyHours.current || 0,
          goalHours: studyHours.target || 4,
          formattedCurrent: `${studyHours.current || 0}h`,
          percentage: studyHours.progress_percent || 0,
        },
        streak: {
          count: streak.count || 7,
          label: `${streak.count || 7} days`,
          subtitle: "Keep going!",
        },
        currentSession: currentSession ? {
          title: currentSession.title || "Study Session",
          current: `${Math.round((currentSession.duration_seconds || 0) / 60)} mins`,
          subject: currentSession.subject_name || "General",
          progress: Math.min(100, Math.round(((currentSession.duration_seconds || 0) / 3600) * 100)),
        } : mockDashboardData.currentSession,
        todaysPlan: (data.today_plan || []).map((item: any) => ({
          id: String(item.id),
          time: `${item.start_time || '09:00'} - ${item.end_time || '10:00'}`,
          subject: item.title,
          category: item.type || 'Study',
          icon: 'BookOpen',
          color: item.color || '#ff6b35',
          completed: Boolean(item.completed),
        })),
        learningOverview: mockDashboardData.learningOverview,
        quickActions: mockDashboardData.quickActions,
        subjectProgress: (data.subjects || []).map((s: any) => ({
          name: s.name,
          percentage: Math.min(100, Math.round((s.target_minutes / 180) * 100)),
          color: s.color || '#ff6b35',
          iconName: 'BookOpen',
        })),
        tasks: (data.tasks || []).map((t: any) => ({
          id: String(t.id),
          title: t.title,
          subject: t.subject_name || 'General',
          duration: `${t.duration_minutes || 30}m`,
          completed: Boolean(t.completed),
          category: t.completed ? 'Completed' : 'Today',
        })),
        studyAnalytics: {
          totalTime: `${data.learning_overview?.hours_this_week || 24.5} hrs`,
          tasksCompleted: `${data.learning_overview?.tasks_completed || 0} tasks`,
          avgFocus: '2.8 hrs',
          longestStreak: `${streak.count || 7} days`,
          weeklyTimeBars: data.analytics?.history || mockDashboardData.studyAnalytics.weeklyTimeBars,
        },
      };

      return formattedData;
    }
  } catch (err) {
    console.warn('Backend dashboard API failed, using fallback:', err);
  }

  return mockDashboardData;
}
