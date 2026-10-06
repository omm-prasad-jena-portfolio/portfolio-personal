import React, { useState, useEffect } from 'react';
import { Check, Plus } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useDashboardData } from '../../context/DashboardContext';

export const TasksCard: React.FC = () => {
  const { data } = useDashboardData();
  const [activeTab, setActiveTab] = useState<'All' | 'Today' | 'Upcoming' | 'Completed'>('All');
  const [taskList, setTaskList] = useState(data.tasks);

  useEffect(() => {
    setTaskList(data.tasks);
  }, [data.tasks]);

  const toggleTask = (id: string) => {
    setTaskList(
      taskList.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredTasks = taskList.filter((t) => {
    if (activeTab === 'Today') return t.category === 'Today';
    if (activeTab === 'Upcoming') return t.category === 'Upcoming';
    if (activeTab === 'Completed') return t.completed;
    return true;
  });

  return (
    <Card>
      <div className="tasks-tabs-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Tasks</h4>
          <div className="tasks-tabs-list">
            {(['All', 'Today', 'Upcoming', 'Completed'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                className={`task-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <a
          href="/add-task"
          className="add-task-link"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          onClick={(e) => {
            e.preventDefault();
            alert('Add task dialog');
          }}
        >
          <Plus size={14} /> Add Task
        </a>
      </div>

      <div className="tasks-items-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-item-row">
            <div className="task-item-left">
              <div
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                {task.completed && <Check size={12} />}
              </div>
              <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                {task.title}
              </span>
            </div>

            <div className="task-item-right">
              <Badge
                color={
                  task.subject === 'DSA'
                    ? '#10b981'
                    : task.subject === 'Mathematics'
                    ? '#6366f1'
                    : '#94a3b8'
                }
                bg={
                  task.subject === 'DSA'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : task.subject === 'Mathematics'
                    ? 'rgba(99, 102, 241, 0.15)'
                    : 'rgba(148, 163, 184, 0.15)'
                }
              >
                {task.subject}
              </Badge>
              <span className="task-duration">{task.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TasksCard;
