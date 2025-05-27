import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EventCard({ event, horizontal = false }) {
  const formatDate = (date) => {
    if (!date) return 'Date TBA';
    return new Date(date).toLocaleDateString();
  };

  const formatPrice = (price) => {
    if (!price) return 'Free';
    return `$${price}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(59,130,246,0.12)' }}
      transition={{ duration: 0.3 }}
      className="card block overflow-hidden p-0 transition-transform duration-200 hover:scale-105 hover:shadow-lg"
      style={{ minHeight: horizontal ? '8rem' : undefined }}
    >
      <Link
        to={`/events/${event.id || event._id}`}
        aria-label={`View details for event: ${event.title}`}
        tabIndex={0}
      >
        <img
          src={event.image && event.image.trim() ? event.image : '/default-event.jpg'}
          alt={event.title || 'Event image'}
          className={`${horizontal ? 'w-32 h-32' : 'w-full h-48'} object-cover rounded-t-lg ${horizontal ? 'rounded-l-lg rounded-tr-none' : ''}`}
          onError={e => {
            e.target.onerror = null;
            e.target.src = '/default-event.jpg';
          }}
        />
        <div className={`p-6 flex flex-col justify-between ${horizontal ? 'flex-1' : ''}`}>
          <div>
            <h3 className="card-title mb-2 truncate text-text">{typeof event.title === 'string' ? event.title : String(event.title)}</h3>
            <p className="card-meta mb-2 text-textSecondary">{formatDate(event.date)} • {typeof event.location === 'string' ? event.location : String(event.location) || 'Location TBA'}</p>
          </div>
          <div className="flex justify-between items-end mt-4">
            <p className="text-lg font-extrabold text-primary">{formatPrice(event.price)}</p>
            <span className={`badge ${
              event.status === 'approved' ? 'badge-success' :
              event.status === 'pending' ? 'badge-warning' :
              'badge-error'
            }`}>
              {typeof event.status === 'string' ? event.status : String(event.status) || 'pending'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}