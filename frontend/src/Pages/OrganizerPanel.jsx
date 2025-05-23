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
    api.get('/users/events')
      .then(({ data }) => {
        setEvents(
          (data.data || []).map(e => ({
            ...e,
            id: e._id,
            ticketsSold: e.ticketsSold ?? 0
          }))
        );
      })
      .catch(() => toast.error('Failed to load your events'))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const openEdit = evt => {
    setSelectedEvent(evt);
    setModalOpen(true);
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this event?')) return;
    api.delete(`/events/${id}`)
      .then(() => {
        setEvents(es => es.filter(e => e.id !== id));
        toast.success('Event deleted');
      })
      .catch(() => toast.error('Deletion failed'));
  };

  const handleSave = formData => {
    const call = selectedEvent
      ? api.patch(`/events/${selectedEvent.id}`, formData)
      : api.post('/events', formData);

    call
      .then(({ data }) => {
        const ev = { ...data.data, id: data.data._id, ticketsSold: data.data.ticketsSold ?? 0 };
        setEvents(es =>
          selectedEvent ? es.map(e => (e.id === ev.id ? ev : e)) : [...es, ev]
        );
        toast.success(selectedEvent ? 'Event updated' : 'Event created');
        setModalOpen(false);
      })
      .catch(() => toast.error('Save failed'));
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="h1">Organizer Dashboard</h1>
        <button onClick={openCreate} className="btn btn-primary">
          + New Event
        </button>
      </div>

      <MyEvents events={events} onEdit={openEdit} onDelete={handleDelete} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedEvent ? 'Edit Event' : 'Create Event'}
      >
        <EventForm
          initialData={selectedEvent}
          onSave={handleSave}
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