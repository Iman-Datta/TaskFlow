import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  loading: true,
  isAuthLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.isAuthLoading = action.payload;
    },

    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser, setAccessToken, setAuthLoading } =
  authSlice.actions;

export default authSlice.reducer;
