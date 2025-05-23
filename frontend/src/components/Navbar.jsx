import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState, useAuthDispatch } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-section py-3 flex items-center justify-between">
      <Link to="/" className="font-bold text-xl text-[#FF5700]">Eventify</Link>
      <div className="flex items-center space-x-4">
        {!user && (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
        {user && (
          <>
            <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
            {user.role === 'organizer' && (
              <Link to="/organizer" className="btn btn-secondary">Organizer</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" className="btn btn-secondary">Admin</Link>
            )}
            <button onClick={handleLogout} className="btn btn-primary">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}