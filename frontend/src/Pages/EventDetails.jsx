import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../api';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState(1);
  const [availability, setAvailability] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/v1/events/${id}`);
        setEvent(data.data);
        setAvailability(data.data.ticketsAvailable);
      } catch (err) {
        toast.error('Could not load event');
      }
    })();
  }, [id]);

  if (!event) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  const total = event.price * qty;
  const handleBook = async () => {
    try {
      await api.post(`/api/v1/bookings`, { eventId: id, tickets: qty });
      toast.success('Booking confirmed!');
      setAvailability(prev => prev - qty);
    } catch (err) {
      toast.error('Booking failed. Try again.');
    }
  };

  return (
    <div className="flex-1 overflow-auto px-4 py-6">
      <img
        src={event.image || '/placeholder.jpg'}
        alt={event.title}
        className="w-full h-64 object-cover rounded-2xl shadow"
      />
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Info */}
        <div>
          <h2 className="text-3xl font-bold">{event.title}</h2>
          <p className="text-gray-600 mt-2">{event.description}</p>
          <div className="mt-4 space-y-2">
            <p><strong>Date:</strong> {event.date && event.date.substring(0, 10)}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                {availability > 0 
                  ? `Only ${availability} left` 
                  : 'Sold Out'}
              </span>
            </p>
          </div>
        </div>
        {/* Booking Sidebar */}
        <aside className="bg-white p-6 rounded-2xl shadow sticky top-24">
          <div className="space-y-4">
            <div>
              <label htmlFor="qty" className="block text-sm font-medium">
                Quantity
              </label>
              <input
                type="number"
                id="qty"
                min="1"
                max={availability}
                value={qty}
                onChange={e => setQty(Math.min(Math.max(1, Number(e.target.value)), availability))}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <p className="text-xl font-bold">Total: ${total}</p>
            </div>
            <motion.button
              onClick={handleBook}
              whileHover={{ scale: 1.05 }}
              className="w-full px-4 py-3 bg-[#FF5700] text-white rounded-full font-semibold"
              disabled={availability === 0}
            >
              {availability === 0 ? 'Sold Out' : 'Book Now'}
            </motion.button>
          </div>
        </aside>
      </div>
    </div>
  );
}