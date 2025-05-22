import React, { useState } from 'react';
import axios from '../../api/api';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // default role
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form);
      alert('Registered! Please login.');
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" type="text" placeholder="Full Name" onChange={handleChange} className="p-2 border" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="p-2 border" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-2 border" />
        <select name="role" onChange={handleChange} className="p-2 border">
          <option value="user">User</option>
          <option value="organizer">Organizer</option>
        </select>
        <button className="bg-green-600 text-white py-2">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
