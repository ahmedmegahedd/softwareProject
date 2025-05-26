import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('[API Request]', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('[API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// No request interceptor for Authorization header needed
// No response interceptor for token expiration needed

// Auth endpoints
export const login = (credentials) => api.post('/login', credentials);
export const register = (userData) => api.post('/register', userData);
export const forgotPassword = (email) => api.put('/forgetPassword', { email });
export const resetPassword = (data) => api.put('/resetPassword', data);

// Event endpoints
export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (eventData) => api.post('/events', eventData);
export const updateEvent = (id, eventData) => api.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const getMyEvents = () => api.get('/events/my');
export const getEventAnalytics = () => api.get('/users/events/analytics');
export const getApprovedEvents = (search = '') => {
  let url = '/events?status=approved';
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  return api.get(url);
};

// Booking endpoints
export const bookEvent = (id, bookingData) => api.post(`/events/${id}/bookings`, bookingData);
export const getBookings = () => api.get('/bookings');
export const cancelBooking = (id) => api.delete(`/bookings/${id}`);

// User management endpoints
export const updateProfile = (userData) => api.put('/users/profile', userData);
export const changePassword = (passwordData) => api.put('/users/change-password', passwordData);
export const getAllUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUserRole = (id, role) => api.patch(`/users/${id}`, { role });
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;
