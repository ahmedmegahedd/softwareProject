import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './components/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './components/Unauthorized';

import HomePage from './Pages/HomePage';
import EventDetails from './Pages/EventDetails';
import UserDashboard from './Pages/UserDashboard';
import OrganizerPanel from './Pages/OrganizerPanel';
import AdminConsole from './Pages/AdminConsole';
import MyEvents from './Pages/MyEvents';
import EventForm from './Pages/EventForm';
import EventAnalytics from './Pages/EventAnalytics';
import Profile from './Pages/Profile';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AnimatePresence mode="wait">
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1">
              <Routes>
                {/* Public */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* General pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/events/:id" element={<EventDetails />} />

                {/* Protected: authenticated users */}
                <Route
                  path="/dashboard/*"
                  element={
                    <PrivateRoute allowedRoles={['user', 'organizer', 'admin']}>
                      <UserDashboard />
                    </PrivateRoute>
                  }
                />

                {/* Protected: organizers only */}
                <Route
                  path="/organizer/*"
                  element={
                    <PrivateRoute allowedRoles={['organizer']}>
                      <OrganizerPanel />
                    </PrivateRoute>
                  }
                />

                {/* Protected: admins only */}
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <AdminConsole />
                    </PrivateRoute>
                  }
                />

                {/* Organizer Routes */}
                <Route 
                  path="/my-events" 
                  element={
                    <PrivateRoute allowedRoles={['organizer']}>
                      <MyEvents />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/my-events/new" 
                  element={
                    <PrivateRoute allowedRoles={['organizer']}>
                      <EventForm />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/my-events/:id/edit" 
                  element={
                    <PrivateRoute allowedRoles={['organizer']}>
                      <EventForm />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/my-events/analytics" 
                  element={
                    <PrivateRoute allowedRoles={['organizer']}>
                      <EventAnalytics />
                    </PrivateRoute>
                  } 
                />

                {/* Profile route */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute allowedRoles={['user', 'organizer', 'admin']}>
                      <Profile />
                    </PrivateRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <ToastContainer position="top-right" />
          </div>
        </AnimatePresence>
      </AuthProvider>
    </Router>
  );
}

export default App;