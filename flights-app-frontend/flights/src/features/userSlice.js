import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
    name: "user",
    initialState: {
      user: null,
      token: ""
    },
    reducers: {
      login: (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
      },
      logout: (state) => {
        state.user = null
        state.token = ""
      }    
    }
})

export const  {login, logout} = userSlice.actions

export const selectUser = (state) => state.user.user

export default userSlice.reducer