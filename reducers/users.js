import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    // email: null,
    username: null,
    _id: null,
    photos: [],
    car: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      // state.value.email = action.payload.email;
      state.value.username = action.payload.username;
      state.value._id = action.payload._id;
    },
    logout: (state) => {
     state.value = {}; // on remet tous les champs à null en se déconnectant
    },
    addPhoto: (state, action) => {
      state.value.photos.push(action.payload);
    },
    removePhoto: (state, action) => {
      state.value.photos = state.value.photos.filter(
        (photo) => photo !== action.payload,
      );
    },
    addCar: (state, action) => {
      state.value.car = action.payload;
    },
    removeCar: (state, action) => {
      state.value.car = state.value.car.filter((car) => car !== action.payload);
    },
  },
});

export const { login, logout, addPhoto, removePhoto, addCar, removeCar } = userSlice.actions;
export default userSlice.reducer;
