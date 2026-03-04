import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        firstname: null,
        lastname: null,
        email: null,
        username: null,
        password:null,
    },
};

export const reviewSlice = createSlice ({
    name: "profile",
    initialState,
    reducers: {
       profileUser: (state, action) => {
        state.value.firstname = action.payload.firstname;
        state.value.lastname = action.payload.lastname;
        state.value.email = action.payload.email;
        state.value.username = action.payload.username;
        state.value.password = action.payload.password;
       }
    }
})

export const { profileUser } = profileSlice.actions;
export default profileSlice.reducer;