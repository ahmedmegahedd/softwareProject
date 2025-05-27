import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, updateEvent, getEvent } from '../api';
import { toast } from 'react-toastify';
import { useAuthState } from '../context/AuthContext';

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthState();
  const isEditing = Boolean(id);

  useEffect(() => {
    console.log(`[EventForm] Mounted with ID: ${id}, isEditing: ${isEditing}`);
  }, [id, isEditing]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    ticketsAvailable: '',
    category: 'concert',
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'organizer')) {
      console.log('[EventForm] Unauthorized access, redirecting');
      navigate('/unauthorized');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!authLoading && user && user.role === 'organizer' && isEditing) {
      fetchEvent();
    }
    // Revoke image preview URL on unmount
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [authLoading, user, isEditing, id, imagePreview]);

  const fetchEvent = async () => {
    try {
      console.log('[EventForm] Fetching event with ID:', id);
      setLoading(true);
      setNotFound(false);
      setUnauthorized(false);
      const response = await getEvent(id);
      console.log('[EventForm] Event fetch response:', response.data);
      const event = response.data.data;
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        location: event.location,
        price: event.price,
        ticketsAvailable: event.ticketsAvailable,
        category: event.category || 'concert',
        image: null
      });
      if (event.image) {
        setImagePreview(event.image);
      }
    } catch (err) {
      console.error('[EventForm] Error fetching event:', err);
      if (err.response?.status === 404) setNotFound(true);
      else if (err.response?.status === 401) setUnauthorized(true);
      else setError('Failed to fetch event details');
      toast.error('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const validateForm = useCallback(() => {
    const requiredFields = ['title', 'description', 'date', 'location', 'price', 'ticketsAvailable'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (formData.title.length < 3) {
      toast.error('Title must be at least 3 characters long');
      return false;
    }

    if (formData.description.length < 10) {
      toast.error('Description must be at least 10 characters long');
      return false;
    }

    if (new Date(formData.date) < new Date()) {
      toast.error('Event date must be in the future');
      return false;
    }

    if (isNaN(formData.price) || formData.price <= 0) {
      toast.error('Price must be a positive number');
      return false;
    }

    if (isNaN(formData.ticketsAvailable) || formData.ticketsAvailable <= 0) {
      toast.error('Number of tickets must be a positive number');
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      setError(null);
      const eventData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'image' && value instanceof File) {
            eventData.append('image', value);
          } else {
            eventData.append(key, value);
          }
        }
      });
      if (isEditing) {
        console.log('[EventForm] Updating event:', id, formData);
        await updateEvent(id, eventData);
        toast.success('Event updated successfully');
      } else {
        await createEvent(eventData);
        toast.success('Event created successfully');
      }
      navigate('/my-events');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save event';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, isEditing, id, navigate, validateForm]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound) {
    return <div className="text-center text-red-600 mt-10">Event not found.</div>;
  }

  if (unauthorized) {
    return <div className="text-center text-red-600 mt-10">You are not authorized to edit this event.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-neutral-900 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="form-label text-gray-300">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              minLength={3}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="description" className="form-label text-gray-300">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              minLength={10}
              rows={4}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="date" className="form-label text-gray-300">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="location" className="form-label text-gray-300">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="price" className="form-label text-gray-300">Price (USD) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="ticketsAvailable" className="form-label text-gray-300">Number of Tickets *</label>
            <input
              type="number"
              id="ticketsAvailable"
              name="ticketsAvailable"
              value={formData.ticketsAvailable}
              onChange={handleChange}
              required
              min="1"
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="category" className="form-label text-gray-300">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
            >
              <option value="concert">Concert</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="image" className="form-label text-gray-300">Event Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="form-input"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="h-32 w-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/my-events')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 