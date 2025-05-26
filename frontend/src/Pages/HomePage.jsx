import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import Spinner from '../components/Spinner';
import api, { getApprovedEvents } from '../api';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]); // Store all events
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);

  const fetchEvents = useCallback(async (search = '') => {
    try {
      setLoading(true);
      const { data } = await getApprovedEvents(search);
      const fetchedEvents = data.data || [];
      setAllEvents(fetchedEvents); // Store all events
      
      if (search) {
        // Filter events based on search query
        const searchLower = search.toLowerCase();
        const filtered = fetchedEvents.filter(event => 
          event.title?.toLowerCase().includes(searchLower) ||
          event.location?.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower)
        );
        setEvents(filtered);
        setNoResults(filtered.length === 0);
        if (filtered.length === 0) {
          toast.info('No events found matching your search');
        }
      } else {
        setEvents(fetchedEvents);
        setNoResults(fetchedEvents.length === 0);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Could not load events');
      setEvents([]);
      setAllEvents([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchQuery('');
      setEvents(allEvents); // Show all events when search is cleared
      setNoResults(allEvents.length === 0);
      return;
    }
    
    setSearchQuery(query);
    setSearching(true);
    
    // Filter existing events first for immediate feedback
    const searchLower = query.toLowerCase();
    const filtered = allEvents.filter(event =>
      event.title?.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower)
    );
    setEvents(filtered);
    setNoResults(filtered.length === 0);
    
    // Then fetch from server for fresh results
    await fetchEvents(query);
    setSearching(false);
  };

  if (loading && !searching) return <Spinner />;

  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section */}
      <section className="flex-center flex-col min-h-[60vh] bg-black px-section sticky top-0 z-10">
        <h1 className="h1 text-white">Find your next experience</h1>
        <p className="text-lg text-gray-300 mb-6">Discover, book, and enjoy events with Ehgez Hafla</p>
        <SearchBar
          placeholder="Search events, venues..."
          inputClassName="text-[#f0f0f0] placeholder-gray-400"
          onSearch={handleSearch}
        />
      </section>

      {/* Loading State */}
      {searching && (
        <div className="flex-center py-8">
          <Spinner />
        </div>
      )}

      {/* Carousel - Only show when not searching */}
      {!searching && searchQuery === '' && !noResults && (
        <section className="mt-section px-section">
          <h2 className="h2 text-white">Events for you</h2>
          <div className="flex space-x-4 overflow-x-auto py-2">
            {events.slice(0, 5).map(evt => (
              <EventCard key={evt._id} event={evt} horizontal />
            ))}
          </div>
        </section>
      )}

      {/* Grid of All Events or Search Results */}
      <section className="mt-section px-section">
        <h2 className="h2 text-white">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Events'}
        </h2>
        {noResults ? (
          <div className="text-center text-gray-400 py-12 text-xl">
            {searchQuery ? 'No events found matching your search.' : 'No events available.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(evt => (
              <motion.div key={evt._id} whileHover={{ scale: 1.03 }}>
                <EventCard event={evt} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}