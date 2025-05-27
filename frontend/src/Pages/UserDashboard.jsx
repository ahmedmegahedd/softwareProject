import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import Spinner from '../components/Spinner';

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/users/bookings')
      .then(({ data }) => {
        setBookings(
          data.data.map(b => ({
            ...b,
            id: b._id,
            event: { ...b.event, id: b.event._id }
          }))
        );
      })
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = bookingId => {
    api.delete(`/api/v1/bookings/${bookingId}`)
      .then(() => {
        setBookings(bs => bs.filter(b => b.id !== bookingId));
        toast.success('Booking canceled');
      })
      .catch(() => toast.error('Cancellation failed'));
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex-1 p-6">
      <h1 className="h1">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="flex-center flex-col mt-section">
          <p className="text-secondary mb-4">You have no bookings yet.</p>
          <Link to="/" className="btn btn-primary">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="overflow-auto mt-section">
          <table className="min-w-full rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Event</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Tickets</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr
                  key={b.id}
                  className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary/10 transition`}
                >
                  <td className="px-6 py-4 flex items-center space-x-4">
                    <img
                      src={b.event.image || '/placeholder.jpg'}
                      alt={b.event.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <span className="text-secondary">{typeof b.event.title === 'string' ? b.event.title : String(b.event.title)}</span>
                  </td>
                  <td className="px-6 py-4">{typeof b.tickets === 'number' ? b.tickets : String(b.tickets)}</td>
                  <td className="px-6 py-4 capitalize">{typeof b.status === 'string' ? b.status : String(b.status)}</td>
                  <td className="px-6 py-4">
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}