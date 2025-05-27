import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex-center min-h-screen bg-background px-4">
      <div className="bg-surface rounded-xl shadow-lg p-8 w-full max-w-lg border border-border flex flex-col items-center" data-aos="fade-up">
        <h1 className="h1 mb-4 text-center">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
          <div>
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="form-input"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        <div className="w-full flex items-center my-8">
          <div className="flex-1 border-t border-border" />
          <span className="mx-4 text-textSecondary">or</span>
          <div className="flex-1 border-t border-border" />
        </div>
        <div className="text-center text-textSecondary text-sm space-y-1">
          <div>Email: <a href="mailto:info@tickify.com" className="text-primary hover:underline">info@tickify.com</a></div>
          <div>Phone: <a href="tel:+201234567890" className="text-primary hover:underline">+20 123 456 7890</a></div>
          <div>Address: German International University, Cairo, Egypt</div>
        </div>
      </div>
    </div>
  );
} 