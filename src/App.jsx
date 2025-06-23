import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function Alert({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div style={{
      background: type === 'success' ? '#e6ffed' : '#ffe6e6',
      color: type === 'success' ? '#207544' : '#a94442',
      border: '1px solid ' + (type === 'success' ? '#b2f2c9' : '#f5c6cb'),
      padding: 14,
      borderRadius: 8,
      marginBottom: 24,
      position: 'relative',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
    }}>
      {message}
      <button onClick={onClose} style={{ position: 'absolute', right: 12, top: 10, background: 'none', border: 'none', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', color: '#888' }}>×</button>
    </div>
  );
}

function TaskForm({ onSave, editingTask, onCancel }) {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const [email, setEmail] = useState(editingTask?.email || '');
  const [reminder, setReminder] = useState(editingTask?.reminder || false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate);
      setEmail(editingTask.email);
      setReminder(editingTask.reminder);
    }
  }, [editingTask]);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ title, description, dueDate, email, reminder });
    setTitle(''); setDescription(''); setDueDate(''); setEmail(''); setReminder(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      marginBottom: 28,
      background: '#f9f9f9',
      padding: 18,
      borderRadius: 10,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      alignItems: 'center'
    }}>
      <input required placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle} />
      <input required placeholder="Reminder Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
      <label style={{display:'flex',alignItems:'center',gap:4}}>
        <input type="checkbox" checked={reminder} onChange={e => setReminder(e.target.checked)} /> Email Reminder
      </label>
      <button type="submit" style={buttonStyle}>{editingTask ? 'Update' : 'Add'} Task</button>
      {editingTask && <button type="button" onClick={onCancel} style={{...buttonStyle, background:'#eee',color:'#333'}}>Cancel</button>}
    </form>
  );
}

const inputStyle = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid #ccc',
  fontSize: 15,
  flex: '1 1 120px'
};

const buttonStyle = {
  background: '#207544',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '8px 18px',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 15
};

function TaskList({ tasks, onEdit, onDelete, onRemind, onSchedule, onStop, onToggleComplete }) {
  return (
    <ul style={{listStyle:'none',padding:0}}>
      {tasks.map(task => (
        <li key={task.id} style={{
          marginBottom: 18,
          background: task.completed ? '#e6ffed' : '#fff',
          borderRadius: 10,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          padding: 16,
          borderLeft: task.completed ? '6px solid #207544' : '6px solid #f0ad4e',
          position: 'relative',
          opacity: task.completed ? 0.7 : 1
        }}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <input type="checkbox" checked={task.completed} onChange={() => onToggleComplete(task)} style={{width:18,height:18}} />
            <div style={{fontSize:18,fontWeight:600,marginBottom:4,textDecoration:task.completed?'line-through':'none',color:task.completed?'#207544':'#222'}}>{task.title} {task.completed ? '✅' : ''}</div>
          </div>
          <div style={{color:'#888',fontSize:14,marginBottom:6}}>{task.dueDate}</div>
          {task.description && <div style={{marginBottom:6}}>{task.description}</div>}
          {task.email && <div style={{fontSize:13,marginBottom:6}}>📧 <b>Reminder Email:</b> {task.email}</div>}
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button onClick={() => onEdit(task)} style={buttonStyle}>Edit</button>
            <button onClick={() => onDelete(task.id)} style={{...buttonStyle,background:'#d9534f'}}>Delete</button>
            {task.email && <button onClick={() => onRemind(task)} style={{...buttonStyle,background:'#0275d8'}}>Send Email Reminder</button>}
            {task.reminder && <>
              <button onClick={() => onSchedule(task)} style={{...buttonStyle,background:'#f0ad4e',color:'#333'}}>Schedule Recurring</button>
              <button onClick={() => onStop(task)} style={{...buttonStyle,background:'#eee',color:'#333'}}>Stop Recurring</button>
            </>}
          </div>
        </li>
      ))}
    </ul>
  );
}

function FilterBar({ filter, setFilter }) {
  return (
    <div style={{display:'flex',gap:10,marginBottom:20,justifyContent:'center'}}>
      <button onClick={() => setFilter('all')} style={filterBtnStyle(filter==='all')}>All</button>
      <button onClick={() => setFilter('active')} style={filterBtnStyle(filter==='active')}>Active</button>
      <button onClick={() => setFilter('completed')} style={filterBtnStyle(filter==='completed')}>Completed</button>
    </div>
  );
}
const filterBtnStyle = active => ({
  background: active ? '#207544' : '#eee',
  color: active ? '#fff' : '#333',
  border: 'none',
  borderRadius: 6,
  padding: '7px 18px',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 15,
  boxShadow: active ? '0 1px 4px rgba(32,117,68,0.12)' : 'none'
});

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: 'success' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get(`${API_URL}/tasks`).then(res => setTasks(res.data));
  }, []);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: 'success' }), 4000);
  };

  const addTask = async (task) => {
    if (editingTask) {
      const res = await axios.put(`${API_URL}/tasks/${editingTask.id}`, task);
      setTasks(tasks.map(t => t.id === editingTask.id ? res.data : t));
      setEditingTask(null);
    } else {
      const res = await axios.post(`${API_URL}/tasks`, task);
      setTasks([...tasks, res.data]);
    }
    showAlert(editingTask ? 'Task updated!' : 'Task added!', 'success');
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    setTasks(tasks.filter(t => t.id !== id));
    showAlert('Task deleted!', 'success');
  };

  const sendEmailReminder = async (task) => {
    if (!task.email) return showAlert('No email address for reminder!', 'error');
    try {
      await axios.post(`${API_URL}/remind-email`, {
        to: task.email,
        subject: `Task Reminder: ${task.title}`,
        text: `Reminder: ${task.title} is due on ${task.dueDate}`
      });
      showAlert('Email reminder sent!', 'success');
    } catch (e) {
      showAlert('Failed to send email reminder: ' + e.message, 'error');
    }
  };

  const scheduleRecurring = async (task) => {
    const interval = prompt('Enter interval in minutes for recurring email reminder:', '60');
    if (!interval || isNaN(interval)) return;
    try {
      await axios.post(`${API_URL}/tasks/${task.id}/schedule-email-reminder`, { intervalMinutes: Number(interval) });
      showAlert('Recurring email reminder scheduled!', 'success');
    } catch (e) {
      showAlert('Failed to schedule recurring reminder: ' + e.message, 'error');
    }
  };

  const stopRecurring = async (task) => {
    try {
      await axios.post(`${API_URL}/tasks/${task.id}/stop-email-reminder`);
      showAlert('Recurring email reminder stopped!', 'success');
    } catch (e) {
      showAlert('Failed to stop recurring reminder: ' + e.message, 'error');
    }
  };

  const toggleComplete = async (task) => {
    try {
      const res = await axios.patch(`${API_URL}/tasks/${task.id}/toggle`);
      setTasks(tasks.map(t => t.id === task.id ? res.data : t));
      showAlert(res.data.completed ? 'Task marked as completed!' : 'Task marked as incomplete!', 'success');
    } catch (e) {
      showAlert('Failed to update task completion: ' + e.message, 'error');
    }
  };

  const filteredTasks = tasks
    .filter(t => filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed)
    .sort((a, b) => b.id.localeCompare(a.id)); // Most recent first

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f4f8fb',
      padding: 0
    }}>
      <div style={{
        maxWidth: 650,
        width: '100%',
        fontFamily: 'Segoe UI, sans-serif',
        background: '#fff',
        padding: 32,
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{textAlign:'center',color:'#207544',marginBottom:24}}>Task Tracker</h1>
        <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: 'success' })} />
        <FilterBar filter={filter} setFilter={setFilter} />
        <TaskForm onSave={addTask} editingTask={editingTask} onCancel={() => setEditingTask(null)} />
        <TaskList tasks={filteredTasks} onEdit={setEditingTask} onDelete={deleteTask} onRemind={sendEmailReminder} onSchedule={scheduleRecurring} onStop={stopRecurring} onToggleComplete={toggleComplete} />
      </div>
    </div>
  );
}
