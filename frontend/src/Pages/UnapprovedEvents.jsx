import React, { useEffect, useState } from 'react';
import api, { updateEventStatus } from '../api';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

export default function UnapprovedEvents() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events/all')
      .then(({ data }) => {
        const allEvents = data.data || [];
        setPendingEvents(allEvents.filter(e => e.status === 'pending'));
      })
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  const approvePendingEvent = (id) => {
    updateEventStatus(id, 'approved')
      .then(({ data }) => {
        setPendingEvents(events => events.filter(e => e._id !== id && e.id !== id));
        toast.success('Event approved');
      })
      .catch(() => toast.error('Approval failed'));
  };

  const declinePendingEvent = (id) => {
    updateEventStatus(id, 'declined')
      .then(({ data }) => {
        setPendingEvents(events => events.filter(e => e._id !== id && e.id !== id));
        toast.success('Event declined');
      })
      .catch(() => toast.error('Decline failed'));
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="h1 mb-6">Unapproved Events (Pending)</h1>
      <div className="card overflow-auto">
        <table className="min-w-full rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Organizer</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingEvents.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-6 text-gray-400">No pending events</td></tr>
            ) : (
              pendingEvents.map((e, idx) => (
                <tr key={e._id || e.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary/10 transition`}>
                  <td className="px-6 py-4">{typeof e.title === 'string' ? e.title : String(e.title)}</td>
                  <td className="px-6 py-4">{e.organizer?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 space-x-4">
                    <button onClick={() => approvePendingEvent(e._id || e.id)} className="btn btn-primary">Approve</button>
                    <button onClick={() => declinePendingEvent(e._id || e.id)} className="btn btn-secondary">Decline</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 