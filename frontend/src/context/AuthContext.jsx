// src/context/AuthContext.jsx
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import api from '../api';
import { useLocation } from 'react-router-dom';

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
      console.log('[Auth] LOGIN_SUCCESS:', { user: action.payload.user, token: '***' });
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'LOGOUT':
      console.log('[Auth] LOGOUT');
      localStorage.removeItem('token');
      return { user: null, token: null, loading: false };
    case 'LOADED_USER':
      console.log('[Auth] LOADED_USER:', { user: action.payload.user });
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'SET_LOADING':
      if (action.payload === false) {
        console.log('[Auth] Loading complete');
      }
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
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log(`[Auth] Token found at ${location.pathname}:`, token.slice(0, 12) + '...');
    } else {
      console.log(`[Auth] No token found at ${location.pathname}`);
    }
  }, [location.pathname]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      console.log('[AuthContext] Token on mount/location:', token, 'at', location.pathname);
      if (token) {
        try {
          const { data } = await api.get('/users/profile');
          const user = {
            ...data.data,
            role: data.data.role || 'user'
          };
          console.log('[AuthContext] User loaded:', user);
          dispatch({ type: 'LOADED_USER', payload: { user, token } });
        } catch (err) {
          console.error('[AuthContext] Error loading user:', err);
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            console.log('[AuthContext] Logging out due to 401');
            dispatch({ type: 'LOGOUT' });
          } else {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        }
      } else {
        console.log('[AuthContext] No token found, set loading to false');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadUser();
  }, [location.pathname]);

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
