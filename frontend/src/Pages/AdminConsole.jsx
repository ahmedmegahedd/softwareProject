import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

export default function AdminConsole() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/api/v1/events/all'), api.get('/api/v1/users')])
      .then(([evtRes, usrRes]) => {
        setEvents((evtRes.data.data || []).map(e => ({ ...e, id: e._id })));
        setUsers((usrRes.data.data || []).map(u => ({ ...u, id: u._id })));
      })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const updateEventStatus = (id, status) => {
    api.patch(`/api/v1/events/${id}`, { status })
      .then(({ data }) => {
        setEvents(es => es.map(e => e.id === id ? { ...data.data, id } : e));
        toast.success(`Event ${status}`);
      })
      .catch(() => toast.error('Update failed'));
  };

  const updateUserRole = (id, role) => {
    api.patch(`/api/v1/users/${id}`, { role })
      .then(({ data }) => {
        setUsers(us => us.map(u => u.id === id ? { ...data.data, id } : u));
        toast.success('User role updated');
      })
      .catch(() => toast.error('Update failed'));
  };

  const deleteUser = id => {
    if (!window.confirm('Delete this user?')) return;
    api.delete(`/api/v1/users/${id}`)
      .then(() => {
        setUsers(us => us.filter(u => u.id !== id));
        toast.success('User deleted');
      })
      .catch(() => toast.error('Deletion failed'));
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="h1 mb-6">Admin Console</h1>

      <section className="mb-8">
        <h2 className="h2 mb-4">Manage Events</h2>
        <div className="card overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="px-6 py-4">{e.title}</td>
                  <td className="px-6 py-4 capitalize">{e.status}</td>
                  <td className="px-6 py-4 space-x-4">
                    {e.status !== 'approved' && (
                      <button onClick={() => updateEventStatus(e.id, 'approved')} className="btn btn-secondary">
                        Approve
                      </button>
                    )}
                    {e.status !== 'declined' && (
                      <button onClick={() => updateEventStatus(e.id, 'declined')} className="btn btn-secondary">
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="h2 mb-4">Manage Users</h2>
        <div className="card overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="px-6 py-4">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={e => updateUserRole(u.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="user">User</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => deleteUser(u.id)} className="btn btn-secondary">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}