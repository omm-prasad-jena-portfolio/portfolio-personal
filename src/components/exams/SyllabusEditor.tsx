import React, { useState, useRef } from 'react';
import { Plus, Check, Pencil, Trash2 } from 'lucide-react';
import { ExamUnit, ExamTopic } from '../../types/exams';
import { useExams } from '../../context/ExamsContext';
import '../../styles/syllabusEditor.css';

interface SyllabusEditorProps {
  examId: string;
  units: ExamUnit[];
}

export const SyllabusEditor: React.FC<SyllabusEditorProps> = ({ examId, units }) => {
  const {
    addUnit,
    renameUnit,
    deleteUnit,
    addTopic,
    renameTopic,
    deleteTopic,
    toggleTopicById,
  } = useExams();

  // Unit creation state
  const [isAddingUnit, setIsAddingUnit] = useState<boolean>(false);
  const [newUnitName, setNewUnitName] = useState<string>('');
  const [unitAddError, setUnitAddError] = useState<string>('');
  const newUnitInputRef = useRef<HTMLInputElement>(null);

  // Unit renaming state
  const [renamingUnitId, setRenamingUnitId] = useState<string | null>(null);
  const [renameUnitValue, setRenameUnitValue] = useState<string>('');
  const [unitRenameError, setUnitRenameError] = useState<string>('');

  // Unit delete confirmation state
  const [deletingUnitId, setDeletingUnitId] = useState<string | null>(null);

  // Topic creation state per unit
  const [topicInputs, setTopicInputs] = useState<Record<string, string>>({});
  const [topicAddErrors, setTopicAddErrors] = useState<Record<string, string>>({});

  // Topic renaming state
  const [renamingTopicId, setRenamingTopicId] = useState<string | null>(null);
  const [renameTopicValue, setRenameTopicValue] = useState<string>('');
  const [topicRenameError, setTopicRenameError] = useState<string>('');

  // Topic delete confirmation state
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);

  // 1. Handlers for adding a unit
  const handleStartAddUnit = () => {
    setIsAddingUnit(true);
    setNewUnitName('');
    setUnitAddError('');
    setTimeout(() => {
      newUnitInputRef.current?.focus();
    }, 50);
  };

  const handleCancelAddUnit = () => {
    setIsAddingUnit(false);
    setNewUnitName('');
    setUnitAddError('');
  };

  const handleConfirmAddUnit = () => {
    const trimmed = newUnitName.trim();
    if (!trimmed) {
      handleCancelAddUnit();
      return;
    }

    const res = addUnit(examId, trimmed);
    if (!res.success) {
      setUnitAddError(res.error || 'That unit already exists.');
      return;
    }

    setIsAddingUnit(false);
    setNewUnitName('');
    setUnitAddError('');
  };

  // 2. Handlers for renaming a unit
  const handleStartRenameUnit = (unit: ExamUnit) => {
    setRenamingUnitId(unit.id || '');
    setRenameUnitValue(unit.name);
    setUnitRenameError('');
    setDeletingUnitId(null);
  };

  const handleCancelRenameUnit = () => {
    setRenamingUnitId(null);
    setRenameUnitValue('');
    setUnitRenameError('');
  };

  const handleConfirmRenameUnit = (unitId: string) => {
    const trimmed = renameUnitValue.trim();
    if (!trimmed) {
      handleCancelRenameUnit();
      return;
    }

    const res = renameUnit(examId, unitId, trimmed);
    if (!res.success) {
      setUnitRenameError(res.error || 'That unit already exists.');
      return;
    }

    setRenamingUnitId(null);
    setRenameUnitValue('');
    setUnitRenameError('');
  };

  // 3. Handlers for adding a topic
  const handleTopicInputChange = (unitId: string, val: string) => {
    setTopicInputs((prev) => ({ ...prev, [unitId]: val }));
    if (topicAddErrors[unitId]) {
      setTopicAddErrors((prev) => ({ ...prev, [unitId]: '' }));
    }
  };

  const handleTopicKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    unitId: string
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentVal = (topicInputs[unitId] || '').trim();
      if (!currentVal) return;

      const res = addTopic(examId, unitId, currentVal);
      if (!res.success) {
        setTopicAddErrors((prev) => ({
          ...prev,
          [unitId]: res.error || 'That topic is already in this unit.',
        }));
        return;
      }

      // Clear input and error, retain focus
      setTopicInputs((prev) => ({ ...prev, [unitId]: '' }));
      setTopicAddErrors((prev) => ({ ...prev, [unitId]: '' }));
      e.currentTarget.focus();
    }
  };

  // 4. Handlers for renaming a topic
  const handleStartRenameTopic = (topic: ExamTopic) => {
    setRenamingTopicId(topic.id || '');
    setRenameTopicValue(topic.title);
    setTopicRenameError('');
    setDeletingTopicId(null);
  };

  const handleCancelRenameTopic = () => {
    setRenamingTopicId(null);
    setRenameTopicValue('');
    setTopicRenameError('');
  };

  const handleConfirmRenameTopic = (unitId: string, topicId: string) => {
    const trimmed = renameTopicValue.trim();
    if (!trimmed) {
      handleCancelRenameTopic();
      return;
    }

    const res = renameTopic(examId, unitId, topicId, trimmed);
    if (!res.success) {
      setTopicRenameError(res.error || 'That topic is already in this unit.');
      return;
    }

    setRenamingTopicId(null);
    setRenameTopicValue('');
    setTopicRenameError('');
  };

  // Empty state when no units exist
  if (!units || units.length === 0) {
    return (
      <div className="syllabus-editor-wrap">
        {!isAddingUnit ? (
          <div className="syllabus-empty-state">
            <p className="syllabus-empty-text">
              No syllabus yet. Add your first unit to start tracking topics.
            </p>
            <button
              type="button"
              className="btn-add-unit-empty"
              onClick={handleStartAddUnit}
              aria-label="Add first unit"
            >
              <Plus size={14} /> Add unit
            </button>
          </div>
        ) : (
          <div className="add-unit-inline-box">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                ref={newUnitInputRef}
                type="text"
                className="inline-edit-input"
                placeholder="Unit name (e.g. Unit 1: Foundations)"
                value={newUnitName}
                onChange={(e) => {
                  setNewUnitName(e.target.value);
                  setUnitAddError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleConfirmAddUnit();
                  } else if (e.key === 'Escape') {
                    handleCancelAddUnit();
                  }
                }}
                aria-label="Unit name"
              />
              <button
                type="button"
                className="btn-inline-save"
                onClick={handleConfirmAddUnit}
              >
                Add unit
              </button>
              <button
                type="button"
                className="btn-inline-cancel"
                onClick={handleCancelAddUnit}
              >
                Cancel
              </button>
            </div>
            {unitAddError && <div className="inline-error-msg">{unitAddError}</div>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="syllabus-editor-wrap">
      <div className="syllabus-units-list">
        {units.map((unit) => {
          const unitId = unit.id || '';
          const isRenamingUnit = renamingUnitId === unitId;
          const isDeletingUnit = deletingUnitId === unitId;
          const topicVal = topicInputs[unitId] || '';
          const topicErr = topicAddErrors[unitId] || '';

          return (
            <div key={unitId} className="syllabus-unit-block">
              {/* Unit Header */}
              <div className="syllabus-unit-header">
                {!isRenamingUnit ? (
                  <>
                    <h4 className="syllabus-unit-title-text">{unit.name}</h4>
                    <div className="syllabus-unit-actions">
                      {isDeletingUnit ? (
                        <div className="inline-confirm-box">
                          <span className="inline-confirm-text">Delete unit?</span>
                          <button
                            type="button"
                            className="btn-confirm-delete"
                            onClick={() => {
                              deleteUnit(examId, unitId);
                              setDeletingUnitId(null);
                            }}
                            aria-label={`Confirm delete unit ${unit.name}`}
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="btn-confirm-keep"
                            onClick={() => setDeletingUnitId(null)}
                            aria-label="Keep unit"
                          >
                            Keep
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="unit-action-btn"
                            onClick={() => handleStartRenameUnit(unit)}
                            title="Rename unit"
                            aria-label={`Rename unit ${unit.name}`}
                          >
                            <Pencil size={11} /> Rename
                          </button>
                          <button
                            type="button"
                            className="unit-action-btn delete"
                            onClick={() => setDeletingUnitId(unitId)}
                            title="Delete unit"
                            aria-label={`Delete unit ${unit.name}`}
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '4px' }}>
                    <div className="inline-edit-form">
                      <input
                        type="text"
                        className="inline-edit-input"
                        value={renameUnitValue}
                        onChange={(e) => {
                          setRenameUnitValue(e.target.value);
                          setUnitRenameError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleConfirmRenameUnit(unitId);
                          } else if (e.key === 'Escape') {
                            handleCancelRenameUnit();
                          }
                        }}
                        autoFocus
                        aria-label="Rename unit name"
                      />
                      <button
                        type="button"
                        className="btn-inline-save"
                        onClick={() => handleConfirmRenameUnit(unitId)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn-inline-cancel"
                        onClick={handleCancelRenameUnit}
                      >
                        Cancel
                      </button>
                    </div>
                    {unitRenameError && (
                      <div className="inline-error-msg">{unitRenameError}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Topics inside Unit */}
              <div className="syllabus-topics-group">
                {(unit.topics || []).map((topic) => {
                  const topicId = topic.id || '';
                  const isRenamingTopic = renamingTopicId === topicId;
                  const isDeletingTopic = deletingTopicId === topicId;
                  const isDone = Boolean(topic.done);

                  return (
                    <div key={topicId} className="syllabus-topic-row">
                      <div className="syllabus-topic-left">
                        <button
                          type="button"
                          className={`syllabus-checkbox-btn ${isDone ? 'checked' : ''}`}
                          onClick={() => toggleTopicById(examId, unitId, topicId)}
                          role="checkbox"
                          aria-checked={isDone}
                          aria-label={`Mark topic "${topic.title}" as ${isDone ? 'not done' : 'done'}`}
                        >
                          {isDone && <Check size={11} strokeWidth={3} />}
                        </button>

                        {!isRenamingTopic ? (
                          <span
                            className={`syllabus-topic-title-clickable ${isDone ? 'done' : ''}`}
                            onClick={() => handleStartRenameTopic(topic)}
                            title="Click to rename"
                          >
                            {topic.title}
                          </span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '2px' }}>
                            <div className="inline-edit-form">
                              <input
                                type="text"
                                className="inline-edit-input"
                                value={renameTopicValue}
                                onChange={(e) => {
                                  setRenameTopicValue(e.target.value);
                                  setTopicRenameError('');
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleConfirmRenameTopic(unitId, topicId);
                                  } else if (e.key === 'Escape') {
                                    handleCancelRenameTopic();
                                  }
                                }}
                                autoFocus
                                aria-label="Edit topic title"
                              />
                              <button
                                type="button"
                                className="btn-inline-save"
                                onClick={() => handleConfirmRenameTopic(unitId, topicId)}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="btn-inline-cancel"
                                onClick={handleCancelRenameTopic}
                              >
                                Cancel
                              </button>
                            </div>
                            {topicRenameError && (
                              <div className="inline-error-msg">{topicRenameError}</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Topic Actions */}
                      {!isRenamingTopic && (
                        <div className="syllabus-topic-actions">
                          {isDeletingTopic ? (
                            <div className="inline-confirm-box">
                              <span className="inline-confirm-text">Delete?</span>
                              <button
                                type="button"
                                className="btn-confirm-delete"
                                onClick={() => {
                                  deleteTopic(examId, unitId, topicId);
                                  setDeletingTopicId(null);
                                }}
                                aria-label="Confirm delete topic"
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                className="btn-confirm-keep"
                                onClick={() => setDeletingTopicId(null)}
                                aria-label="Keep topic"
                              >
                                Keep
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="topic-action-btn"
                                onClick={() => handleStartRenameTopic(topic)}
                                title="Rename topic"
                                aria-label="Rename topic"
                              >
                                <Pencil size={11} />
                              </button>
                              <button
                                type="button"
                                className="topic-action-btn delete"
                                onClick={() => setDeletingTopicId(topicId)}
                                title="Delete topic"
                                aria-label="Delete topic"
                              >
                                <Trash2 size={11} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Topic Input Row */}
                <div className="add-topic-row">
                  <input
                    type="text"
                    className="add-topic-input"
                    placeholder="+ Add topic, then press Enter"
                    value={topicVal}
                    onChange={(e) => handleTopicInputChange(unitId, e.target.value)}
                    onKeyDown={(e) => handleTopicKeyDown(e, unitId)}
                    aria-label={`Add topic to ${unit.name}`}
                  />
                  {topicErr && <div className="inline-error-msg">{topicErr}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Add Unit Button */}
      <div className="add-unit-footer">
        {!isAddingUnit ? (
          <button
            type="button"
            className="btn-add-unit-more"
            onClick={handleStartAddUnit}
            aria-label="Add another unit"
          >
            <Plus size={13} /> Add unit
          </button>
        ) : (
          <div className="add-unit-inline-box">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                ref={newUnitInputRef}
                type="text"
                className="inline-edit-input"
                placeholder="Unit name (e.g. Unit 2: Advanced Topics)"
                value={newUnitName}
                onChange={(e) => {
                  setNewUnitName(e.target.value);
                  setUnitAddError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleConfirmAddUnit();
                  } else if (e.key === 'Escape') {
                    handleCancelAddUnit();
                  }
                }}
                aria-label="Unit name"
              />
              <button
                type="button"
                className="btn-inline-save"
                onClick={handleConfirmAddUnit}
              >
                Add unit
              </button>
              <button
                type="button"
                className="btn-inline-cancel"
                onClick={handleCancelAddUnit}
              >
                Cancel
              </button>
            </div>
            {unitAddError && <div className="inline-error-msg">{unitAddError}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyllabusEditor;
