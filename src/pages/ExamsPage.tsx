import React from 'react';
import { Plus, FileSpreadsheet } from 'lucide-react';
import NextExamCard from '../components/exams/NextExamCard';
import ExamStats from '../components/exams/ExamStats';
import ExamCard from '../components/exams/ExamCard';
import ExamFormDialog from '../components/exams/ExamFormDialog';
import { useExams } from '../context/ExamsContext';
import { parseExamDateTime } from '../utils/examCalculations';
import '../styles/exams.css';

export const ExamsPage: React.FC = () => {
  const { exams, openAddModal } = useExams();

  // Sort exams: upcoming soonest first, followed by past exams
  const sortedExams = [...exams].sort((a, b) => {
    const timeA = parseExamDateTime(a.date, a.startTime).getTime();
    const timeB = parseExamDateTime(b.date, b.startTime).getTime();
    return timeA - timeB;
  });

  return (
    <div className="exams-container">
      {/* 1. Header */}
      <div className="exams-header">
        <div className="exams-header-title">
          <h1>Exams</h1>
          <p>Track preparation, syllabi, and countdowns for upcoming tests</p>
        </div>
        <button
          type="button"
          className="btn-add-exam"
          onClick={openAddModal}
          aria-label="Add new exam"
        >
          <Plus size={16} />
          <span>Add Exam</span>
        </button>
      </div>

      {/* 2 & 3. Top Section: Next Exam Hero & 2x2 Stats */}
      <div className="exams-top-grid">
        <NextExamCard />
        <ExamStats />
      </div>

      {/* 4. Exam Cards Grid Section */}
      <div className="exams-list-header">
        <h2>All Examinations</h2>
        <span className="exams-count-tag">
          {exams.length} {exams.length === 1 ? 'Exam' : 'Exams'} Total
        </span>
      </div>

      {sortedExams.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <FileSpreadsheet size={36} color="var(--accent-orange)" />
          <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>
            No exams in your schedule
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            Add an exam to generate countdowns and track your topic preparation progress.
          </p>
          <button
            type="button"
            className="btn-add-exam"
            onClick={openAddModal}
            style={{ marginTop: '8px' }}
          >
            <Plus size={16} /> Add Exam
          </button>
        </div>
      ) : (
        <div className="exams-cards-grid">
          {sortedExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}

      {/* 5 & 6. Add & Edit Exam Dialog */}
      <ExamFormDialog />
    </div>
  );
};

export default ExamsPage;
