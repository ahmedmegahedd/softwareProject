import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api';
import Spinner from '../components/Spinner';
import MyEvents from './MyEvents';
import Modal from '../components/Modal';
import EventForm from '../components/EventForm';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export default function OrganizerPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/users/events');
      setEvents(
        (data.data || []).map(e => ({
          ...e,
          id: e._id,
          ticketsSold: e.ticketsSold ?? 0
        }))
      );
    } catch (err) {
      console.error('Error fetching events:', err);
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const openEdit = evt => {
    setSelectedEvent(evt);
    setModalOpen(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(es => es.filter(e => e.id !== id));
      toast.success('Event deleted');
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Deletion failed');
    }
  };

  const handleSave = async formData => {
    try {
      const call = selectedEvent
        ? api.put(`/events/${selectedEvent.id}`, formData)
        : api.post('/events', formData);
      
      const { data } = await call;
      if (selectedEvent) {
        setEvents(es => es.map(e => e.id === selectedEvent.id ? { ...data.data, id: data.data._id } : e));
        toast.success('Event updated');
      } else {
        setEvents(es => [...es, { ...data.data, id: data.data._id }]);
        toast.success('Event created');
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving event:', err);
      toast.error(selectedEvent ? 'Update failed' : 'Creation failed');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
        <button
          onClick={openCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {event.ticketsSold} / {event.ticketsAvailable} tickets sold
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => openEdit(event)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedEvent ? 'Edit Event' : 'Create Event'}
      >
        <EventForm
          event={selectedEvent}
          onSubmit={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <section className="mt-section">
        <h2 className="h2">Analytics</h2>
        <div className="card p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={events.map(e => ({ name: e.title, sold: e.ticketsSold }))}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#FF5700" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}