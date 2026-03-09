import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    // email: null,
    username: null,
    _id: null,
    photos: [],
    car: null,

    // Stripe
    stripeCustomerId: null,
    defaultPaymentMethodId: null,
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

      // si le backend renvoie déjà ces champs, on les garde
      state.value.stripeCustomerId = action.payload.stripeCustomerId || null;
      state.value.defaultPaymentMethodId =
        action.payload.defaultPaymentMethodId || null;
    },
    logout: (state) => {
      state.value.token = null;
      // state.value.email = null;
      state.value.username = null;
      state.value._id = null;
      ((state.value.car = null), (state.value.photos = []));

      // reset Stripe
      state.value.stripeCustomerId = null;
      state.value.defaultPaymentMethodId = null;
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

export const { login, logout, addPhoto, removePhoto, addCar, removeCar } =
  userSlice.actions;
export default userSlice.reducer;
