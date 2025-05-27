# 🎫 Tickify – Online Event Ticketing System

## 📌 Overview
**Tickify** is a full-stack MERN web application. It enables users to browse, create, and book tickets for various events including concerts, sports, and theater shows. The UI features a modern orange and white theme for a vibrant, clean, and accessible experience.

---

## 🚀 Features

### 🧑‍💻 User Roles
- **Standard User**: Browse, search, book tickets, view and cancel bookings.
- **Event Organizer**: Create, edit, delete events and view analytics.
- **System Admin**: Manage users and approve or reject events.

### 🎟 Event Management
- Create, update, and delete events (organizers)
- Event status system (approved/pending/declined)
- Admin review and event control

### 🔍 Booking System
- Real-time ticket availability
- Price calculation by quantity
- Cancelation and auto-restock tickets

### 🔐 Authentication
- Register/Login with JWT and cookie-based sessions
- Role-based route protection
- Password hashing via bcrypt
- Forgot password functionality

### 🖥 Frontend Features
- Responsive design (React + Tailwind)
- Event search & filtering
- Admin dashboard
- User profile and update form
- Recharts-based analytics

---

## 📦 Tech Stack

| Layer         | Technology                        |
|---------------|------------------------------------|
| Frontend      | React.js, Axios, Tailwind CSS      |
| Backend       | Node.js, Express.js                |
| Database      | MongoDB (Mongoose)                 |
| Authentication| JWT + HttpOnly Cookies + Bcrypt    |
| DevOps        | GitHub, Vercel/Netlify             |

---

## 🛠 Environment Variables

### Backend (.env)
- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – Secret for JWT signing
- `EMAIL_USER` – Email address for sending OTPs (Gmail recommended)
- `EMAIL_PASS` – App password for the email account
- `NODE_ENV` – `development` or `production`
- `FRONTEND_URL` – (optional) Allowed CORS origin, e.g. `http://localhost:3000`

### Frontend
- No required `.env` variables by default. If you add API proxying or custom endpoints, document them here.

---

## 🎨 Dark/Light Mode Theming

- The app uses a custom CSS variable system for dark/light mode, toggled via the button in the navbar.
- The current theme is stored in `localStorage` and applied via a `[data-theme]` attribute on `<html>`.
- All color classes (e.g., `bg-background`, `text-text`) are mapped to CSS variables, so the theme updates instantly.
- **No Tailwind `dark:` utilities are used.**
- To add new theme colors, edit `:root` and `[data-theme='dark']` in `src/index.css`.
- If the theme toggle does not work, ensure you are not using Tailwind `dark:` classes and that React versions are consistent.

---



