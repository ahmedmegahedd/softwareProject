import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Step 1: Send OTP
  const handleSendOTP = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await api.put('/forgetPassword', { email: form.email });
      setMessage(data.message || 'OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and reset password
  const handleResetPassword = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.put('/resetPassword', {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword
      });
      setMessage(data.message || 'Password reset successful. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center flex-1">
      <div className="card p-8 w-full max-w-md">
        <h2 className="h2 text-center">Reset Password</h2>
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        {message && <p className="text-green-600 text-sm text-center mb-4">{message}</p>}
        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              name="otp"
              type="text"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}