export interface ExamTopic {
  id?: string;
  title: string;
  done: boolean;
}

export interface ExamUnit {
  id?: string;
  name: string;
  topics: ExamTopic[];
}

export interface Exam {
  id: string;
  subjectName: string;
  date: string; // YYYY-MM-DD format
  startTime?: string; // HH:MM (24h or 12h)
  venue?: string;
  color: string;
  units: ExamUnit[];
  subjectId?: number;
  backendId?: number;
}

export interface ExamDerived {
  totalTopics: number;
  completedTopics: number;
  progressPercent: number;
  daysLeft: number;
  isPast: boolean;
  isToday: boolean;
  daysLeftLabel: string;
}

export interface ExamWithDerived extends Exam {
  derived: ExamDerived;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isToday: boolean;
  formatted: string;
}

export interface ExamStatsData {
  upcomingCount: number;
  overallProgress: number;
  completedTopics: number;
  totalTopics: number;
  daysToNext: number | null;
  nextExam: ExamWithDerived | null;
}
