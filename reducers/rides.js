import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const rideSlice = createSlice({
  name: "rides",
  initialState,
  reducers: {
    addRide: (state, action) => {
      state.value.push(action.payload);
    },
    deleteRide: (state, action) => {
      state.value = state.value.filter((ride) => ride._id !== action.payload);
    },
    loadRides: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addRide, deleteRide, loadRides } = rideSlice.actions;
export default rideSlice.reducer;
