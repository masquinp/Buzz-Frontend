import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    addPaidBooking: (state, action) => {
      state.value.push(action.payload);
    },
    loadPayments: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addPaidBooking, loadPayments } = paymentSlice.actions;
export default paymentSlice.reducer;
