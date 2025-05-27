import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex-center min-h-screen bg-white px-4">
      <div className="bg-background rounded-xl shadow-lg p-8 w-full max-w-md text-center border border-border">
        <h1 className="h1 text-primary mb-2">Access Denied</h1>
        <p className="mb-6 text-deep">You don't have permission to access this page.</p>
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary w-full"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')} 
            className="btn btn-primary w-full"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
} 