import React from 'react';
import { Link } from 'react-router-dom';

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
    <Link
      to={`/events/${event.id || event._id}`}
      className={`block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg ${
        horizontal ? 'flex items-center' : ''
      }`}
    >
      <img
        src={event.image || '/placeholder.jpg'}
        alt={event.title}
        className={`${horizontal ? 'w-32 h-32' : 'w-full h-48'} object-cover`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder.jpg';
        }}
      />
      <div className={`p-4 ${horizontal ? 'flex-1' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {formatDate(event.date)} • {event.location || 'Location TBA'}
        </p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-[#FF5700]">{formatPrice(event.price)}</p>
          <span className={`px-2 py-1 rounded-full text-xs ${
            event.status === 'approved' ? 'bg-green-100 text-green-800' :
            event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {event.status || 'pending'}
          </span>
        </div>
      </div>
    </Link>
  );
}