import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
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

function App() {
  return (
    <AuthProvider>
      <Router>
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
                  <PrivateRoute>
                    <UserDashboard />
                  </PrivateRoute>
                }
              />

              {/* Protected: organizers only */}
              <Route
                path="/organizer/*"
                element={
                  <PrivateRoute roleRequired="organizer">
                    <OrganizerPanel />
                  </PrivateRoute>
                }
              />

              {/* Protected: admins only */}
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute roleRequired="admin">
                    <AdminConsole />
                  </PrivateRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <ToastContainer position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;