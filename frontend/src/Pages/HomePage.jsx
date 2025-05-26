import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import Spinner from '../components/Spinner';
import api, { getApprovedEvents } from '../api';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);

  const fetchEvents = useCallback((search = '') => {
    setLoading(true);
    getApprovedEvents(search)
      .then(({ data }) => {
        const filtered = data.data || [];
        setEvents(filtered);
        setNoResults(filtered.length === 0);
      })
      .catch(() => {
        toast.error('Could not load events');
        setEvents([]);
        setNoResults(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearching(true);
    fetchEvents(query);
    setSearching(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section */}
      <section className="flex-center flex-col min-h-[60vh] bg-black px-section sticky top-0 z-10">
        <h1 className="h1 text-white">Find your next experience</h1>
        <p className="text-lg text-gray-300 mb-6">Discover, book, and enjoy events with Ehgez Hafla</p>
        <SearchBar
          placeholder="Search events, venues..."
          inputClassName="text-white placeholder-gray-400"
          onSearch={handleSearch}
        />
      </section>

      {/* Carousel */}
      {searchQuery === '' && !noResults && (
        <section className="mt-section px-section">
          <h2 className="h2">Events for you</h2>
          <div className="flex space-x-4 overflow-x-auto py-2">
            {events.slice(0, 5).map(evt => (
              <EventCard key={evt.id} event={evt} horizontal />
            ))}
          </div>
        </section>
      )}

      {/* Grid of All Events or Search Results */}
      <section className="mt-section px-section">
        <h2 className="h2">{searchQuery ? 'Search Results' : 'All Events'}</h2>
        {noResults ? (
          <div className="text-center text-gray-400 py-12 text-xl">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(evt => (
              <motion.div key={evt.id} whileHover={{ scale: 1.03 }}>
                <EventCard event={evt} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}