import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    addBooking: (state, action) => {
      state.value.push(action.payload);
    },
    deleteBooking: (state, action) => {
      state.value = state.value.filter((booking) => booking._id !== action.payload);
    },
    loadBookings: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addBooking, deleteBooking, loadBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
