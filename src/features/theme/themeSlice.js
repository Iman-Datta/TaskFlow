import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("theme") || "dark";

const initialState = {
  theme: saved,
  loading: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      state.loading = false;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
