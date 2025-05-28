import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import Spinner from '../components/Spinner';

function groupBookingsByEvent(bookings) {
  const map = new Map();
  bookings.forEach(b => {
    const eid = b.event.id || b.event._id;
    if (!map.has(eid)) {
      map.set(eid, { ...b.event, bookings: [], totalTickets: 0, bookingIds: [] });
    }
    map.get(eid).bookings.push(b);
    map.get(eid).totalTickets += b.tickets;
    map.get(eid).bookingIds.push(b.id);
  });
  return Array.from(map.values());
}

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null, max: 1, value: 1 });

  useEffect(() => {
    api.get('/bookings')
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

  const handleOpenCancel = (booking) => {
    setCancelModal({ open: true, booking, max: booking.tickets, value: booking.tickets });
  };
  const handleCloseCancel = () => setCancelModal({ open: false, booking: null, max: 1, value: 1 });
  const handlePartialCancel = async () => {
    const { booking, value } = cancelModal;
    try {
      await api.patch(`/bookings/${booking.id}`, { tickets: value });
      setBookings(bs => bs.map(b => b.id === booking.id ? { ...b, tickets: b.tickets - value, status: (value === b.tickets ? 'cancelled' : b.status) } : b).filter(b => b.tickets > 0 && b.status !== 'cancelled'));
      toast.success(value === booking.tickets ? 'Booking cancelled' : 'Tickets cancelled');
      handleCloseCancel();
    } catch {
      toast.error('Cancellation failed');
    }
  };

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Pending', value: 'pending' },
  ];

  const filteredBookings =
    statusFilter === 'all'
      ? bookings
      : bookings.filter(b => b.status === statusFilter);

  const grouped = groupBookingsByEvent(filteredBookings);

  if (loading) return <Spinner />;

  return (
    <div className="flex-1 p-6">
      <h1 className="h1">My Bookings</h1>
      <div className="flex gap-3 mb-6">
        {statusOptions.map(opt => (
          <button
            key={opt.value}
            className={`px-4 py-2 rounded-full border font-semibold transition-colors ${
              statusFilter === opt.value
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-primary border-border hover:bg-primary/10'
            }`}
            onClick={() => setStatusFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {grouped.length === 0 ? (
        <div className="flex-center flex-col mt-section">
          <p className="text-secondary mb-4">You have no bookings{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}.</p>
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
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Total Tickets</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map((evt, idx) => (
                <tr key={evt.id || evt._id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary/10 transition`}>
                  <td className="px-6 py-4 flex items-center space-x-4">
                    <img
                      src={evt.image || '/placeholder.jpg'}
                      alt={evt.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <span className="text-secondary">{typeof evt.title === 'string' ? evt.title : String(evt.title)}</span>
                  </td>
                  <td className="px-6 py-4">{evt.totalTickets}</td>
                  <td className="px-6 py-4 capitalize">{
                    evt.bookings.every(b => b.status === 'cancelled') ? 'cancelled' :
                    evt.bookings.some(b => b.status === 'confirmed') ? 'confirmed' : evt.bookings[0].status
                  }</td>
                  <td className="px-6 py-4">
                    {evt.bookings.some(b => b.status === 'confirmed') && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleOpenCancel(evt.bookings.find(b => b.status === 'confirmed'))}
                      >
                        Cancel Tickets
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Cancel Modal */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Cancel Tickets</h2>
            <p className="mb-2">How many tickets do you want to cancel?</p>
            <input
              type="number"
              min={1}
              max={cancelModal.max}
              value={cancelModal.value}
              onChange={e => setCancelModal(m => ({ ...m, value: Math.max(1, Math.min(cancelModal.max, Number(e.target.value))) }))}
              className="form-input mb-4"
            />
            <div className="flex justify-end gap-2">
              <button className="btn btn-secondary" onClick={handleCloseCancel}>Close</button>
              <button className="btn btn-danger" onClick={handlePartialCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}