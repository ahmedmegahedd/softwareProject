import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { bookEvent } from '../api';
import Spinner from './Spinner';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState(1);
  const [avail, setAvail] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/v1/events/${id}`)
      .then(({ data }) => {
        const ev = { ...data.data, id: data.data._id };
        setEvent(ev);
        setAvail(ev.ticketsAvailable);
      })
      .catch(() => toast.error('Could not load event'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!event) return <p className="p-4">Event not found.</p>;

  const total = event.price * qty;
  const handleBook = async () => {
    try {
      await bookEvent(id, { tickets: qty });
      toast.success('Booking confirmed');
      setAvail(prev => prev - qty);
    } catch {
      toast.error('Booking failed');
    }
  };

  return (
    <div className="flex-1 overflow-auto px-section py-6">
      <img
        src={event.image || '/placeholder.jpg'}
        alt={event.title}
        className="w-full h-64 object-cover rounded-lg shadow"
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="h1">{event.title}</h1>
          <p className="p">{event.description}</p>
          <div className="flex items-center space-x-4 text-secondary">
            <span><strong>Date:</strong> {event.date && event.date.substring(0, 10)}</span>
            <span><strong>Location:</strong> {event.location}</span>
          </div>
          <div>
            <span
              className={`px-3 py-1 rounded-full ${
                avail > 0 ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {avail > 0 ? `Only ${avail} left` : 'Sold Out'}
            </span>
          </div>
        </div>

        <aside className="card p-6 lg:col-span-1 sticky top-20">
          <div className="space-y-4">
            <div>
              <label htmlFor="qty" className="block mb-1">Quantity</label>
              <input
                type="number"
                id="qty"
                min="1"
                max={avail}
                value={qty}
                onChange={e => setQty(Math.min(Math.max(1, parseInt(e.target.value) || 1), avail))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <p className="text-xl font-bold">Total: ${total}</p>
            </div>
            <motion.button
              onClick={handleBook}
              whileHover={{ scale: 1.05 }}
              disabled={avail === 0}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {avail === 0 ? 'Sold Out' : 'Book Now'}
            </motion.button>
          </div>
        </aside>
      </div>
    </div>
  );
}