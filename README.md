# Task Track App

This project is a full-stack task tracking application with:
- **Frontend:** Vite + React (`/client`)
- **Backend:** Node.js + Express (`/server`)
- **Feature:** Email reminders via Gmail API

## Getting Started

```sh
   git clone https://github.com/DheerajTiruveedhula
```
or download zip

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



**TEAM-17**
1. G.SOLOMON MATTHEWS(LEAD) 22A81A6121
2. N.RAJA                   22A81A6145
3. T.DHEERAJ                22A81A6160
4. CH MANIKANTA             22A81A6111
5. P. GANESH                22A81A6152
6. V. RAMA KRISHNA          23A85A6108


For more details, see the code in each folder.
