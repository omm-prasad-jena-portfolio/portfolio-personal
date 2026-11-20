import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Plus } from 'lucide-react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { useExams } from '../../context/ExamsContext';
import { calculateCountdown, formatExamDisplay } from '../../utils/examCalculations';
import { CountdownTime } from '../../types/exams';

export const NextExamCard: React.FC = () => {
  const { stats, openAddModal } = useExams();
  const nextExam = stats.nextExam;

  const [countdown, setCountdown] = useState<CountdownTime>(() => {
    if (!nextExam) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, isToday: false, formatted: '' };
    }
    return calculateCountdown(nextExam.date, nextExam.startTime);
  });

  useEffect(() => {
    if (!nextExam) return;

    // Initial update
    setCountdown(calculateCountdown(nextExam.date, nextExam.startTime));

    // Update every second for live countdown
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(nextExam.date, nextExam.startTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [nextExam]);

  if (!nextExam) {
    return (
      <Card className="hero-exam-card">
        <div className="exams-empty-hero">
          <div className="exams-empty-icon">
            <Sparkles size={24} />
          </div>
          <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>No Upcoming Exams</h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '320px' }}>
            You have no exams scheduled ahead. Stay ahead of your schedule by adding your next test!
          </p>
          <button type="button" className="btn-add-exam" onClick={openAddModal} style={{ marginTop: '8px' }}>
            <Plus size={16} /> Add First Exam
          </button>
        </div>
      </Card>
    );
  }

  const { dateFormatted, timeFormatted } = formatExamDisplay(nextExam.date, nextExam.startTime);

  return (
    <Card className="hero-exam-card">
      <div className="hero-exam-badge">
        <Sparkles size={12} /> Next Exam Target
      </div>

      <h2 className="hero-exam-subject" style={{ color: nextExam.color || 'var(--text-primary)' }}>
        {nextExam.subjectName}
      </h2>

      <div className="hero-exam-meta">
        <div className="hero-meta-item">
          <Calendar size={14} color="var(--accent-orange)" />
          <span>{dateFormatted}</span>
        </div>
        {timeFormatted && (
          <div className="hero-meta-item">
            <Clock size={14} color="var(--accent-orange)" />
            <span>{timeFormatted}</span>
          </div>
        )}
        {nextExam.venue && (
          <div className="hero-meta-item">
            <MapPin size={14} color="var(--accent-orange)" />
            <span>{nextExam.venue}</span>
          </div>
        )}
      </div>

      {/* Live Countdown Grid */}
      <div className="hero-countdown-box">
        <div className="hero-countdown-label">Time Remaining</div>
        <div className="hero-countdown-digits">
          <div className="countdown-unit">
            <span className="countdown-value">{countdown.days}</span>
            <span className="countdown-sub">Days</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-unit">
            <span className="countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
            <span className="countdown-sub">Hours</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-unit">
            <span className="countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
            <span className="countdown-sub">Mins</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-unit">
            <span className="countdown-value" style={{ color: 'var(--accent-orange)' }}>
              {String(countdown.seconds).padStart(2, '0')}
            </span>
            <span className="countdown-sub">Secs</span>
          </div>
        </div>
      </div>

      {/* Syllabus Progress */}
      <div className="hero-progress-section">
        <div className="hero-progress-labels">
          <span>Syllabus Prepared</span>
          <span>
            {nextExam.derived.completedTopics} of {nextExam.derived.totalTopics} topics ·{' '}
            <strong style={{ color: nextExam.color }}>{nextExam.derived.progressPercent}%</strong>
          </span>
        </div>
        <ProgressBar
          percentage={nextExam.derived.progressPercent}
          color={nextExam.color || 'var(--accent-orange)'}
          height={8}
        />
      </div>
    </Card>
  );
};

export default NextExamCard;
