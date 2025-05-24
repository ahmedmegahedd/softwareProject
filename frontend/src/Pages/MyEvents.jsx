import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEvents, deleteEvent } from '../api';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { useAuthState } from '../context/AuthContext';

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuthState();
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyEvents();
      setEvents(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'organizer') {
      navigate('/unauthorized');
      return;
    }
    fetchEvents();
  }, [user, navigate, fetchEvents]);

  const handleDeleteClick = useCallback((event) => {
    console.log('[MyEvents] Delete clicked for event:', event._id);
    setSelectedEvent(event);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedEvent) return;
    try {
      await deleteEvent(selectedEvent._id);
      setEvents(events => events.filter(event => event._id !== selectedEvent._id));
      toast.success('Event deleted successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete event';
      toast.error(errorMsg);
    } finally {
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  }, [selectedEvent]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <button
          onClick={() => navigate('/my-events/new')}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Create New Event
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                  {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>${event.price}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span>{event.ticketsAvailable} tickets available</span>
                </div>
                {user.role === 'admin' && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Organizer: {event.organizer?.name || 'Unknown'}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => navigate(`/my-events/${event._id}/edit`)}
                  className="px-3 py-1 text-orange-600 hover:text-orange-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(event)}
                  className="px-3 py-1 text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No events found. Create your first event to get started.</p>
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}