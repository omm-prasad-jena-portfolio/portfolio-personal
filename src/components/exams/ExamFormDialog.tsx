import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useExams } from '../../context/ExamsContext';
import { parseSyllabusText, formatSyllabusText } from '../../utils/examCalculations';

const COLOR_OPTIONS = [
  { label: 'Green', value: '#10b981' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Orange', value: '#ff6b35' },
  { label: 'Yellow', value: '#f59e0b' },
];

const PRESET_SUBJECTS = [
  'Mathematics',
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Operating Systems',
  'Computer Networks',
  'Python Programming',
  'Software Engineering',
];

export const ExamFormDialog: React.FC = () => {
  const { isAddModalOpen, editingExam, closeModal, addExam, updateExam } = useExams();

  const [subjectName, setSubjectName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('10:00');
  const [venue, setVenue] = useState<string>('');
  const [color, setColor] = useState<string>('#ff6b35');
  const [syllabusText, setSyllabusText] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingExam) {
      setSubjectName(editingExam.subjectName || '');
      setDate(editingExam.date || '');
      setStartTime(editingExam.startTime || '10:00');
      setVenue(editingExam.venue || '');
      setColor(editingExam.color || '#ff6b35');
      setSyllabusText(formatSyllabusText(editingExam.units || []));
      setError('');
    } else {
      setSubjectName('');
      setDate('');
      setStartTime('10:00');
      setVenue('');
      setColor('#ff6b35');
      setSyllabusText('');
      setError('');
    }
  }, [editingExam, isAddModalOpen]);

  if (!isAddModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      setError('Please provide a subject name.');
      return;
    }

    if (!date) {
      setError('Please choose an exam date.');
      return;
    }

    const existingUnits = editingExam?.units || [];
    const units = syllabusText.trim() ? parseSyllabusText(syllabusText, existingUnits) : [];

    if (editingExam) {
      await updateExam(editingExam.id, {
        subjectName: subjectName.trim(),
        date,
        startTime: startTime || undefined,
        venue: venue.trim() || undefined,
        color,
        units,
      });
    } else {
      await addExam({
        subjectName: subjectName.trim(),
        date,
        startTime: startTime || undefined,
        venue: venue.trim() || undefined,
        color,
        units,
      });
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exam-modal-title"
    >
      <div
        className="exam-modal-card"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') closeModal();
        }}
      >
        <div className="exam-modal-header">
          <h3 id="exam-modal-title">
            {editingExam ? 'Edit Exam Details' : 'Add New Exam'}
          </h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeModal}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="exam-modal-body">
            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  color: '#f87171',
                  fontSize: '13px',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="exam-subject">
                Subject Name <span style={{ color: 'var(--accent-orange)' }}>*</span>
              </label>
              <input
                id="exam-subject"
                type="text"
                list="preset-subjects"
                value={subjectName}
                onChange={(e) => {
                  setSubjectName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Data Structures & Algorithms"
                required
                autoFocus
              />
              <datalist id="preset-subjects">
                {PRESET_SUBJECTS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="exam-date">
                  Exam Date <span style={{ color: 'var(--accent-orange)' }}>*</span>
                </label>
                <input
                  id="exam-date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="exam-time">Start Time</label>
                <input
                  id="exam-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="exam-venue">Venue / Location (Optional)</label>
              <input
                id="exam-venue"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Hall A - Block 3, Online, or Room 204"
              />
            </div>

            <div className="form-group">
              <label>Subject Theme Color</label>
              <div className="color-picker-row">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={`color-swatch-btn ${color === c.value ? 'selected' : ''}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setColor(c.value)}
                    title={c.label}
                    aria-label={`Select ${c.label} color`}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label htmlFor="exam-syllabus">Syllabus Breakdown (Optional)</label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Use <code># Unit Name</code> for headers
                </span>
              </div>
              <textarea
                id="exam-syllabus"
                rows={6}
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                placeholder={"Optional: leave empty to build unit-by-unit inside the exam card, or type:\n# Unit 1: Foundations\nTopic 1\nTopic 2"}
              />
            </div>
          </div>

          <div className="exam-modal-footer">
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingExam ? 'Save Changes' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamFormDialog;
