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
  },
});

export const { reviewUser } = reviewSlice.actions;
export default reviewSlice.reducer;