import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import SyllabusList from './SyllabusList';
import { Exam } from '../../types/exams';
import { computeExamDerived, formatExamDisplay } from '../../utils/examCalculations';
import { useExams } from '../../context/ExamsContext';

interface ExamCardProps {
  exam: Exam;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const { openEditModal, deleteExam } = useExams();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const derived = computeExamDerived(exam);
  const { dateFormatted, timeFormatted } = formatExamDisplay(exam.date, exam.startTime);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the exam "${exam.subjectName}"?`)) {
      setIsDeleting(true);
      deleteExam(exam.id);
    }
  };

  return (
    <Card
      className={`exam-card-item ${derived.isPast ? 'exam-card-past' : ''}`}
      style={{
        borderTopColor: exam.color || 'var(--accent-orange)',
        opacity: isDeleting ? 0.4 : undefined,
      }}
    >
      <div className="exam-card-top">
        <div className="exam-card-subject-block">
          <h3 className="exam-card-subject" style={{ color: exam.color || 'var(--text-primary)' }}>
            {exam.subjectName}
          </h3>

          <div className="exam-card-meta-list">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} color="var(--accent-orange)" />
              <span>{dateFormatted}</span>
            </div>

            {timeFormatted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} color="var(--accent-orange)" />
                <span>{timeFormatted}</span>
              </div>
            )}

            {exam.venue && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="var(--accent-orange)" />
                <span>{exam.venue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Big Days Left Badge on Right */}
        <div
          className="exam-card-days-badge"
          style={{
            borderColor: derived.isToday
              ? 'var(--accent-orange)'
              : derived.isPast
              ? 'rgba(255, 255, 255, 0.08)'
              : `${exam.color}40`,
          }}
        >
          {derived.isPast ? (
            <>
              <span className="days-badge-number" style={{ color: '#10b981' }}>
                <CheckCircle2 size={18} style={{ margin: '0 auto' }} />
              </span>
              <span className="days-badge-unit">Done</span>
            </>
          ) : derived.isToday ? (
            <>
              <span className="days-badge-number" style={{ color: 'var(--accent-orange)' }}>
                Today
              </span>
              <span className="days-badge-unit">Exam Day</span>
            </>
          ) : (
            <>
              <span className="days-badge-number">{derived.daysLeft}</span>
              <span className="days-badge-unit">{derived.daysLeft === 1 ? 'Day Left' : 'Days Left'}</span>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar & Text */}
      <div className="exam-card-progress">
        <div className="exam-card-progress-text">
          <span>Completed so far:</span>
          <span>
            {derived.completedTopics}/{derived.totalTopics} topics ·{' '}
            <strong style={{ color: exam.color }}>{derived.progressPercent}%</strong>
          </span>
        </div>
        <ProgressBar
          percentage={derived.progressPercent}
          color={exam.color || 'var(--accent-orange)'}
          height={6}
        />
      </div>

      {/* Expandable Syllabus with interactive checkboxes */}
      <SyllabusList examId={exam.id} units={exam.units} />

      {/* Card Footer: Edit and Delete Buttons */}
      <div className="exam-card-footer">
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {derived.isPast ? 'Past examination' : derived.daysLeftLabel}
        </span>

        <div className="exam-card-actions">
          <button
            type="button"
            className="card-action-icon-btn"
            title="Edit exam"
            onClick={() => openEditModal(exam)}
            aria-label={`Edit ${exam.subjectName}`}
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            className="card-action-icon-btn delete"
            title="Delete exam"
            onClick={handleDelete}
            aria-label={`Delete ${exam.subjectName}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ExamCard;
