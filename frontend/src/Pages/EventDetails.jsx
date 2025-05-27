import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../api';
import Spinner from '../components/Spinner';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState(1);
  const [availability, setAvailability] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(({ data }) => {
        setEvent(data.data);
        setAvailability(data.data.ticketsAvailable);
      })
      .catch(() => toast.error('Failed to load event'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!event) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  const total = event.price * qty;
  const handleBook = async () => {
    try {
      await api.post(`/events/${id}/bookings`, { tickets: qty });
      toast.success('Booking confirmed!');
      setAvailability(prev => prev - qty);
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.error || 'Booking failed. Try again.');
    }
  };

  const handleRegister = () => {
    api.post(`/events/${id}/register`)
      .then(() => {
        toast.success('Successfully registered for event');
        navigate('/dashboard');
      })
      .catch(() => toast.error('Registration failed'));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-auto px-4 py-6"
    >
      <motion.img
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        src={event.image || '/placeholder.jpg'}
        alt={event.title}
        className="w-full h-64 object-cover rounded-2xl shadow bg-primary/10"
      />
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Info */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="h1">{typeof event.title === 'string' ? event.title : String(event.title)}</h2>
          <p className="p mt-2">{typeof event.description === 'string' ? event.description : String(event.description)}</p>
          <div className="mt-4 space-y-2">
            <p><strong>Date:</strong> {event.date && (typeof event.date === 'string' || typeof event.date === 'number' ? new Date(event.date).toLocaleDateString() : String(event.date))}</p>
            <p><strong>Location:</strong> {typeof event.location === 'string' ? event.location : String(event.location)}</p>
            <p>
              <span className={`px-2 py-1 rounded-full text-sm font-semibold shadow-sm ${
                availability > 0 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-deep/10 text-deep'
              }`}>
                {availability > 0 
                  ? `Only ${availability} left` 
                  : 'Sold Out'}
              </span>
            </p>
          </div>
        </motion.div>
        {/* Booking Sidebar */}
        <motion.aside
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card p-6 rounded-2xl shadow sticky top-24 bg-white"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="qty" className="form-label">Quantity</label>
              <input
                type="number"
                id="qty"
                min="1"
                max={availability}
                value={qty}
                onChange={e => setQty(Math.min(Math.max(1, Number(e.target.value)), availability))}
                className="form-input"
              />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">Total: ${total}</p>
            </div>
            <motion.button
              onClick={handleBook}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={availability === 0}
            >
              {availability === 0 ? 'Sold Out' : 'Book Now'}
            </motion.button>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}