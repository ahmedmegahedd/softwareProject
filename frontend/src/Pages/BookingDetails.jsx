import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/bookings/${id}`)
      .then(({ data }) => {
        setBooking(data.data);
        setError('');
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load booking');
      })
      .finally(() => setLoading(false));
    AOS.init({ duration: 700, once: true });
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(true);
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Booking canceled');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cancellation failed');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="flex-center min-h-screen text-error">{error}</div>;
  if (!booking) return null;

  const { event, tickets, totalPrice, status, createdAt } = booking;

  return (
    <div className="flex-center min-h-screen bg-background px-4">
      <div className="bg-surface rounded-xl shadow-lg p-8 w-full max-w-lg border border-border" data-aos="fade-up">
        <h1 className="h1 mb-4">Booking Details</h1>
        <div className="space-y-4">
          <div>
            <span className="block text-primary text-sm">Event</span>
            <span className="block text-lg text-text font-semibold">{typeof event?.title === 'string' ? event.title : String(event?.title)}</span>
          </div>
          <div>
            <span className="block text-primary text-sm">Date</span>
            <span className="block text-lg text-text font-semibold">{event?.date && (typeof event.date === 'string' || typeof event.date === 'number' ? new Date(event.date).toLocaleDateString() : String(event.date))}</span>
          </div>
          <div>
            <span className="block text-primary text-sm">Location</span>
            <span className="block text-lg text-text font-semibold">{typeof event?.location === 'string' ? event.location : String(event?.location)}</span>
          </div>
          <div>
            <span className="block text-primary text-sm">Tickets</span>
            <span className="block text-lg text-text font-semibold">{typeof tickets === 'number' ? tickets : String(tickets)}</span>
          </div>
          <div>
            <span className="block text-primary text-sm">Total Price</span>
            <span className="block text-lg text-text font-semibold">${typeof totalPrice === 'number' ? totalPrice : String(totalPrice)}</span>
          </div>
          <div>
            <span className="block text-primary text-sm">Status</span>
            <span className={`block text-lg font-semibold capitalize ${status === 'confirmed' ? 'text-success' : 'text-error'}`}>{typeof status === 'string' ? status : String(status)}</span>
          </div>
          <div>
            <span className="block text-primary text-sm">Booked At</span>
            <span className="block text-lg text-text font-semibold">{createdAt && (typeof createdAt === 'string' || typeof createdAt === 'number' ? new Date(createdAt).toLocaleString() : String(createdAt))}</span>
          </div>
        </div>
        {status === 'confirmed' && (
          <button
            className="btn btn-secondary w-full mt-6"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        )}
        <button
          className="btn btn-primary w-full mt-2"
          onClick={() => navigate('/bookings')}
        >
          Back to My Bookings
        </button>
      </div>
    </div>
  );
} 