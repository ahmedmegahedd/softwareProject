import React, { useEffect, useState } from 'react';
import api from '../api';
import Spinner from '../components/Spinner';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/users/profile')
      .then(({ data }) => {
        setUser(data.data);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex-center min-h-screen"><Spinner /></div>;
  if (error) return <div className="flex-center min-h-screen text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="flex-center min-h-screen bg-black px-4">
      <div className="bg-neutral-900 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>
        <div className="space-y-4">
          <div>
            <span className="block text-gray-400 text-sm">Name</span>
            <span className="block text-lg text-white font-semibold">{user.name}</span>
          </div>
          <div>
            <span className="block text-gray-400 text-sm">Email</span>
            <span className="block text-lg text-white font-semibold">{user.email}</span>
          </div>
          <div>
            <span className="block text-gray-400 text-sm">Role</span>
            <span className="block text-lg text-white font-semibold capitalize">{user.role}</span>
          </div>
          <div>
            <span className="block text-gray-400 text-sm">Joined</span>
            <span className="block text-lg text-white font-semibold">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 