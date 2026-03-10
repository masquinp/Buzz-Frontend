import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [],
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    reviewUser: (state, action) => {
      state.reviews = action.payload;
    },
    addReview: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { reviewUser, addReview } = reviewSlice.actions;
export default reviewSlice.reducer;
