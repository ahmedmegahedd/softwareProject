import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ event, horizontal = false }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className={`card p-4 ${horizontal ? 'flex items-center' : ''}`}
    >
      <img
        src={event.image || '/placeholder.jpg'}
        alt={event.title}
        className={`${horizontal ? 'w-32 h-32' : 'w-full h-48'} object-cover rounded-lg`}
      />
      <div className={`${horizontal ? 'ml-4 flex-1' : 'mt-4'}`}>
        <h3 className="h2">{event.title}</h3>
        <p className="text-secondary">{event.date} • {event.location}</p>
        <p className="font-bold mt-1">${event.price}</p>
        <button className="btn btn-primary mt-4">
          Get Tickets
        </button>
      </div>
    </Link>
  );
}