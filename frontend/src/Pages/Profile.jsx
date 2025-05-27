import React, { useEffect, useState } from 'react';
import api from '../api';
import Spinner from '../components/Spinner';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
    AOS.init({ duration: 700, once: true });
  }, []);

  if (loading) return <div className="flex-center min-h-screen"><Spinner /></div>;
  if (error) return <div className="flex-center min-h-screen text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="flex-center min-h-screen bg-background px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-border" data-aos="fade-up">
        <h1 className="h1 mb-6">Profile</h1>
        <div className="space-y-4">
          <div>
            <span className="block text-primary text-sm">Name</span>
            <span className="block text-lg text-text font-semibold">{typeof user.name === 'string' ? user.name : String(user.name)}</span>
          </div>
          <div>
            <span className="block text-primary text-sm">Email</span>
            <span className="block text-lg text-text font-semibold">{typeof user.email === 'string' ? user.email : String(user.email)}</span>
          </div>
          <div>
            <span className="block text-primary text-sm">Role</span>
            <span className="block text-lg text-text font-semibold capitalize">{typeof user.role === 'string' ? user.role : String(user.role)}</span>
          </div>
          <div>
            <span className="block text-primary text-sm">Joined</span>
            <span className="block text-lg text-text font-semibold">{user.createdAt && (typeof user.createdAt === 'string' || typeof user.createdAt === 'number' ? new Date(user.createdAt).toLocaleDateString() : String(user.createdAt))}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 