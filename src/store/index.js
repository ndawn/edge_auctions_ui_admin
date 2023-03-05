import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/api';
import customizationReducer from './slices/customization';
import tokenReducer from './slices/token';

export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    token: tokenReducer,
    customization: customizationReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});
