import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      const role = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/events');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="p-2 border" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-2 border" />
        <button className="bg-black text-white py-2">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
