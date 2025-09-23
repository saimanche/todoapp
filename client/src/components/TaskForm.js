import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, onUpdate, editingTask, onCancelEdit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if(editingTask){
      setName(editingTask.name || '');
      setDescription(editingTask.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name.trim()) return;

    const taskData = { name, description };

    try {
      if(editingTask) {
        if(!editingTask._id) {
          console.error('Task _id is missing');
          return;
        }
        onUpdate(editingTask._id, taskData);
      } else {
        onSubmit(taskData);
      }
    } catch(err) {
      console.error('Error submitting task:', err);
    }

    setName('');
    setDescription('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={name}
        onChange={e=>setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Task Description(optional)"
        value={description}
        onChange={e=>setDescription(e.target.value)}
      />
      <div className="form-row">
        <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
        {editingTask && <button type="button" onClick={onCancelEdit}>Cancel</button>}
      </div>
    </form>
  );
}
