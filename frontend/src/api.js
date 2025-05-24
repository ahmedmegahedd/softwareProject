import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Request headers:', config.headers); // Debug log
  } else {
    console.log('No token found in localStorage'); // Debug log
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Response error:', error.response?.status, error.response?.data); // Debug log
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials) => api.post('/login', credentials);
export const register = (userData) => api.post('/register', userData);
export const forgotPassword = (email) => api.put('/forgetPassword', { email });
export const resetPassword = (data) => api.put('/resetPassword', data);
export const getProfile = () => api.get('/users/profile');

// Event endpoints
export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const getMyEvents = () => api.get('/events/me');
export const getEventAnalytics = () => api.get('/users/events/analytics');

// Booking endpoints
export const createBooking = (eventId, bookingData) => api.post(`/events/${eventId}/bookings`, bookingData);
export const getMyBookings = () => api.get('/users/bookings');
export const cancelBooking = (bookingId) => api.put(`/bookings/${bookingId}/cancel`);

// User management endpoints
export const updateProfile = (userData) => api.put('/users/profile', userData);
export const changePassword = (passwordData) => api.put('/users/change-password', passwordData);

// Admin endpoints
export const getAllUsers = () => api.get('/users');
export const updateUserRole = (id, role) => api.put(`/users/${id}`, { role });
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getAllEvents = () => api.get('/events/all');
export const updateEventStatus = (id, status) => api.put(`/events/${id}`, { status });

export default api;
