import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import Spinner from '../components/Spinner';
import api, { getApprovedEvents } from '../api';
import { useAuthState } from '../context/AuthContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Rolling Stone concert crowd (direct image)
const CONCERT_IMAGES = [
  // Direct Unsplash concert/crowd images
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80',
  // Add more direct Unsplash image links as needed
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
  // You can add more direct links here if you have them
];

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]); // Store all events
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const { user, loading: authLoading } = useAuthState();
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);

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
    AOS.init({ duration: 700, once: true });
    const interval = setInterval(() => {
      setBgIndex(i => (i + 1) % CONCERT_IMAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchQuery('');
      setEvents(allEvents); // Show all events when search is cleared
      setNoResults(allEvents.length === 0);
      return;
    }
    setSearchQuery(query);
    setSearching(true);
    const searchLower = query.toLowerCase();
    const filtered = allEvents.filter(event =>
      event.title?.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower)
    );
    setEvents(filtered);
    setNoResults(filtered.length === 0);
    setSearching(false);
  };

  if (loading && !searching) return <Spinner />;

  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section with dynamic concert background */}
      <section className="relative min-h-[60vh] w-full px-section py-16 overflow-hidden flex-center flex-col" style={{minHeight: '60vh', background: 'none'}}>
        {/* Background image and overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${CONCERT_IMAGES[bgIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 1s ease-in-out',
          }}
        >
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        </div>
        {/* Content above overlay */}
        <div className="relative z-10 w-full flex flex-col items-center">
          <motion.h1
            className="h1 text-5xl md:text-6xl font-extrabold mb-4 text-primary text-center drop-shadow-lg"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Find your next experience
          </motion.h1>
          <motion.p
            className="text-xl text-primary mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            Discover, book, and enjoy events with Tickify
          </motion.p>
          <motion.div
            className="w-full max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <SearchBar
              placeholder="Search events, venues..."
              inputClassName="text-text placeholder-primary text-lg py-4 rounded-full bg-white shadow-none border-none"
              onSearch={handleSearch}
              buttonClassName="px-8 py-3 bg-primary text-white rounded-full font-bold text-lg shadow-none hover:bg-primary/80 transition-colors"
            />
          </motion.div>
        </div>
      </section>

      {/* Loading State */}
      {searching && (
        <div className="flex-center py-8">
          <Spinner />
        </div>
      )}

      {/* Carousel - Only show when not searching */}
      {!searching && searchQuery === '' && !noResults && (
        <section className="mt-section px-section bg-[#FFF3E6] py-10 rounded-2xl" data-aos="fade-up">
          <h2 className="h2 text-primary mb-6">Events for you</h2>
          <div className="flex space-x-6 overflow-x-auto py-2">
            {events.slice(0, 5).map(evt => (
              <div key={evt._id} data-aos="fade-up">
                <EventCard event={evt} horizontal />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid of All Events or Search Results */}
      <section className="mt-section px-section py-12" data-aos="fade-up">
        <h2 className="h2 text-primary mb-8">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Events'}
        </h2>
        {noResults ? (
          <div className="text-center text-primary/70 py-12 text-xl">
            {searchQuery ? 'No events found matching your search.' : 'No events available.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map(evt => (
              <div key={evt._id} data-aos="fade-up">
                <EventCard event={evt} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}