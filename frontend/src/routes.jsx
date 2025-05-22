import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

// Organizer components
import MyEvents from './components/organizer/MyEvents';
import EventForm from './components/organizer/EventForm';
import EventAnalytics from './components/organizer/EventAnalytics';

// TODO: Add User and Admin routes when ready

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Organizer Dashboard */}
      <Route path="/organizer/dashboard" element={<MyEvents />} />
      <Route path="/organizer/events/create" element={<EventForm />} />
      <Route path="/organizer/events/:id/edit" element={<EventForm />} />
      <Route path="/organizer/analytics" element={<EventAnalytics />} />

      {/* 404 fallback (optional) */}
      <Route path="*" element={<h1 style={{ padding: "2rem" }}>404 - Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
