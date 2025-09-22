const Task = require('../models/task.js');

const getAllTasks = async () => {
  const tasks = await Task.find().sort({ updatedAt: -1 });
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ completed: true });
  const pendingTasks = totalTasks - completedTasks;
  return { tasks, totalTasks, completedTasks, pendingTasks };
};

const addTask = async ({ name, description }) => {
  const task = new Task({ name, description });
  await task.save();
  return task;
};

const updateTask = async (id, data) => {
  return await Task.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deleteTask = async (id) => {
  await Task.findByIdAndDelete(id);
  return { success: true };
};

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
};
