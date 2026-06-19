import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {}
}

const userReducer = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state, action) => {
            state.user = action.payload
        }
    }
})

export const { updateUser } = userReducer.actions;

export const userReducer = userReducer.reducer; 