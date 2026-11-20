import { Exam, ExamDerived, ExamWithDerived, ExamUnit, CountdownTime, ExamStatsData } from '../types/exams';

/**
 * Computes derived values for a single exam without mutating stored data.
 */
export function computeExamDerived(exam: Exam): ExamDerived {
  let totalTopics = 0;
  let completedTopics = 0;

  if (Array.isArray(exam.units)) {
    exam.units.forEach((unit) => {
      if (Array.isArray(unit.topics)) {
        unit.topics.forEach((topic) => {
          totalTopics += 1;
          if (topic.done) {
            completedTopics += 1;
          }
        });
      }
    });
  }

  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Calculate days left
  const now = new Date();
  const examDate = parseExamDateTime(exam.date, exam.startTime);
  
  // Set both dates to start of day for integer day difference comparison
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const examDayStart = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate());
  
  const msDiff = examDayStart.getTime() - todayStart.getTime();
  const daysDiff = Math.round(msDiff / (1000 * 60 * 60 * 24));

  const isPast = examDate.getTime() < now.getTime() && daysDiff < 0;
  const isToday = daysDiff === 0;

  let daysLeftLabel = '';
  if (isPast) {
    daysLeftLabel = 'Done';
  } else if (isToday) {
    daysLeftLabel = 'Today';
  } else if (daysDiff === 1) {
    daysLeftLabel = 'Tomorrow';
  } else {
    daysLeftLabel = `${daysDiff} days left`;
  }

  return {
    totalTopics,
    completedTopics,
    progressPercent,
    daysLeft: Math.max(0, daysDiff),
    isPast,
    isToday,
    daysLeftLabel,
  };
}

/**
 * Attach derived values to an exam.
 */
export function enrichExamWithDerived(exam: Exam): ExamWithDerived {
  return {
    ...exam,
    derived: computeExamDerived(exam),
  };
}

/**
 * Parse date and optional time string safely into a Date object.
 */
export function parseExamDateTime(dateStr: string, timeStr?: string): Date {
  try {
    if (!dateStr) return new Date();
    
    // dateStr format: YYYY-MM-DD
    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const day = parseInt(dayStr, 10);

    let hours = 9;
    let minutes = 0;

    if (timeStr) {
      // timeStr can be HH:MM or HH:MM:SS or HH:MM AM/PM
      const isPM = /pm/i.test(timeStr);
      const isAM = /am/i.test(timeStr);
      const cleanTime = timeStr.replace(/(am|pm)/i, '').trim();
      const parts = cleanTime.split(':');
      
      let parsedHours = parseInt(parts[0], 10) || 0;
      minutes = parseInt(parts[1], 10) || 0;

      if (isPM && parsedHours < 12) parsedHours += 12;
      if (isAM && parsedHours === 12) parsedHours = 0;
      hours = parsedHours;
    }

    return new Date(year, month, day, hours, minutes, 0, 0);
  } catch {
    return new Date();
  }
}

/**
 * Live countdown calculation for countdown timers.
 */
export function calculateCountdown(dateStr: string, timeStr?: string): CountdownTime {
  const targetDate = parseExamDateTime(dateStr, timeStr);
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      isToday: false,
      formatted: 'Exam ended / completed',
    };
  }

  const seconds = Math.floor((diffMs / 1000) % 60);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
    isToday: days === 0,
    formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
  };
}

/**
 * Calculates aggregate stats for all exams.
 */
export function calculateExamStats(exams: Exam[]): ExamStatsData {
  const enriched = exams.map(enrichExamWithDerived);
  
  // Filter upcoming (not past)
  const upcoming = enriched
    .filter((e) => !e.derived.isPast)
    .sort((a, b) => {
      const dateA = parseExamDateTime(a.date, a.startTime).getTime();
      const dateB = parseExamDateTime(b.date, b.startTime).getTime();
      return dateA - dateB;
    });

  let totalTopics = 0;
  let completedTopics = 0;

  enriched.forEach((e) => {
    totalTopics += e.derived.totalTopics;
    completedTopics += e.derived.completedTopics;
  });

  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const nextExam = upcoming.length > 0 ? upcoming[0] : null;
  const daysToNext = nextExam ? nextExam.derived.daysLeft : null;

  return {
    upcomingCount: upcoming.length,
    overallProgress,
    completedTopics,
    totalTopics,
    daysToNext,
    nextExam,
  };
}

export function generateUniqueId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Parses syllabus text into units & topics.
 * Each line starting with '#' is a unit header.
 * Other lines are topics.
 */
export function parseSyllabusText(text: string, existingUnits: ExamUnit[] = []): ExamUnit[] {
  if (!text || !text.trim()) return [];

  // Build a map of existing topic completion states and ids to preserve them during edits
  const existingTopicMap = new Map<string, { id?: string; done: boolean }>();
  existingUnits.forEach((unit) => {
    unit.topics.forEach((topic) => {
      existingTopicMap.set(topic.title.trim().toLowerCase(), {
        id: topic.id,
        done: topic.done,
      });
    });
  });

  const existingUnitMap = new Map<string, string>();
  existingUnits.forEach((unit) => {
    if (unit.id) {
      existingUnitMap.set(unit.name.trim().toLowerCase(), unit.id);
    }
  });

  const lines = text.split('\n');
  const units: ExamUnit[] = [];
  let currentUnit: ExamUnit | null = null;

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;

    if (line.startsWith('#')) {
      const unitName = line.replace(/^#+\s*/, '').trim() || 'Unit';
      const unitKey = unitName.toLowerCase();
      currentUnit = {
        id: existingUnitMap.get(unitKey) || generateUniqueId('unit'),
        name: unitName,
        topics: [],
      };
      units.push(currentUnit);
    } else {
      if (!currentUnit) {
        currentUnit = {
          id: existingUnitMap.get('general syllabus') || generateUniqueId('unit'),
          name: 'General Syllabus',
          topics: [],
        };
        units.push(currentUnit);
      }

      const existingTopic = existingTopicMap.get(line.toLowerCase());
      currentUnit.topics.push({
        id: existingTopic?.id || generateUniqueId('topic'),
        title: line,
        done: existingTopic ? existingTopic.done : false,
      });
    }
  });

  return units;
}

/**
 * Formats units back into editable syllabus textarea format.
 */
export function formatSyllabusText(units: ExamUnit[]): string {
  if (!units || units.length === 0) return '';

  return units
    .map((unit) => {
      const header = `# ${unit.name}`;
      const topicLines = unit.topics.map((t) => t.title).join('\n');
      return topicLines ? `${header}\n${topicLines}` : header;
    })
    .join('\n\n');
}

/**
 * Formats date and time into friendly display strings.
 */
export function formatExamDisplay(dateStr: string, timeStr?: string) {
  try {
    const dt = parseExamDateTime(dateStr, timeStr);
    const dateFormatted = dt.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    let timeFormatted = '';
    if (timeStr) {
      timeFormatted = dt.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }

    return {
      dateFormatted,
      timeFormatted,
    };
  } catch {
    return {
      dateFormatted: dateStr,
      timeFormatted: timeStr || '',
    };
  }
}
