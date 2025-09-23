import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

const API = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [counts, setCounts] = useState({ total: 0, pending: 0, completed: 0 });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      data.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      );
      setTasks(data);
    } catch (err) {
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const res = await fetch(`${API}/counts`);
      if (!res.ok) throw new Error('Failed to fetch counts');
      const data = await res.json();
      setCounts(data);
    } catch (err) {
      console.error('Fetch counts error:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCounts();
  }, []);

  const addTask = async (task) => {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const data = await res.json();
      setTasks(prev => [data, ...prev]);
      fetchCounts();
    } catch (err) {
      console.error('Add task error:', err);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const data = await res.json();
      setTasks(prev => [data, ...prev.filter(t => t._id !== id)]);
      setEditingTask(null);
      fetchCounts();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t._id !== id));
      fetchCounts();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) throw new Error('Failed to toggle task');
      const data = await res.json();
      setTasks(prev => [data, ...prev.filter(t => t._id !== id)]);
      fetchCounts();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>My To-Do List</h1>

      <TaskForm
        onSubmit={addTask}
        onUpdate={updateTask}
        editingTask={editingTask}
        onCancelEdit={() => setEditingTask(null)}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
        <button onClick={() => setFilter('all')} style={{ fontWeight: filter==='all'?700:500 }}>All</button>
        <button onClick={() => setFilter('pending')} style={{ fontWeight: filter==='pending'?700:500 }}>Pending</button>
        <button onClick={() => setFilter('completed')} style={{ fontWeight: filter==='completed'?700:500 }}>Completed</button>
      </div>

      <div className="task-counts">
        <p>Total: {counts.total} | Pending: {counts.pending} | Completed: {counts.completed}</p>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading ? <div>Loading...</div> :
          <TaskList
            tasks={filteredTasks}
            onEdit={task => setEditingTask(task)}
            onDelete={id => setConfirmDeleteId(id)}
            onToggle={toggleTask}
          />}
      </div>

      {confirmDeleteId && (
        <div className="confirm-popup">
          <div className="confirm-box">
            <p>Are you sure you want to delete this task?</p>
            <button onClick={() => { deleteTask(confirmDeleteId); setConfirmDeleteId(null); }}>Yes</button>
            <button onClick={() => setConfirmDeleteId(null)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
