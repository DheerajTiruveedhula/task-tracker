require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskModel = require('./taskModel');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(taskModel.getAllTasks());
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { title, description, dueDate, email, reminder } = req.body;
  const task = { title, description, dueDate, email, reminder };
  const newTask = taskModel.addTask(task);
  res.status(201).json(newTask);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const updated = taskModel.updateTask(req.params.id, req.body);
  if (!updated) return res.status(404).send('Task not found');
  res.json(updated);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const deleted = taskModel.deleteTask(req.params.id);
  if (!deleted) return res.status(404).send('Task not found');
  res.status(204).send();
});

// Email Reminder Endpoint
app.post('/remind-email', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: `<div style='font-family:Segoe UI,sans-serif;font-size:16px;'>
        <b>Reminder:</b> <span style='color:#207544'>${subject.replace('Task Reminder: ', '')}</span><br><br>
        ${text}<br><br>
        <i>Don't forget to complete your task!</i>
      </div>`
    });
    console.log('Email sent:', info.response);
    res.json({ success: true, info });
  } catch (err) {
    console.error('Email error:', err, err.response?.data);
    res.status(500).json({ success: false, error: err.message, details: err.response?.data });
  }
});

// Toggle task completion
app.patch('/tasks/:id/toggle', (req, res) => {
  const task = taskModel.updateTask(req.params.id, prev => ({ completed: !prev.completed }));
  if (!task) return res.status(404).send('Task not found');
  res.json(task);
});

// Add endpoint to schedule email reminder (demo: interval in minutes)
const scheduledEmailReminders = {};

app.post('/tasks/:id/schedule-email-reminder', (req, res) => {
  const { intervalMinutes } = req.body;
  const task = taskModel.getAllTasks().find(t => t.id === req.params.id);
  if (!task || !task.reminder || !task.email) return res.status(400).json({ error: 'Task or email info missing' });
  if (scheduledEmailReminders[task.id]) clearInterval(scheduledEmailReminders[task.id]);
  scheduledEmailReminders[task.id] = setInterval(async () => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: task.email,
        subject: `Recurring Task Reminder: ${task.title}`,
        html: `<div style='font-family:Segoe UI,sans-serif;font-size:16px;'>
          <b>Reminder:</b> <span style='color:#207544'>${task.title}</span> is due on <b>${task.dueDate}</b>.<br><br>
          <i>Don't forget to complete your task!</i>
        </div>`
      });
    } catch (e) {
      console.error('Failed to send recurring email reminder:', e.message);
    }
  }, intervalMinutes * 60 * 1000);
  res.json({ success: true, message: `Recurring email reminder scheduled every ${intervalMinutes} minutes.` });
});

app.post('/tasks/:id/stop-email-reminder', (req, res) => {
  if (scheduledEmailReminders[req.params.id]) {
    clearInterval(scheduledEmailReminders[req.params.id]);
    delete scheduledEmailReminders[req.params.id];
    return res.json({ success: true, message: 'Recurring email reminder stopped.' });
  }
  res.status(404).json({ error: 'No recurring email reminder found for this task.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
