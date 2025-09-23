import React from 'react';

export default function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <span className="task-title">{task.name}</span>
          {task.description && <span className="task-desc">{task.description}</span>}
          <span className="task-time">{new Date(task.createdAt).toLocaleString()}</span>
          <div className="task-actions" style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => onDelete(task._id)}>Delete</button>
            <button onClick={() => onEdit(task)}>Edit</button>
            <button onClick={() => onToggle(task._id, task.completed)}>
              {task.completed ? 'Undo' : 'Complete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
