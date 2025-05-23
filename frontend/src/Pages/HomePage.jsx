import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import Spinner from '../components/Spinner';
import api from '../api';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events')
      .then(({ data }) => {
        setEvents((data.data || []).map(e => ({ ...e, id: e._id })));
      })
      .catch(() => toast.error('Could not load events'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section */}
      <section className="flex-center flex-col h-screen bg-gradient-to-r from-white to-gray-100 px-section">
        <h1 className="h1">Find your next experience</h1>
        <SearchBar placeholder="Search events, venues..." />
      </section>

      {/* Carousel */}
      <section className="mt-section px-section">
        <h2 className="h2">Events for you</h2>
        <div className="flex space-x-4 overflow-x-auto py-2">
          {events.slice(0, 5).map(evt => (
            <EventCard key={evt.id} event={evt} horizontal />
          ))}
        </div>
      </section>

      {/* Grid of All Events */}
      <section className="mt-section px-section">
        <h2 className="h2">All Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(evt => (
            <motion.div key={evt.id} whileHover={{ scale: 1.03 }}>
              <EventCard event={evt} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}