import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="flex-center flex-1 flex-col">
      <h1 className="h1 text-red-600">Unauthorized</h1>
      <p className="mb-4">You do not have permission to view this page.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}