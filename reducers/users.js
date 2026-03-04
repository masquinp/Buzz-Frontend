import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
    },
    addPhoto: (state, action) => {
      state.value.photos.push(action.payload);
    },
    removePhoto: (state, action) => {
      state.value.photos = state.value.photos.filter((photo) => photo !== action.payload);
    },
  },
});

export const { login, logout, addPhoto, removePhoto } = userSlice.actions;
export default userSlice.reducer;
