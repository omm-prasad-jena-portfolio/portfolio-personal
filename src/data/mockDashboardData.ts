export interface UserProfile {
  name: string;
  greeting: string;
  avatar: string;
}

export interface StreakDay {
  day: string;
  completed: boolean;
  current?: boolean;
}

export interface PlanItem {
  id: string;
  time: string;
  subject: string;
  category: string;
  icon: string;
  color: string;
  completed: boolean;
}

export interface LearningBar {
  day: string;
  rate: number;
}

export interface QuickAction {
  id: string;
  label: string;
  iconName: string;
  color: string;
  bg: string;
}

export interface SubjectProgressItem {
  name: string;
  percentage: number;
  color: string;
  iconName: string;
}

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  duration: string;
  completed: boolean;
  category: 'Today' | 'Upcoming' | 'Completed';
}

export interface AnalyticsBar {
  day: string;
  hours: number;
}

export interface DashboardData {
  user: UserProfile;
  dateInfo: {
    formatted: string;
  };
  dailyChallenge: {
    targetHours: number;
    text: string;
  };
  weeklyStreak: StreakDay[];
  studyHours: {
    currentHours: number;
    goalHours: number;
    formattedCurrent: string;
    percentage: number;
  };
  streak: {
    count: number;
    label: string;
    subtitle: string;
  };
  currentSession: {
    title: string;
    current: string;
    subject: string;
    progress: number;
  };
  todaysPlan: PlanItem[];
  learningOverview: {
    averageRate: number;
    dateRange: string;
    bars: LearningBar[];
  };
  quickActions: QuickAction[];
  subjectProgress: SubjectProgressItem[];
  tasks: TaskItem[];
  studyAnalytics: {
    totalTime: string;
    tasksCompleted: string;
    avgFocus: string;
    longestStreak: string;
    weeklyTimeBars: AnalyticsBar[];
  };
}

export const mockDashboardData: DashboardData = {
  user: {
    name: "Omm",
    greeting: "Let's study and grow!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  dateInfo: {
    formatted: "Mon, 6 Oct 2025",
  },
  dailyChallenge: {
    targetHours: 4,
    text: "Complete 4 hours today to keep your streak!",
  },
  weeklyStreak: [
    { day: "Mon", completed: true },
    { day: "Tue", completed: true },
    { day: "Wed", completed: true },
    { day: "Thu", current: true, completed: false },
    { day: "Fri", completed: false },
    { day: "Sat", completed: false },
    { day: "Sun", completed: false },
  ],
  studyHours: {
    currentHours: 2.58,
    goalHours: 4,
    formattedCurrent: "2h 35m",
    percentage: 63,
  },
  streak: {
    count: 6,
    label: "6 days",
    subtitle: "Keep going!",
  },
  currentSession: {
    title: "DSA - Trees",
    current: "1/6 hours",
    subject: "Data Structures",
    progress: 16,
  },
  todaysPlan: [
    {
      id: "1",
      time: "7:00 - 8:00",
      subject: "DSA - Trees",
      category: "Study",
      icon: "BookOpen",
      color: "#10b981",
      completed: true,
    },
    {
      id: "2",
      time: "8:00 - 8:20",
      subject: "Breakfast",
      category: "Break",
      icon: "Coffee",
      color: "#f59e0b",
      completed: false,
    },
    {
      id: "3",
      time: "10:00 - 12:00",
      subject: "Mathematics",
      category: "Integration",
      icon: "Calculator",
      color: "#6366f1",
      completed: false,
    },
    {
      id: "4",
      time: "5:00 - 6:30",
      subject: "Python - OOP",
      category: "Study",
      icon: "Code",
      color: "#3b82f6",
      completed: false,
    },
    {
      id: "5",
      time: "7:00 - 8:00",
      subject: "DBMS Revision",
      category: "Practice",
      icon: "Database",
      color: "#a855f7",
      completed: false,
    },
  ],
  learningOverview: {
    averageRate: 75,
    dateRange: "29 Sep - 5 Oct 2025",
    bars: [
      { day: "Mon", rate: 25 },
      { day: "Tue", rate: 50 },
      { day: "Wed", rate: 75 },
      { day: "Thu", rate: 50 },
      { day: "Fri", rate: 25 },
      { day: "Sat", rate: 60 },
      { day: "Sun", rate: 80 },
    ],
  },
  quickActions: [
    { id: "1", label: "Add Task", iconName: "PlusCircle", color: "#ff6b35", bg: "rgba(255, 107, 53, 0.15)" },
    { id: "2", label: "Add Subject", iconName: "BookOpen", color: "#a855f7", bg: "rgba(168, 85, 247, 0.15)" },
    { id: "3", label: "Add Exam", iconName: "Calendar", color: "#ec4899", bg: "rgba(236, 72, 153, 0.15)" },
    { id: "4", label: "AI Plan", iconName: "Sparkles", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.15)" },
    { id: "5", label: "Focus Mode", iconName: "Timer", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" },
    { id: "6", label: "New Note", iconName: "FileText", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
  ],
  subjectProgress: [
    { name: "Mathematics", percentage: 60, color: "#ec4899", iconName: "Sigma" },
    { name: "DSA", percentage: 80, color: "#10b981", iconName: "Monitor" },
    { name: "Python", percentage: 40, color: "#eab308", iconName: "Code2" },
    { name: "DBMS", percentage: 35, color: "#a855f7", iconName: "Database" },
    { name: "Operating Systems", percentage: 50, color: "#06b6d4", iconName: "Cpu" },
  ],
  tasks: [
    { id: "t1", title: "Read notes on Trees", subject: "DSA", duration: "15m", completed: true, category: "Today" },
    { id: "t2", title: "Solve 5 problems", subject: "DSA", duration: "30m", completed: true, category: "Today" },
    { id: "t3", title: "Revise Integration", subject: "Mathematics", duration: "30m", completed: false, category: "Today" },
    { id: "t4", title: "Practice harder problems", subject: "DSA", duration: "30m", completed: false, category: "Upcoming" },
    { id: "t5", title: "Make short notes", subject: "General", duration: "15m", completed: false, category: "Upcoming" },
  ],
  studyAnalytics: {
    totalTime: "18.5 hrs",
    tasksCompleted: "87%",
    avgFocus: "2.8 hrs",
    longestStreak: "6 days",
    weeklyTimeBars: [
      { day: "Mon", hours: 2.5 },
      { day: "Tue", hours: 4.0 },
      { day: "Wed", hours: 3.2 },
      { day: "Thu", hours: 4.8 },
      { day: "Fri", hours: 1.5 },
      { day: "Sat", hours: 5.2 },
      { day: "Sun", hours: 3.8 },
    ],
  },
};
