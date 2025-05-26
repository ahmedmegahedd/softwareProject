// src/context/AuthContext.jsx
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import api from '../api';
import { useLocation } from 'react-router-dom';

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const initialState = {
  user: null,
  loading: true,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      console.log('[Auth] LOGIN_SUCCESS:', { user: action.payload.user });
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      console.log('[Auth] LOGOUT');
      return { user: null, loading: false, error: null };
    case 'LOADED_USER':
      console.log('[Auth] LOADED_USER:', { user: action.payload.user });
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null
      };
    case 'SET_LOADING':
      if (action.payload === false) {
        console.log('[Auth] Loading complete');
      }
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    case 'SET_ERROR':
      console.error('[Auth] Error:', action.payload);
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const location = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('[AuthContext] Attempting to load user profile...');
        const { data } = await api.get('/users/profile');
        console.log('[AuthContext] Profile response:', data);
        
        if (!data.data) {
          throw new Error('Invalid response format from server');
        }

        const user = {
          ...data.data,
          role: data.data.role || 'user'
        };
        console.log('[AuthContext] User loaded successfully:', user);
        dispatch({ type: 'LOADED_USER', payload: { user } });
      } catch (err) {
        console.error('[AuthContext] Error loading user:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        
        if (err.response?.status === 401) {
          console.log('[AuthContext] Unauthorized, logging out...');
          dispatch({ type: 'LOGOUT' });
        } else {
          dispatch({ 
            type: 'SET_ERROR', 
            payload: err.response?.data?.message || err.message || 'Failed to load user profile'
          });
        }
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
