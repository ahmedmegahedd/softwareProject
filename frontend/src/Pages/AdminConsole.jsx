import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { updateEventStatus, updateUserRole } from '../api';

export default function AdminConsole() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/events/all'), api.get('/users')])
      .then(([evtRes, usrRes]) => {
        setEvents((evtRes.data.data || []).map(e => ({ ...e, id: e._id })));
        setUsers((usrRes.data.data || []).map(u => ({ ...u, id: u._id })));
      })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const updateEventStatusHandler = (id, status) => {
    updateEventStatus(id, status)
      .then(({ data }) => {
        setEvents(es => es.map(e => e.id === id ? { ...data.data, id } : e));
        toast.success(`Event ${status}`);
      })
      .catch(() => toast.error('Update failed'));
  };

  const updateUserRoleHandler = (id, role) => {
    updateUserRole(id, role)
      .then(({ data }) => {
        setUsers(us => us.map(u => u.id === id ? { ...data.data, id } : u));
        toast.success('User role updated');
      })
      .catch(() => toast.error('Update failed'));
  };

  const deleteUser = id => {
    if (!window.confirm('Delete this user?')) return;
    api.delete(`/users/${id}`)
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
          <table className="min-w-full rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Title</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, idx) => (
                <tr
                  key={e.id}
                  className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary/10 transition`}
                >
                  <td className="px-6 py-4">{typeof e.title === 'string' ? e.title : String(e.title)}</td>
                  <td className="px-6 py-4 capitalize">{typeof e.status === 'string' ? e.status : String(e.status)}</td>
                  <td className="px-6 py-4 space-x-4">
                    {e.status !== 'approved' && (
                      <button onClick={() => updateEventStatusHandler(e.id, 'approved')} className="btn btn-secondary">
                        Approve
                      </button>
                    )}
                    {e.status !== 'declined' && (
                      <button onClick={() => updateEventStatusHandler(e.id, 'declined')} className="btn btn-secondary">
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
          <table className="min-w-full rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u.id}
                  className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary/10 transition`}
                >
                  <td className="px-6 py-4">{typeof u.name === 'string' ? u.name : String(u.name)}</td>
                  <td className="px-6 py-4">{typeof u.email === 'string' ? u.email : String(u.email)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={e => updateUserRoleHandler(u.id, e.target.value)}
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