import React, { useState } from 'react';

export default function EventForm({ initialData = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    date: initialData.date || '',
    location: initialData.location || '',
    ticketsAvailable: initialData.ticketsAvailable || '',
    price: initialData.price || '',
    description: initialData.description || '',
    image: initialData.image || ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
        required
      />
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
        required
      />
      <input
        name="location"
        type="text"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
      />
      <input
        name="ticketsAvailable"
        type="number"
        placeholder="Tickets Available"
        value={form.ticketsAvailable}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
      />
      <input
        name="image"
        type="text"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
      />
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#FF5700] text-white rounded-full hover:scale-105 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
}