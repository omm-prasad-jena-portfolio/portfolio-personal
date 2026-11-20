import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ExamUnit } from '../../types/exams';
import SyllabusEditor from './SyllabusEditor';

interface SyllabusListProps {
  examId: string;
  units: ExamUnit[];
  initiallyExpanded?: boolean;
}

export const SyllabusList: React.FC<SyllabusListProps> = ({
  examId,
  units = [],
  initiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initiallyExpanded);

  const totalTopics = (units || []).reduce((acc, u) => acc + (u.topics?.length || 0), 0);
  const completedTopics = (units || []).reduce(
    (acc, u) => acc + (u.topics?.filter((t) => t.done).length || 0),
    0
  );

  return (
    <div style={{ width: '100%' }}>
      <button
        type="button"
        className="syllabus-toggle-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span>
          {isExpanded
            ? 'Hide Syllabus'
            : totalTopics > 0
            ? `View Syllabus (${completedTopics}/${totalTopics} done)`
            : `View Syllabus (${(units || []).length} ${(units || []).length === 1 ? 'unit' : 'units'})`}
        </span>
      </button>

      {isExpanded && (
        <div className="syllabus-container">
          <SyllabusEditor examId={examId} units={units || []} />
        </div>
      )}
    </div>
  );
};

export default SyllabusList;
