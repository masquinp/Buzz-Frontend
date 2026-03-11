import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    loadConversations: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {  loadConversations } = conversationsSlice.actions;
export default conversationsSlice.reducer;
