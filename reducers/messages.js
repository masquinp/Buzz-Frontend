import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.value.push(action.payload);
    },
    loadMessages: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addMessage, loadMessages } = messageSlice.actions;
export default messageSlice.reducer;