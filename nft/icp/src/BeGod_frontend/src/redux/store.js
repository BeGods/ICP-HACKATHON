// store.js or index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Load the preloaded state from local storage
const preloadedState = {
  auth: { isAuthenticated: false, user: null },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

export default store;
