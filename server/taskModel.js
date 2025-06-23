// taskModel.js
// In-memory task store and logic

let tasks = [];

function getAllTasks() {
  return tasks;
}

function addTask(task) {
  const newTask = { ...task, id: Date.now().toString(), completed: false };
  tasks.push(newTask);
  return newTask;
}

function updateTask(id, updates) {
  if (typeof updates === 'function') {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...updates(tasks[idx]) };
    return tasks[idx];
  }
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...updates };
  return tasks[idx];
}

function deleteTask(id) {
  const prevLen = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  return tasks.length < prevLen;
}

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask
};
