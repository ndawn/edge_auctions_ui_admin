import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  accessToken: null
};

const tokenSlice = createSlice({
  initialState,
  name: 'token',
  reducers: {
    setAccessToken (state, { payload }) {
      state.accessToken = payload;
    }
  },
});

export const { setAccessToken } = tokenSlice.actions;

export default tokenSlice.reducer;
