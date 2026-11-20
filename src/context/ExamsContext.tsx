import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Exam, ExamUnit, ExamTopic, ExamStatsData } from '../types/exams';
import { calculateExamStats } from '../utils/examCalculations';
import { fetchExams, createExam } from '../services/examsApi';

const STORAGE_KEY = 'study_exams_data';

function getRelativeDateStr(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const SEED_EXAMS: Exam[] = [
  {
    id: 'exam-seed-1',
    subjectName: 'Data Structures & Algorithms',
    date: getRelativeDateStr(5),
    startTime: '10:00',
    venue: 'Hall A - Block 3',
    color: '#10b981',
    units: [
      {
        id: 'u1',
        name: 'Unit 1: Arrays & Two Pointers',
        topics: [
          { id: 't1', title: 'Array memory layout & complexity analysis', done: true },
          { id: 't2', title: 'Two-pointer technique & sliding window', done: true },
          { id: 't3', title: 'Prefix sums and Kadane algorithm', done: false },
        ],
      },
      {
        id: 'u2',
        name: 'Unit 2: Trees & Binary Search',
        topics: [
          { id: 't4', title: 'Binary Search Trees & traversals', done: true },
          { id: 't5', title: 'AVL & Red-Black self-balancing trees', done: false },
          { id: 't6', title: 'Trie structures & autocomplete logic', done: false },
        ],
      },
      {
        id: 'u3',
        name: 'Unit 3: Graph Algorithms',
        topics: [
          { id: 't7', title: 'BFS & DFS graph traversals', done: false },
          { id: 't8', title: 'Dijkstra shortest path algorithm', done: false },
          { id: 't9', title: 'Topological sort & Kahn algorithm', done: false },
        ],
      },
    ],
  },
  {
    id: 'exam-seed-2',
    subjectName: 'Mathematics',
    date: getRelativeDateStr(12),
    startTime: '14:00',
    venue: 'Science Auditorium 2',
    color: '#ec4899',
    units: [
      {
        id: 'u4',
        name: 'Unit 1: Differential Equations & Calculus',
        topics: [
          { id: 't10', title: 'First-order separable differential equations', done: true },
          { id: 't11', title: 'Second-order linear equations with constant coefficients', done: false },
          { id: 't12', title: 'Laplace transforms & inverse applications', done: false },
        ],
      },
      {
        id: 'u5',
        name: 'Unit 2: Linear Algebra & Matrix Theory',
        topics: [
          { id: 't13', title: 'Vector spaces, subspaces & span', done: false },
          { id: 't14', title: 'Eigenvalues, eigenvectors & diagonalization', done: false },
        ],
      },
    ],
  },
  {
    id: 'exam-seed-3',
    subjectName: 'Database Management Systems',
    date: getRelativeDateStr(20),
    startTime: '09:30',
    venue: 'CS Lab 102',
    color: '#a855f7',
    units: [
      {
        id: 'u6',
        name: 'Unit 1: Relational Model & Normalization',
        topics: [
          { id: 't15', title: 'ER Diagrams and schema mapping', done: true },
          { id: 't16', title: 'Functional dependencies, 1NF to BCNF', done: true },
        ],
      },
      {
        id: 'u7',
        name: 'Unit 2: Transactions & Concurrency Control',
        topics: [
          { id: 't17', title: 'ACID properties and schedule serializability', done: false },
          { id: 't18', title: 'Two-phase locking (2PL) and timestamp ordering', done: false },
          { id: 't19', title: 'Deadlock detection & prevention algorithms', done: false },
        ],
      },
      {
        id: 'u8',
        name: 'Unit 3: Indexing & Storage Engines',
        topics: [
          { id: 't20', title: 'B+ Tree indexing structures', done: false },
          { id: 't21', title: 'Query evaluation cost analysis', done: false },
        ],
      },
    ],
  },
  {
    id: 'exam-seed-4',
    subjectName: 'Computer Networks',
    date: getRelativeDateStr(-2),
    startTime: '11:00',
    venue: 'Room 405',
    color: '#3b82f6',
    units: [
      {
        id: 'u9',
        name: 'Unit 1: Network Architectures & Protocols',
        topics: [
          { id: 't22', title: 'OSI 7-layer vs TCP/IP model', done: true },
          { id: 't23', title: 'HTTP/2, HTTP/3, and TLS handshake', done: true },
        ],
      },
      {
        id: 'u10',
        name: 'Unit 2: Routing & Transport Protocols',
        topics: [
          { id: 't24', title: 'TCP flow control, windowing & AIMD', done: true },
          { id: 't25', title: 'OSPF and BGP routing mechanics', done: true },
        ],
      },
    ],
  },
];

export interface SyllabusOpResult {
  success: boolean;
  error?: string;
}

function ensureExamIds(examList: Exam[]): Exam[] {
  return examList.map((exam) => ({
    ...exam,
    units: (exam.units || []).map((unit, uIdx) => ({
      ...unit,
      id: unit.id || `unit-${exam.id}-${uIdx}-${Math.random().toString(36).substring(2, 6)}`,
      topics: (unit.topics || []).map((topic, tIdx) => ({
        ...topic,
        id: topic.id || `topic-${exam.id}-${uIdx}-${tIdx}-${Math.random().toString(36).substring(2, 6)}`,
      })),
    })),
  }));
}

interface ExamsContextType {
  exams: Exam[];
  stats: ExamStatsData;
  isLoading: boolean;
  isAddModalOpen: boolean;
  editingExam: Exam | null;
  openAddModal: () => void;
  openEditModal: (exam: Exam) => void;
  closeModal: () => void;
  addExam: (examData: Omit<Exam, 'id'>) => Promise<void>;
  updateExam: (id: string, updates: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  toggleTopic: (examId: string, unitIndex: number, topicIndex: number) => Promise<void>;
  refreshExams: () => Promise<void>;
  // Syllabus granular editor methods
  addUnit: (examId: string, unitName: string) => SyllabusOpResult;
  renameUnit: (examId: string, unitId: string, newName: string) => SyllabusOpResult;
  deleteUnit: (examId: string, unitId: string) => void;
  addTopic: (examId: string, unitId: string, topicTitle: string) => SyllabusOpResult;
  renameTopic: (examId: string, unitId: string, topicId: string, newTitle: string) => SyllabusOpResult;
  deleteTopic: (examId: string, unitId: string, topicId: string) => void;
  toggleTopicById: (examId: string, unitId: string, topicId: string) => void;
}

const ExamsContext = createContext<ExamsContextType | undefined>(undefined);

export const ExamsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return ensureExamIds(parsed);
        }
      }
    } catch (e) {
      console.warn('Error reading exams from localStorage:', e);
    }
    // Seed 4 sample exams if empty
    return ensureExamIds(SEED_EXAMS);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Keep localStorage synced whenever exams state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
    } catch (e) {
      console.warn('Error saving exams to localStorage:', e);
    }
  }, [exams]);

  // Background sync with backend if available
  const refreshExams = useCallback(async () => {
    try {
      setIsLoading(true);
      const backendExams = await fetchExams();
      if (Array.isArray(backendExams) && backendExams.length > 0) {
        // Merge or sync backend exams with local storage data if needed
      }
    } catch (err) {
      // Backend unavailable; localStorage remains source of truth
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshExams();
  }, [refreshExams]);

  const openAddModal = () => {
    setEditingExam(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (exam: Exam) => {
    setEditingExam(exam);
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingExam(null);
  };

  const addExam = async (examData: Omit<Exam, 'id'>) => {
    const newId = `exam-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newExam: Exam = {
      ...examData,
      id: newId,
      units: (examData.units || []).map((unit, uIdx) => ({
        ...unit,
        id: unit.id || `unit-${newId}-${uIdx}-${Math.random().toString(36).substring(2, 6)}`,
        topics: (unit.topics || []).map((topic, tIdx) => ({
          ...topic,
          id: topic.id || `topic-${newId}-${uIdx}-${tIdx}-${Math.random().toString(36).substring(2, 6)}`,
        })),
      })),
    };

    setExams((prev) => [newExam, ...prev]);

    // Background sync to backend
    try {
      createExam({
        title: examData.subjectName,
        exam_date: examData.date,
        exam_time: examData.startTime || '09:00',
        description: JSON.stringify({
          venue: examData.venue,
          color: examData.color,
          units: newExam.units,
        }),
      }).catch(() => {});
    } catch {}

    closeModal();
  };

  const updateExam = async (id: string, updates: Partial<Exam>) => {
    setExams((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    closeModal();
  };

  const deleteExam = async (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  const addUnit = (examId: string, unitName: string): SyllabusOpResult => {
    const cleanName = unitName.trim();
    if (!cleanName) {
      return { success: false, error: 'Unit name cannot be empty.' };
    }

    const targetExam = exams.find((e) => e.id === examId);
    if (!targetExam) {
      return { success: false, error: 'Exam not found.' };
    }

    const isDuplicate = (targetExam.units || []).some(
      (u) => u.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (isDuplicate) {
      return { success: false, error: 'That unit already exists.' };
    }

    const newUnit: ExamUnit = {
      id: `unit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      topics: [],
    };

    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam;
        return {
          ...exam,
          units: [...(exam.units || []), newUnit],
        };
      })
    );

    return { success: true };
  };

  const renameUnit = (examId: string, unitId: string, newName: string): SyllabusOpResult => {
    const cleanName = newName.trim();
    if (!cleanName) {
      return { success: false, error: 'Unit name cannot be empty.' };
    }

    const targetExam = exams.find((e) => e.id === examId);
    if (!targetExam) {
      return { success: false, error: 'Exam not found.' };
    }

    const isDuplicate = (targetExam.units || []).some(
      (u) => u.id !== unitId && u.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (isDuplicate) {
      return { success: false, error: 'That unit already exists.' };
    }

    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam;
        return {
          ...exam,
          units: (exam.units || []).map((u) =>
            u.id === unitId ? { ...u, name: cleanName } : u
          ),
        };
      })
    );

    return { success: true };
  };

  const deleteUnit = (examId: string, unitId: string) => {
    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam;
        return {
          ...exam,
          units: (exam.units || []).filter((u) => u.id !== unitId),
        };
      })
    );
  };

  const addTopic = (examId: string, unitId: string, topicTitle: string): SyllabusOpResult => {
    const cleanTitle = topicTitle.trim();
    if (!cleanTitle) {
      return { success: false, error: 'Topic title cannot be empty.' };
    }

    const targetExam = exams.find((e) => e.id === examId);
    if (!targetExam) {
      return { success: false, error: 'Exam not found.' };
    }

    const targetUnit = (targetExam.units || []).find((u) => u.id === unitId);
    if (!targetUnit) {
      return { success: false, error: 'Unit not found.' };
    }

    const isDuplicate = (targetUnit.topics || []).some(
      (t) => t.title.trim().toLowerCase() === cleanTitle.toLowerCase()
    );
    if (isDuplicate) {
      return { success: false, error: 'That topic is already in this unit.' };
    }

    const newTopic: ExamTopic = {
      id: `topic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: cleanTitle,
      done: false,
    };

    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam;
        return {
          ...exam,
          units: (exam.units || []).map((u) => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: [...(u.topics || []), newTopic],
            };
          }),
        };
      })
    );

    return { success: true };
  };

  const renameTopic = (
    examId: string,
    unitId: string,
    topicId: string,
    newTitle: string
  ): SyllabusOpResult => {
    const cleanTitle = newTitle.trim();
    if (!cleanTitle) {
      return { success: false, error: 'Topic title cannot be empty.' };
    }

    const targetExam = exams.find((e) => e.id === examId);
    if (!targetExam) {
      return { success: false, error: 'Exam not found.' };
    }

    const targetUnit = (targetExam.units || []).find((u) => u.id === unitId);
    if (!targetUnit) {
      return { success: false, error: 'Unit not found.' };
    }

    const isDuplicate = (targetUnit.topics || []).some(
      (t) => t.id !== topicId && t.title.trim().toLowerCase() === cleanTitle.toLowerCase()
    );
    if (isDuplicate) {
      return { success: false, error: 'That topic is already in this unit.' };
    }

    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam;
        return {
          ...exam,
          units: (exam.units || []).map((u) => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: (u.topics || []).map((t) =>
                t.id === topicId ? { ...t, title: cleanTitle } : t
              ),
            };
          }),
        };
      })
    );

    return { success: true };
  };

  const deleteTopic = (examId: string, unitId: string, topicId: string) => {
    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam;
        return {
          ...exam,
          units: (exam.units || []).map((u) => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: (u.topics || []).filter((t) => t.id !== topicId),
            };
          }),
        };
      })
    );
  };

  const toggleTopicById = (examId: string, unitId: string, topicId: string) => {
    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam;
        return {
          ...exam,
          units: (exam.units || []).map((u) => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: (u.topics || []).map((t) => {
                if (t.id !== topicId) return t;
                return { ...t, done: !t.done };
              }),
            };
          }),
        };
      })
    );
  };

  const toggleTopic = async (examId: string, unitIndex: number, topicIndex: number) => {
    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam;

        const newUnits = exam.units.map((unit, uIdx) => {
          if (uIdx !== unitIndex) return unit;

          const newTopics = unit.topics.map((topic, tIdx) => {
            if (tIdx !== topicIndex) return topic;
            return {
              ...topic,
              done: !topic.done,
            };
          });

          return {
            ...unit,
            topics: newTopics,
          };
        });

        return {
          ...exam,
          units: newUnits,
        };
      })
    );
  };

  const stats = calculateExamStats(exams);

  return (
    <ExamsContext.Provider
      value={{
        exams,
        stats,
        isLoading,
        isAddModalOpen,
        editingExam,
        openAddModal,
        openEditModal,
        closeModal,
        addExam,
        updateExam,
        deleteExam,
        toggleTopic,
        refreshExams,
        addUnit,
        renameUnit,
        deleteUnit,
        addTopic,
        renameTopic,
        deleteTopic,
        toggleTopicById,
      }}
    >
      {children}
    </ExamsContext.Provider>
  );
};

export const useExams = () => {
  const context = useContext(ExamsContext);
  if (!context) {
    throw new Error('useExams must be used within an ExamsProvider');
  }
  return context;
};
