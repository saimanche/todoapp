const taskService = require('../services/taskService');

const getTasks = async (req, res) => {
  try {
    const data = await taskService.getAllTasks();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Task name required' });
    const task = await taskService.addTask({ name, description });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  editTask,
  removeTask,
};
