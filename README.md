# Task Track App

**TEAM-17**

This project is a full-stack task tracking application with:
- **Frontend:** Vite + React (`/client`)
- **Backend:** Node.js + Express (`/server`)
- **Feature:** Email reminders via Gmail API

## Getting Started

### Backend
1. Go to the `server` folder:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your `.env` file with Gmail credentials.
4. Start the backend:
   ```sh
   node index.js
   ```

### Frontend
1. Go to the `client` folder:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```

## Email Reminders
- The backend exposes a `/remind-email` endpoint to send email reminders using Gmail.
- You must set up your `.env` file with your Gmail address and App Password.
- Recurring reminders can be scheduled via `/tasks/:id/schedule-email-reminder`.

---

For more details, see the code in each folder.
