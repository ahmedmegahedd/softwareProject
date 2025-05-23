import React from 'react';

export default function MyEvents({ events, onEdit, onDelete }) {
  return (
    <div className="overflow-auto bg-white rounded-2xl shadow mb-8">
      <table className="min-w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-sm font-medium">Title</th>
            <th className="px-6 py-3 text-sm font-medium">Date</th>
            <th className="px-6 py-3 text-sm font-medium">Tickets Sold</th>
            <th className="px-6 py-3 text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(evt => (
            <tr key={evt.id} className="border-t">
              <td className="px-6 py-4">{evt.title}</td>
              <td className="px-6 py-4">{evt.date && evt.date.substring(0, 10)}</td>
              <td className="px-6 py-4">{evt.ticketsSold ?? 0}</td>
              <td className="px-6 py-4 space-x-4">
                <button
                  onClick={() => onEdit(evt)}
                  className="text-sm font-medium text-[#FF5700] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(evt.id)}
                  className="text-sm font-medium text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}