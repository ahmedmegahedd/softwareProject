// src/context/AuthContext.jsx
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import api from '../api';

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { user: null, token: null, loading: false };
    case 'LOADED_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount, try loading user from saved token
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/users/profile');
          dispatch({ type: 'LOADED_USER', payload: { user: data.user, token } });
        } catch (err) {
          console.error('Error loading user:', err);
          // Only clear token if it's an authentication error
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
          } else {
            // For other errors, keep the token but set loading to false
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadUser();
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (context === undefined) throw new Error('useAuthState must be used within AuthProvider');
  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) throw new Error('useAuthDispatch must be used within AuthProvider');
  return context;
}
