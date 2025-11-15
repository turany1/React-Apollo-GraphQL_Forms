import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice.ts';

export const store = configureStore({
  reducer: {
    // Реєструємо наш API slice
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Додаємо middleware RTK Query для кешування та виконання запитів
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Типи для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;