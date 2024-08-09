// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
};

// Initialize state from local storage
const storedAuth = JSON.parse(localStorage.getItem('auth'));
if (storedAuth) {
  initialState.isAuthenticated = storedAuth.isAuthenticated;
  initialState.user = storedAuth.user;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

// Action to handle side effects (localStorage)
export const { setUser, logoutUser } = authSlice.actions;

export const setUserAndStore = (user) => (dispatch) => {
  dispatch(setUser(user));
  localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user }));
};

export const logoutUserAndClear = () => (dispatch) => {
  dispatch(logoutUser());
  localStorage.removeItem('auth');
};

export default authSlice.reducer;
