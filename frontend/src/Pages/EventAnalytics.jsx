import React, { useState, useEffect } from 'react';
import { getEventAnalytics } from '../api';
import { toast } from 'react-toastify';
import { useAuthState } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function EventAnalytics() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
      navigate('/unauthorized');
      return;
    }
    fetchEvents();
  }, [user, navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEventAnalytics();
      setEvents(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch event analytics');
      toast.error('Failed to fetch event analytics');
    } finally {
      setLoading(false);
    }
  };

  const calculateBookingPercentage = (event) => {
    const totalTickets = event?.totalTickets || 0;
    const bookedTickets = event?.ticketsSold || 0;
    return totalTickets > 0 ? ((bookedTickets / totalTickets) * 100).toFixed(1) : 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {user.role === 'admin' ? 'All Events Analytics' : 'My Events Analytics'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const bookingPercentage = calculateBookingPercentage(event);
          const status = event?.status || 'pending';

          return (
            <div key={event?.id || Math.random()} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{event?.title || 'Untitled Event'}</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Booking Progress</span>
                    <span className="text-sm font-medium text-gray-700">{bookingPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-orange-500 h-2.5 rounded-full"
                      style={{ width: `${bookingPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Total Tickets</p>
                    <p className="text-lg font-semibold">{event?.totalTickets || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Booked Tickets</p>
                    <p className="text-lg font-semibold">{event?.ticketsSold || 0}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Available Tickets</p>
                  <p className="text-lg font-semibold">{event?.ticketsAvailable || 0}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`text-lg font-semibold ${getStatusColor(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-lg font-semibold">${(event?.revenue || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {user.role === 'admin' 
              ? 'No events found in the system.' 
              : 'No events found. Create your first event to see analytics.'}
          </p>
        </div>
      )}
    </div>
  );
} 