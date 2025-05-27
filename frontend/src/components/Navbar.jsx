import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState, useAuthDispatch } from '../context/AuthContext';
import api from '../api';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await api.post('/logout');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <nav className="bg-background sticky top-0 z-30 shadow-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl font-bold text-primary tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '1px' }}>Tickify</span>
          </Link>
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link to="/" className="btn btn-primary text-base rounded">Home</Link>
            {user && user.role === 'organizer' && (
              <>
                <button
                  className="btn btn-primary text-base rounded"
                  onClick={() => navigate('/my-events/new')}
                >
                  Create New Event
                </button>
                <button
                  className="btn btn-secondary text-base rounded"
                  onClick={() => navigate('/my-events/analytics')}
                >
                  Event Analytics
                </button>
              </>
            )}
            {user && user.role === 'admin' && (
              <>
                <button
                  className="btn btn-warning text-base rounded border-2 border-primary font-bold bg-white text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => navigate('/admin/unapproved-events')}
                >
                  Unapproved Events
                </button>
              </>
            )}
            {user && (
              <Link to="/profile" className="btn btn-primary text-base rounded">Profile</Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="btn btn-primary text-base rounded font-bold">Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary text-base rounded">Login</Link>
                <Link to="/register" className="btn btn-primary text-base rounded">Register</Link>
              </>
            )}
            <button
              type="button"
              tabIndex={0}
              onClick={e => { e.preventDefault(); toggleTheme(); }}
              aria-label="Toggle dark mode"
              className="ml-2 p-2 rounded-full hover:bg-primary/10 transition-colors"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.05 6.05L4.64 4.64m12.02 0l-1.41 1.41M6.05 17.95l-1.41 1.41" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}